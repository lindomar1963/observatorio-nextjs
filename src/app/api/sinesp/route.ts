/**
 * API route: /api/sinesp
 * Busca e processa os dados abertos de ocorrências criminais do SINESP
 * (Ministério da Justiça) filtrados para Manaus/AM.
 *
 * Fonte: https://dados.mj.gov.br/dataset/sistema-nacional-de-estatisticas-de-seguranca-publica
 * Cache: 12 horas (os dados são atualizados mensalmente)
 */

import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import { OBSERVATORIOS } from '@/lib/observatorios'

export const revalidate = 43200 // 12 horas
export const maxDuration = 60

const SINESP_URL =
  'http://dados.mj.gov.br/dataset/210b9ae2-21fc-4986-89c6-2006eb4db247/resource/03af7ce2-174e-4ebd-b085-384503cfb40f/download/indicadoressegurancapublicamunic.xlsx'

interface MapaTipo {
  chaves: string[]
  tipo: string
  cor: string
}

/** Mapeamento padrão (segurança pública — crime organizado e tráfico) */
const MAPA_PADRAO: MapaTipo[] = [
  { chaves: ['tráfico de drogas', 'trafico de drogas', 'tráfico'], tipo: 'Tráfico de Drogas', cor: '#DC2626' },
  { chaves: ['apreensão de cocaína', 'apreensao de cocaina', 'apreensão de maconha', 'apreensao de maconha', 'apreensão de crack', 'apreensao de crack'], tipo: 'Apreensão de Drogas', cor: '#EA580C' },
  { chaves: ['apreensão de arma', 'apreensao de arma', 'arma de fogo'], tipo: 'Apreensão de Armas', cor: '#2563EB' },
  { chaves: ['homicídio doloso', 'homicidio doloso', 'latrocínio', 'latrocinio'], tipo: 'Homicídio Faccional', cor: '#BE123C' },
]

/** Seleciona o mapeamento conforme o parâmetro ?obs= */
function getMapa(obs: string | null): MapaTipo[] {
  if (obs) {
    const config = Object.values(OBSERVATORIOS).find((o) => o.slug.includes(obs) || o.slug === `observatorio-da-${obs}`)
    if (config) {
      const mapa = config.tipos
        .filter((t) => t.sinesp.length > 0)
        .map((t) => ({ chaves: t.sinesp, tipo: t.tipo, cor: t.cor }))
      if (mapa.length > 0) return mapa
    }
  }
  return MAPA_PADRAO
}

function getCol(row: Record<string, unknown>, ...nomes: string[]): string {
  for (const nome of nomes) {
    if (row[nome] !== undefined && row[nome] !== null) return String(row[nome])
  }
  return ''
}

function getNum(row: Record<string, unknown>, ...nomes: string[]): number {
  for (const nome of nomes) {
    const v = row[nome]
    if (v !== undefined && v !== null) {
      const n = Number(v)
      if (!isNaN(n)) return n
    }
  }
  return 0
}

export interface SinespIndicador {
  tipo: string
  cor: string
  total: number
  mesRef: string // ex: "Mar/2025"
  variacao: number | null // % em relação ao mês anterior, null se não disponível
}

export interface SinespResponse {
  ok: boolean
  indicadores: SinespIndicador[]
  fonte: string
  dataExtracao: string
  erro?: string
}

export async function GET(req: NextRequest): Promise<NextResponse<SinespResponse>> {
  const obs = req.nextUrl.searchParams.get('obs')
  const MAPA_TIPOS = getMapa(obs)
  try {
    const ctrl = new AbortController()
    const timeout = setTimeout(() => ctrl.abort(), 45000)
    const res = await fetch(SINESP_URL, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; ObservatorioSegurancaAM/1.0; +https://observatoriodeseguranca.site)',
        Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,*/*',
      },
      signal: ctrl.signal,
      // Não usar cache do Next.js para o fetch interno; o revalidate do route já controla
      cache: 'no-store',
    }).finally(() => clearTimeout(timeout))

    if (!res.ok) {
      throw new Error(`SINESP retornou HTTP ${res.status}`)
    }

    const buffer = await res.arrayBuffer()
    const wb = XLSX.read(Buffer.from(buffer), { type: 'buffer' })
    const ws = wb.Sheets[wb.SheetNames[0]]
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: '' })

    // Filtra apenas Manaus/AM
    const manaus = rows.filter((row) => {
      const uf = getCol(row, 'UF', 'uf', 'Estado', 'estado').toUpperCase().trim()
      const mun = getCol(row, 'Município', 'Municipio', 'municipio', 'MUNICIPIO').toLowerCase().trim()
      return uf === 'AM' && mun.includes('manaus')
    })

    if (manaus.length === 0) {
      throw new Error('Nenhum registro de Manaus/AM encontrado no arquivo SINESP')
    }

    // Encontra o mês/ano mais recente e o anterior
    let maxAno = 0, maxMes = 0
    for (const row of manaus) {
      const ano = getNum(row, 'Ano', 'ano', 'ANO')
      const mes = getNum(row, 'Mês', 'Mes', 'mes', 'MES')
      if (ano > maxAno || (ano === maxAno && mes > maxMes)) {
        maxAno = ano
        maxMes = mes
      }
    }

    // Mês anterior
    const antAno = maxMes === 1 ? maxAno - 1 : maxAno
    const antMes = maxMes === 1 ? 12 : maxMes - 1

    const mesesPt = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
    const mesRef = `${mesesPt[maxMes - 1]}/${maxAno}`

    // Agrupa por tipo do Observatório para o mês mais recente e o anterior
    const totaisAtual: Record<string, number> = {}
    const totaisAnterior: Record<string, number> = {}

    for (const row of manaus) {
      const natureza = getCol(row, 'Natureza', 'natureza', 'NATUREZA').toLowerCase().trim()
      const qtd = getNum(row, 'Ocorrências', 'Ocorrencias', 'ocorrencias', 'Qtde_Ocorrencias', 'OCORRENCIAS', 'qtde')
      const ano = getNum(row, 'Ano', 'ano', 'ANO')
      const mes = getNum(row, 'Mês', 'Mes', 'mes', 'MES')

      const tipoDef = MAPA_TIPOS.find((t) => t.chaves.some((c) => natureza.includes(c)))
      if (!tipoDef) continue

      if (ano === maxAno && mes === maxMes) {
        totaisAtual[tipoDef.tipo] = (totaisAtual[tipoDef.tipo] ?? 0) + qtd
      } else if (ano === antAno && mes === antMes) {
        totaisAnterior[tipoDef.tipo] = (totaisAnterior[tipoDef.tipo] ?? 0) + qtd
      }
    }

    const indicadores: SinespIndicador[] = MAPA_TIPOS.map(({ tipo, cor }) => {
      const total = totaisAtual[tipo] ?? 0
      const anterior = totaisAnterior[tipo] ?? null
      const variacao =
        anterior !== null && anterior > 0
          ? Math.round(((total - anterior) / anterior) * 100)
          : null
      return { tipo, cor, total, mesRef, variacao }
    }).filter((i) => i.total > 0)

    return NextResponse.json({
      ok: true,
      indicadores,
      fonte: 'SINESP / Ministério da Justiça e Segurança Pública',
      dataExtracao: new Date().toISOString(),
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[/api/sinesp]', msg)
    return NextResponse.json(
      {
        ok: false,
        indicadores: [],
        fonte: 'SINESP',
        dataExtracao: new Date().toISOString(),
        erro: msg,
      },
      { status: 502 }
    )
  }
}
