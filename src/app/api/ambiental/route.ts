/**
 * API route: /api/ambiental
 * Indicadores de crimes ambientais na região de Manaus.
 *
 * Fonte pretendida: INPE / Programa Queimadas (focos de calor) e PRODES
 * (desmatamento). O acesso programático ao INPE precisa ser validado em
 * produção; enquanto isso, retorna dados de demonstração claramente
 * sinalizados (demo: true) para não apresentar números não verificados
 * como oficiais.
 */

import { NextResponse } from 'next/server'

export const revalidate = 43200 // 12 horas
export const maxDuration = 30

export interface AmbientalIndicador {
  tipo: string
  cor: string
  total: number
  periodo: string
}

export interface AmbientalResponse {
  ok: boolean
  demo: boolean
  indicadores: AmbientalIndicador[]
  fonte: string
  atualizadoEm: string
}

// Endpoint público de focos de calor do INPE (a validar em produção).
const INPE_FOCOS_AM =
  'https://queimadas.dgi.inpe.br/api/focos/?pais_id=33&estado_id=4&periodo=mes'

const DEMO: AmbientalIndicador[] = [
  { tipo: 'Queimada / Foco de Calor', cor: '#EA580C', total: 0, periodo: '—' },
  { tipo: 'Desmatamento', cor: '#BE123C', total: 0, periodo: '—' },
  { tipo: 'Garimpo Ilegal', cor: '#CA8A04', total: 0, periodo: '—' },
  { tipo: 'Pesca / Caça Ilegal', cor: '#0891B2', total: 0, periodo: '—' },
]

export async function GET(): Promise<NextResponse<AmbientalResponse>> {
  try {
    const ctrl = new AbortController()
    const timeout = setTimeout(() => ctrl.abort(), 12000)
    const res = await fetch(INPE_FOCOS_AM, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ObservatorioSegurancaAM/1.0)' },
      signal: ctrl.signal,
      cache: 'no-store',
    }).finally(() => clearTimeout(timeout))

    if (!res.ok) throw new Error(`INPE HTTP ${res.status}`)

    const json: unknown = await res.json()
    // Estrutura do INPE varia; tentamos extrair uma contagem de focos.
    let focos = 0
    if (Array.isArray(json)) focos = json.length
    else if (json && typeof json === 'object') {
      const obj = json as Record<string, unknown>
      focos = Number(obj.total ?? (Array.isArray(obj.focos) ? obj.focos.length : 0)) || 0
    }

    if (focos > 0) {
      const mes = new Date().toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
      return NextResponse.json({
        ok: true,
        demo: false,
        indicadores: [
          { tipo: 'Queimada / Foco de Calor', cor: '#EA580C', total: focos, periodo: mes },
        ],
        fonte: 'INPE / Programa Queimadas',
        atualizadoEm: new Date().toISOString(),
      })
    }
    throw new Error('INPE não retornou focos')
  } catch {
    // Fallback honesto: demonstração
    return NextResponse.json({
      ok: true,
      demo: true,
      indicadores: DEMO,
      fonte: 'INPE / PRODES (integração em validação)',
      atualizadoEm: new Date().toISOString(),
    })
  }
}
