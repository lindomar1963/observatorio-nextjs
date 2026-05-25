/**
 * Configuração central dos Observatórios temáticos.
 *
 * Cada observatório reaproveita o mesmo mapa (zonas de Manaus) e o mesmo
 * painel de indicadores, mudando apenas os tipos de ocorrência em foco,
 * as cores e o mapeamento para as naturezas do SINESP.
 *
 * As coordenadas/zonas de Manaus são compartilhadas de `ocorrencias.ts`.
 */

import { ZONAS, type ZonaManaus } from './ocorrencias'

export interface TipoTematico {
  tipo: string
  cor: string
  /** Termos (em minúsculas) usados para casar com a "Natureza" do SINESP. Vazio = sem fonte SINESP. */
  sinesp: string[]
}

export interface OcorrenciaTematica {
  id: number
  tipo: string
  zona: ZonaManaus
  bairro: string
  lat: number
  lng: number
  data: string
}

export interface ObservatorioConfig {
  slug: string
  nome: string
  tagline: string
  descricao: string
  /** Fonte de dados reais: 'sinesp' | 'ambiental' | null (só demonstração) */
  fonte: 'sinesp' | 'ambiental' | null
  fonteLabel: string
  tipos: TipoTematico[]
  demo: OcorrenciaTematica[]
}

/**
 * Peso populacional aproximado de cada zona de Manaus (soma = 1).
 * Base: distribuição populacional por zona administrativa de Manaus (IBGE 2022
 * e dados da Prefeitura). Usado para estimar a distribuição territorial dos
 * totais oficiais agregados do SINESP — que NÃO divulga a localização de cada
 * ocorrência. É, portanto, uma estimativa territorial, não a localização real.
 */
export const PESO_ZONA: Record<ZonaManaus, number> = {
  Norte: 0.30,
  Leste: 0.27,
  Oeste: 0.13,
  Sul: 0.11,
  'Centro-Sul': 0.10,
  'Centro-Oeste': 0.09,
}

export interface CelulaEstimativa {
  tipo: string
  zona: ZonaManaus
  total: number
}

/**
 * Distribui os totais oficiais (por tipo) pelas zonas de Manaus conforme o
 * peso populacional. Retorna a contagem estimada por tipo × zona.
 */
export function estimarPorZona(
  indicadores: { tipo: string; total: number }[]
): CelulaEstimativa[] {
  const out: CelulaEstimativa[] = []
  for (const ind of indicadores) {
    for (const z of ZONAS) {
      out.push({ tipo: ind.tipo, zona: z.zona, total: Math.round(ind.total * PESO_ZONA[z.zona]) })
    }
  }
  return out
}

/**
 * Gera uma amostra de marcadores para o mapa a partir da estimativa por zona.
 * Os marcadores são limitados (cap) por célula para não poluir o mapa — os
 * números reais aparecem nos totais por zona e no painel de indicadores.
 */
export function amostrarMarcadores(
  estimativa: CelulaEstimativa[],
  maxPorCelula = 10
): OcorrenciaTematica[] {
  const out: OcorrenciaTematica[] = []
  let id = 1
  for (const cel of estimativa) {
    if (cel.total <= 0) continue
    const z = ZONAS.find((zz) => zz.zona === cel.zona)
    if (!z) continue
    const qtd = Math.min(cel.total, maxPorCelula)
    for (let i = 0; i < qtd; i++) {
      const bairro = z.bairros[i % z.bairros.length]
      const seed = cel.tipo.length * 7 + i * 13
      const jLat = ((seed % 20) - 10) / 1000
      const jLng = (((seed * 11) % 20) - 10) / 1000
      out.push({
        id: id++,
        tipo: cel.tipo,
        zona: cel.zona,
        bairro,
        lat: z.centro[0] + jLat,
        lng: z.centro[1] + jLng,
        data: '',
      })
    }
  }
  return out
}

