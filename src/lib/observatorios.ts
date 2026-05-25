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
