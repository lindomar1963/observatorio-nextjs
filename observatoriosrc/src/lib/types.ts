export interface Indicadores {
  cvli_12m: number
  cvli_variacao: number
  roubos_ano: number
  roubos_variacao: number
  violencia_domestica_ano: number
  violencia_domestica_variacao: number
  municipios_monitorados: number
  municipios_com_plano: number
  municipios_em_alerta: number
  atualizado_em: string
  fonte: string
}

export interface Relatorio {
  id: number
  titulo: string
  categoria: string
  publicado_em: string
  paginas: number
  acessos: number
  arquivo_url: string | null
}

export interface MunicipioDestaque {
  nome: string
  cvli: number
  risco: 'Alto' | 'Médio' | 'Baixo'
}

export interface DadosDiarios {
  indicadores: Indicadores
  relatorios: Relatorio[]
  municipios_destaque: MunicipioDestaque[]
  tendencia_mensal: number[]
}