/** Gera ocorrências de demonstração distribuídas pelas zonas de Manaus. */
function gerarDemo(tipos: string[]): OcorrenciaTematica[] {
  const out: OcorrenciaTematica[] = []
  let id = 1
  const hoje = new Date('2026-05-20')
  ZONAS.forEach((z, zi) => {
    // 4 a 6 pontos por zona
    const qtd = 4 + (zi % 3)
    for (let i = 0; i < qtd; i++) {
      const tipo = tipos[(zi + i) % tipos.length]
      const bairro = z.bairros[i % z.bairros.length]
      const jLat = (((zi * 7 + i * 13) % 20) - 10) / 1000
      const jLng = (((zi * 11 + i * 5) % 20) - 10) / 1000
      const dias = (zi * 5 + i * 3) % 28
      const d = new Date(hoje)
      d.setDate(d.getDate() - dias)
      out.push({
        id: id++,
        tipo,
        zona: z.zona,
        bairro,
        lat: z.centro[0] + jLat,
        lng: z.centro[1] + jLng,
        data: d.toISOString().slice(0, 10),
      })
    }
  })
  return out
}

export const OBSERVATORIOS: Record<string, ObservatorioConfig> = {
  mulher: {
    slug: 'observatorio-da-mulher',
    nome: 'Observatório da Mulher',
    tagline: 'Enfrentamento à violência de gênero · Manaus',
    descricao:
      'Monitoramento territorial dos crimes contra a mulher em Manaus — feminicídio, ' +
      'estupro, violência doméstica e ameaça — com base nos indicadores oficiais do SINESP.',
    fonte: 'sinesp',
    fonteLabel: 'SINESP / Ministério da Justiça',
    tipos: [
      { tipo: 'Feminicídio', cor: '#BE123C', sinesp: ['feminicídio', 'feminicidio'] },
      { tipo: 'Estupro', cor: '#DC2626', sinesp: ['estupro'] },
      { tipo: 'Violência Doméstica', cor: '#A21CAF', sinesp: ['lesão corporal', 'lesao corporal', 'violência doméstica', 'violencia domestica'] },
      { tipo: 'Ameaça', cor: '#EA580C', sinesp: ['ameaça', 'ameaca'] },
    ],
    demo: gerarDemo(['Feminicídio', 'Estupro', 'Violência Doméstica', 'Ameaça']),
  },

  crianca: {
    slug: 'observatorio-da-crianca',
    nome: 'Observatório da Criança',
    tagline: 'Proteção à infância e adolescência · Manaus',
    descricao:
      'Monitoramento dos crimes contra crianças e adolescentes em Manaus. Indicadores de ' +
      'violência sexual a partir do SINESP (estupro de vulnerável) e dados complementares de demonstração.',
    fonte: 'sinesp',
    fonteLabel: 'SINESP / Ministério da Justiça',
    tipos: [
      { tipo: 'Estupro de Vulnerável', cor: '#BE123C', sinesp: ['estupro de vulnerável', 'estupro de vulneravel', 'estupro'] },
      { tipo: 'Violência contra Criança', cor: '#DC2626', sinesp: ['lesão corporal', 'lesao corporal'] },
      { tipo: 'Trabalho Infantil', cor: '#EA580C', sinesp: [] },
      { tipo: 'Negligência / Abandono', cor: '#CA8A04', sinesp: [] },
    ],
    demo: gerarDemo(['Estupro de Vulnerável', 'Violência contra Criança', 'Trabalho Infantil', 'Negligência / Abandono']),
  },

  ambientais: {
    slug: 'observatorio-crimes-ambientais',
    nome: 'Observatório de Crimes Ambientais',
    tagline: 'Defesa do meio ambiente · Amazonas',
    descricao:
      'Monitoramento de crimes ambientais na região de Manaus e entorno — desmatamento, ' +
      'queimadas, garimpo e pesca ilegal — com dados de focos de calor do INPE quando disponíveis.',
    fonte: 'ambiental',
    fonteLabel: 'INPE / Programa Queimadas',
    tipos: [
      { tipo: 'Queimada / Foco de Calor', cor: '#EA580C', sinesp: [] },
      { tipo: 'Desmatamento', cor: '#BE123C', sinesp: [] },
      { tipo: 'Garimpo Ilegal', cor: '#CA8A04', sinesp: [] },
      { tipo: 'Pesca / Caça Ilegal', cor: '#0891B2', sinesp: [] },
    ],
    demo: gerarDemo(['Queimada / Foco de Calor', 'Desmatamento', 'Garimpo Ilegal', 'Pesca / Caça Ilegal']),
  },
}

export function getObservatorio(slug: string): ObservatorioConfig | undefined {
  return Object.values(OBSERVATORIOS).find((o) => o.slug === slug)
}
