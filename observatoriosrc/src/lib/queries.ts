import { supabase } from './supabase'
import type { DadosDiarios, Indicadores, Relatorio, MunicipioDestaque } from './types'

// Dados fixos usados como fallback quando o banco está vazio
const FALLBACK: DadosDiarios = {
  indicadores: {
    cvli_12m: 1847,
    cvli_variacao: -5.2,
    roubos_ano: 17243,
    roubos_variacao: 2.1,
    violencia_domestica_ano: 3892,
    violencia_domestica_variacao: -8.4,
    municipios_monitorados: 62,
    municipios_com_plano: 38,
    municipios_em_alerta: 14,
    atualizado_em: new Date().toISOString(),
    fonte: 'SSP-AM / SINESP',
  },
  relatorios: [
    { id: 1, titulo: 'Segurança Pública no Interior do Amazonas — 1º Trimestre 2026', categoria: 'Segurança Pública', publicado_em: '2026-05-02', paginas: 48, acessos: 2341, arquivo_url: null },
    { id: 2, titulo: 'Mapeamento do Acesso à Justiça nas Calhas dos Rios Amazônicos', categoria: 'Acesso à Justiça', publicado_em: '2026-04-18', paginas: 62, acessos: 1887, arquivo_url: null },
    { id: 3, titulo: 'Diagnóstico da Violência Juvenil e Fatores de Risco no Amazonas', categoria: 'Defesa Social', publicado_em: '2026-04-05', paginas: 55, acessos: 3102, arquivo_url: null },
  ],
  municipios_destaque: [
    { nome: 'Manaus', cvli: 1124, risco: 'Alto' },
    { nome: 'Parintins', cvli: 89, risco: 'Médio' },
    { nome: 'Itacoatiara', cvli: 74, risco: 'Médio' },
  ],
  tendencia_mensal: [155, 138, 162, 144, 151, 133, 147, 139, 158, 141, 136, 123],
}

export async function getIndicadores(): Promise<Indicadores> {
  try {
    if (!supabase) return FALLBACK.indicadores
    const { data, error } = await supabase
      .from('indicadores_diarios')
      .select('*')
      .order('data', { ascending: false })
      .limit(1)
      .single()

    if (error || !data) return FALLBACK.indicadores
    return data as Indicadores
  } catch {
    return FALLBACK.indicadores
  }
}

export async function getRelatorios(limit = 3): Promise<Relatorio[]> {
  try {
    if (!supabase) return FALLBACK.relatorios
    const { data, error } = await supabase
      .from('relatorios')
      .select('*')
      .order('publicado_em', { ascending: false })
      .limit(limit)

    if (error || !data || data.length === 0) return FALLBACK.relatorios
    return data as Relatorio[]
  } catch {
    return FALLBACK.relatorios
  }
}

export async function getMunicipiosDestaque(): Promise<MunicipioDestaque[]> {
  try {
    if (!supabase) return FALLBACK.municipios_destaque
    const { data, error } = await supabase
      .from('municipios_destaque')
      .select('nome, cvli, risco')
      .order('cvli', { ascending: false })
      .limit(5)

    if (error || !data || data.length === 0) return FALLBACK.municipios_destaque
    return data as MunicipioDestaque[]
  } catch {
    return FALLBACK.municipios_destaque
  }
}

export async function getTendenciaMensal(): Promise<number[]> {
  try {
    if (!supabase) return FALLBACK.tendencia_mensal
    const { data, error } = await supabase
      .from('tendencia_mensal')
      .select('valor')
      .order('mes', { ascending: true })
      .limit(12)

    if (error || !data || data.length === 0) return FALLBACK.tendencia_mensal
    return data.map((d: { valor: number }) => d.valor)
  } catch {
    return FALLBACK.tendencia_mensal
  }
}

export async function getDadosDiarios(): Promise<DadosDiarios> {
  const [indicadores, relatorios, municipios_destaque, tendencia_mensal] = await Promise.all([
    getIndicadores(),
    getRelatorios(),
    getMunicipiosDestaque(),
    getTendenciaMensal(),
  ])
  return { indicadores, relatorios, municipios_destaque, tendencia_mensal }
}
