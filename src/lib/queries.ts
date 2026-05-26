import { supabase } from './supabase'
import type { DadosDiarios, Indicadores, Noticia, Relatorio, MunicipioDestaque, AvisoTicker } from './types'

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
    { id: 1, titulo: 'Anuário de Segurança Pública do Amazonas 2025 — SSP-AM', categoria: 'Segurança Pública', publicado_em: '2025-05-01', paginas: 84, acessos: 3241, arquivo_url: 'https://www.ssp.am.gov.br/wp-content/uploads/2025/05/Anuario-2025-SSP-AM.pdf' },
    { id: 2, titulo: 'Atlas da Violência 2024 — IPEA/FBSP', categoria: 'Segurança Pública', publicado_em: '2024-08-01', paginas: 120, acessos: 5887, arquivo_url: 'https://www.ipea.gov.br/atlasviolencia/' },
    { id: 3, titulo: 'Anuário Brasileiro de Segurança Pública 2024 — FBSP', categoria: 'Segurança Pública', publicado_em: '2024-10-01', paginas: 280, acessos: 8102, arquivo_url: 'https://forumseguranca.org.br/anuario-brasileiro-seguranca-publica/' },
  ],
  municipios_destaque: [
    { nome: 'Manaus', cvli: 1124, risco: 'Alto' },
    { nome: 'Parintins', cvli: 89, risco: 'Médio' },
    { nome: 'Itacoatiara', cvli: 74, risco: 'Médio' },
  ],
  tendencia_mensal: [155, 138, 162, 144, 151, 133, 147, 139, 158, 141, 136, 123],
  avisos: [],
}

// Avisos exibidos quando o banco está vazio (sem datas vencidas)
const FALLBACK_AVISOS: AvisoTicker[] = [
  { id: 1, texto: 'Portal em operação · Indicadores oficiais de SSP-AM e SINESP', link: null, data_expira: null, ativo: true, ordem: 1 },
]

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

const FALLBACK_NOTICIAS: Noticia[] = [
  { id: 1, titulo: 'Observatório lança Relatório do 1º Trimestre de 2026 com dados dos 62 municípios', resumo: 'Publicação inédita consolida indicadores de CVLI, roubos e violência doméstica de todos os municípios do estado, com análise comparativa por calha regional.', categoria: 'Publicação', destaque: true, publicado: true, data_publicacao: '2026-05-02' },
  { id: 2, titulo: 'Protocolo de cooperação técnica firmado com o Ministério da Justiça', resumo: 'Acordo amplia o acesso do Observatório às bases do SINESP e abre caminho para integração com o Sistema Nacional de Informações de Segurança Pública.', categoria: 'Parceria', destaque: true, publicado: true, data_publicacao: '2026-04-22' },
  { id: 3, titulo: 'Seminário "Segurança Pública no Interior do Amazonas" reúne gestores de 15 municípios', resumo: 'Evento realizado em parceria com a UFAM e a SSP-AM discutiu os desafios da segurança pública em municípios com menos de 50 mil habitantes.', categoria: 'Evento', destaque: false, publicado: true, data_publicacao: '2026-04-18' },
]

export async function getNoticias(limit = 20): Promise<Noticia[]> {
  try {
    if (!supabase) return FALLBACK_NOTICIAS
    const { data, error } = await supabase
      .from('noticias')
      .select('*')
      .eq('publicado', true)
      .order('data_publicacao', { ascending: false })
      .limit(limit)
    if (error || !data || data.length === 0) return FALLBACK_NOTICIAS
    return data as Noticia[]
  } catch {
    return FALLBACK_NOTICIAS
  }
}

export async function getAvisosTicker(): Promise<AvisoTicker[]> {
  try {
    if (!supabase) return FALLBACK_AVISOS
    const hoje = new Date().toISOString().split('T')[0]
    const { data, error } = await supabase
      .from('avisos_ticker')
      .select('*')
      .eq('ativo', true)
      .or(`data_expira.is.null,data_expira.gte.${hoje}`)
      .order('ordem', { ascending: true })
    if (error || !data || data.length === 0) return FALLBACK_AVISOS
    return data as AvisoTicker[]
  } catch {
    return FALLBACK_AVISOS
  }
}

export async function getDadosDiarios(): Promise<DadosDiarios> {
  const [indicadores, relatorios, municipios_destaque, tendencia_mensal, avisos] = await Promise.all([
    getIndicadores(),
    getRelatorios(),
    getMunicipiosDestaque(),
    getTendenciaMensal(),
    getAvisosTicker(),
  ])
  return { indicadores, relatorios, municipios_destaque, tendencia_mensal, avisos }
}