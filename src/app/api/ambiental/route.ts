/**
 * API route: /api/ambiental
 * Focos de calor REAIS e geolocalizados do INPE (Programa Queimadas) no Amazonas.
 *
 * Fonte: arquivos CSV diários públicos do INPE
 *   https://dataserver-coids.inpe.br/queimadas/queimadas/focos/csv/diario/Brasil/
 * Cada linha traz lat/lon reais de um foco de calor detectado por satélite.
 *
 * O acesso é tolerante a falhas: se nenhum arquivo recente estiver disponível,
 * retorna demo: true com indicadores zerados (claramente sinalizado), nunca
 * apresentando números inventados como oficiais.
 */

import { NextResponse } from 'next/server'

export const revalidate = 21600 // 6 horas
export const maxDuration = 60

export interface FocoCalor {
  id: number
  lat: number
  lon: number
  municipio: string
  dataHora: string
  satelite: string
}

export interface AmbientalIndicador {
  tipo: string
  cor: string
  total: number
  periodo: string
}

export interface AmbientalResponse {
  ok: boolean
  demo: boolean
  totalFocos: number
  periodo: string
  focos: FocoCalor[]
  indicadores: AmbientalIndicador[]
  fonte: string
  atualizadoEm: string
}

const BASE_CSV =
  'https://dataserver-coids.inpe.br/queimadas/queimadas/focos/csv/diario/Brasil'

const MAX_FOCOS = 800

function nomeArquivo(d: Date): string {
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  return `${BASE_CSV}/focos_diario_br_${y}${m}${day}.csv`
}

function semAcento(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().trim()
}

/** Faz o parse do CSV do INPE e devolve os focos do Amazonas. */
function parseCsvAmazonas(csv: string): { focos: FocoCalor[]; periodo: string } {
  const linhas = csv.split(/\r?\n/).filter((l) => l.trim().length > 0)
  if (linhas.length < 2) return { focos: [], periodo: '' }

  const header = linhas[0].split(',').map((h) => h.trim().toLowerCase())
  const idx = (...nomes: string[]) => {
    for (const n of nomes) {
      const i = header.indexOf(n)
      if (i >= 0) return i
    }
    return -1
  }

  const iLat = idx('lat', 'latitude')
  const iLon = idx('lon', 'longitude')
  const iMun = idx('municipio', 'município')
  const iEst = idx('estado')
  const iSat = idx('satelite', 'satélite')
  const iData = idx('data_hora_gmt', 'datahora', 'data')

  if (iLat < 0 || iLon < 0 || iEst < 0) return { focos: [], periodo: '' }

  const focos: FocoCalor[] = []
  let id = 1
  let periodo = ''

  for (let r = 1; r < linhas.length; r++) {
    const cols = linhas[r].split(',')
    const estado = semAcento(cols[iEst] ?? '')
    if (estado !== 'AMAZONAS') continue

    const lat = Number(cols[iLat])
    const lon = Number(cols[iLon])
    if (!isFinite(lat) || !isFinite(lon) || (lat === 0 && lon === 0)) continue

    const dataHora = iData >= 0 ? (cols[iData] ?? '').trim() : ''
    if (!periodo && dataHora) periodo = dataHora.slice(0, 10)

    focos.push({
      id: id++,
      lat,
      lon,
      municipio: iMun >= 0 ? (cols[iMun] ?? '').trim() : '',
      dataHora,
      satelite: iSat >= 0 ? (cols[iSat] ?? '').trim() : '',
    })
  }

  return { focos, periodo }
}

const INDICADORES_VAZIOS: AmbientalIndicador[] = [
  { tipo: 'Queimada / Foco de Calor', cor: '#EA580C', total: 0, periodo: '—' },
  { tipo: 'Desmatamento', cor: '#BE123C', total: 0, periodo: '—' },
  { tipo: 'Garimpo Ilegal', cor: '#CA8A04', total: 0, periodo: '—' },
  { tipo: 'Pesca / Caça Ilegal', cor: '#0891B2', total: 0, periodo: '—' },
]

function respostaDemo(): AmbientalResponse {
  return {
    ok: true,
    demo: true,
    totalFocos: 0,
    periodo: '—',
    focos: [],
    indicadores: INDICADORES_VAZIOS,
    fonte: 'INPE / Programa Queimadas (sem dados recentes disponíveis)',
    atualizadoEm: new Date().toISOString(),
  }
}

export async function GET(): Promise<NextResponse<AmbientalResponse>> {
  // O INPE costuma ter atraso de ~1 dia; tentamos os últimos dias.
  const hoje = new Date()
  for (let dias = 1; dias <= 5; dias++) {
    const d = new Date(hoje)
    d.setUTCDate(d.getUTCDate() - dias)
    const url = nomeArquivo(d)
    try {
      const ctrl = new AbortController()
      const timeout = setTimeout(() => ctrl.abort(), 12000)
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'ObservatorioSegurancaAM/1.0 (+https://observatoriodeseguranca.site)',
        },
        signal: ctrl.signal,
        cache: 'no-store',
      }).finally(() => clearTimeout(timeout))

      if (!res.ok) continue

      const csv = await res.text()
      const { focos, periodo } = parseCsvAmazonas(csv)
      if (focos.length === 0) continue

      const periodoLabel = periodo
        ? new Date(periodo + 'T00:00:00Z').toLocaleDateString('pt-BR')
        : d.toLocaleDateString('pt-BR')

      const totalFocos = focos.length
      const focosMapa = focos.slice(0, MAX_FOCOS)

      return NextResponse.json({
        ok: true,
        demo: false,
        totalFocos,
        periodo: periodoLabel,
        focos: focosMapa,
        indicadores: [
          { tipo: 'Queimada / Foco de Calor', cor: '#EA580C', total: totalFocos, periodo: periodoLabel },
          { tipo: 'Desmatamento', cor: '#BE123C', total: 0, periodo: 'PRODES/anual' },
          { tipo: 'Garimpo Ilegal', cor: '#CA8A04', total: 0, periodo: '—' },
          { tipo: 'Pesca / Caça Ilegal', cor: '#0891B2', total: 0, periodo: '—' },
        ],
        fonte: 'INPE / Programa Queimadas',
        atualizadoEm: new Date().toISOString(),
      })
    } catch {
      continue
    }
  }

  return NextResponse.json(respostaDemo())
}
