import { supabaseBrowser } from './supabase-browser'

export type ZonaManaus =
  | 'Norte'
  | 'Sul'
  | 'Leste'
  | 'Oeste'
  | 'Centro-Sul'
  | 'Centro-Oeste'

export type TipoOcorrencia =
  | 'Tráfico de Drogas'
  | 'Crime Organizado'
  | 'Apreensão de Drogas'
  | 'Apreensão de Armas'
  | 'Homicídio Faccional'

export interface Ocorrencia {
  id: number
  tipo: TipoOcorrencia
  zona: ZonaManaus
  bairro: string
  lat: number
  lng: number
  data: string // ISO yyyy-mm-dd
}

// Foco do mapa: crime organizado e tráfico de drogas em Manaus.
export const TIPOS: { tipo: TipoOcorrencia; cor: string }[] = [
  { tipo: 'Tráfico de Drogas',   cor: '#EF4444' }, // vermelho vivo
  { tipo: 'Crime Organizado',    cor: '#8B5CF6' }, // violeta
  { tipo: 'Apreensão de Drogas', cor: '#F59E0B' }, // âmbar
  { tipo: 'Apreensão de Armas',  cor: '#06B6D4' }, // ciano
  { tipo: 'Homicídio Faccional', cor: '#EC4899' }, // rosa/magenta
]

export function corPorTipo(t: TipoOcorrencia): string {
  return TIPOS.find((x) => x.tipo === t)?.cor ?? '#64748B'
}

export interface ZonaInfo {
  zona: ZonaManaus
  centro: [number, number]
  bairros: string[]
}

export const ZONAS: ZonaInfo[] = [
  { zona: 'Norte', centro: [-3.0, -59.98], bairros: ['Cidade Nova', 'Novo Aleixo', 'Monte das Oliveiras', 'Nova Cidade', 'Lago Azul'] },
  { zona: 'Sul', centro: [-3.135, -60.015], bairros: ['Centro', 'Educandos', 'Cachoeirinha', 'Japiim', 'Petrópolis', 'Colônia Oliveira Machado'] },
  { zona: 'Leste', centro: [-3.04, -59.91], bairros: ['Jorge Teixeira', 'São José Operário', 'Zumbi dos Palmares', 'Coroado', 'Tancredo Neves'] },
  { zona: 'Oeste', centro: [-3.085, -60.075], bairros: ['Compensa', 'Santo Antônio', 'São Jorge', 'Glória', 'Vila da Prata', 'Lírio do Vale'] },
  { zona: 'Centro-Sul', centro: [-3.095, -60.005], bairros: ['Adrianópolis', 'Aleixo', 'Chapada', 'Parque 10 de Novembro', 'Nossa Senhora das Graças'] },
  { zona: 'Centro-Oeste', centro: [-3.075, -60.035], bairros: ['Alvorada', 'Planalto', 'Da Paz', 'Dom Pedro', 'Redenção'] },
]

export const MANAUS_CENTRO: [number, number] = [-3.08, -60.0]
export const MANAUS_ZOOM = 12

// Dados de DEMONSTRAÇÃO — usados enquanto a base real (Supabase) não está conectada.
// Substituir pela tabela `ocorrencias_manaus` quando os dados oficiais estiverem disponíveis.
export const OCORRENCIAS_DEMO: Ocorrencia[] = [
  { id: 1, tipo: 'Tráfico de Drogas', zona: 'Norte', bairro: 'Cidade Nova', lat: -2.998, lng: -59.982, data: '2026-05-18' },
  { id: 2, tipo: 'Crime Organizado', zona: 'Norte', bairro: 'Novo Aleixo', lat: -3.012, lng: -59.974, data: '2026-05-10' },
  { id: 3, tipo: 'Apreensão de Drogas', zona: 'Norte', bairro: 'Monte das Oliveiras', lat: -3.005, lng: -59.99, data: '2026-04-29' },
  { id: 4, tipo: 'Homicídio Faccional', zona: 'Norte', bairro: 'Nova Cidade', lat: -2.985, lng: -59.965, data: '2026-05-02' },
  { id: 5, tipo: 'Tráfico de Drogas', zona: 'Norte', bairro: 'Lago Azul', lat: -2.99, lng: -59.96, data: '2026-05-21' },

  { id: 6, tipo: 'Tráfico de Drogas', zona: 'Sul', bairro: 'Educandos', lat: -3.146, lng: -60.018, data: '2026-05-15' },
  { id: 7, tipo: 'Apreensão de Armas', zona: 'Sul', bairro: 'Cachoeirinha', lat: -3.131, lng: -60.013, data: '2026-05-08' },
  { id: 8, tipo: 'Crime Organizado', zona: 'Sul', bairro: 'Japiim', lat: -3.108, lng: -59.998, data: '2026-04-25' },
  { id: 9, tipo: 'Tráfico de Drogas', zona: 'Sul', bairro: 'Colônia Oliveira Machado', lat: -3.139, lng: -60.005, data: '2026-05-19' },
  { id: 10, tipo: 'Homicídio Faccional', zona: 'Sul', bairro: 'Petrópolis', lat: -3.121, lng: -59.99, data: '2026-05-04' },

  { id: 11, tipo: 'Tráfico de Drogas', zona: 'Leste', bairro: 'Jorge Teixeira', lat: -3.038, lng: -59.905, data: '2026-05-20' },
  { id: 12, tipo: 'Crime Organizado', zona: 'Leste', bairro: 'São José Operário', lat: -3.05, lng: -59.918, data: '2026-05-12' },
  { id: 13, tipo: 'Homicídio Faccional', zona: 'Leste', bairro: 'Zumbi dos Palmares', lat: -3.03, lng: -59.895, data: '2026-05-06' },
  { id: 14, tipo: 'Apreensão de Drogas', zona: 'Leste', bairro: 'Coroado', lat: -3.06, lng: -59.94, data: '2026-04-28' },
  { id: 15, tipo: 'Tráfico de Drogas', zona: 'Leste', bairro: 'Tancredo Neves', lat: -3.045, lng: -59.93, data: '2026-05-22' },
  { id: 16, tipo: 'Apreensão de Armas', zona: 'Leste', bairro: 'Jorge Teixeira', lat: -3.042, lng: -59.9, data: '2026-05-01' },

  { id: 17, tipo: 'Tráfico de Drogas', zona: 'Oeste', bairro: 'Compensa', lat: -3.088, lng: -60.072, data: '2026-05-17' },
  { id: 18, tipo: 'Crime Organizado', zona: 'Oeste', bairro: 'Glória', lat: -3.095, lng: -60.058, data: '2026-05-09' },
  { id: 19, tipo: 'Homicídio Faccional', zona: 'Oeste', bairro: 'Santo Antônio', lat: -3.078, lng: -60.068, data: '2026-05-03' },
  { id: 20, tipo: 'Apreensão de Drogas', zona: 'Oeste', bairro: 'Vila da Prata', lat: -3.1, lng: -60.08, data: '2026-04-30' },
  { id: 21, tipo: 'Tráfico de Drogas', zona: 'Oeste', bairro: 'São Jorge', lat: -3.082, lng: -60.085, data: '2026-05-23' },

  { id: 22, tipo: 'Crime Organizado', zona: 'Centro-Sul', bairro: 'Aleixo', lat: -3.09, lng: -59.998, data: '2026-05-11' },
  { id: 23, tipo: 'Apreensão de Drogas', zona: 'Centro-Sul', bairro: 'Chapada', lat: -3.1, lng: -60.012, data: '2026-05-07' },
  { id: 24, tipo: 'Tráfico de Drogas', zona: 'Centro-Sul', bairro: 'Parque 10 de Novembro', lat: -3.085, lng: -60.005, data: '2026-05-16' },
  { id: 25, tipo: 'Apreensão de Armas', zona: 'Centro-Sul', bairro: 'Adrianópolis', lat: -3.103, lng: -60.0, data: '2026-04-27' },

  { id: 26, tipo: 'Tráfico de Drogas', zona: 'Centro-Oeste', bairro: 'Alvorada', lat: -3.072, lng: -60.038, data: '2026-05-14' },
  { id: 27, tipo: 'Crime Organizado', zona: 'Centro-Oeste', bairro: 'Da Paz', lat: -3.08, lng: -60.03, data: '2026-05-13' },
  { id: 28, tipo: 'Homicídio Faccional', zona: 'Centro-Oeste', bairro: 'Planalto', lat: -3.068, lng: -60.045, data: '2026-05-05' },
  { id: 29, tipo: 'Apreensão de Drogas', zona: 'Centro-Oeste', bairro: 'Redenção', lat: -3.078, lng: -60.042, data: '2026-04-26' },
  { id: 30, tipo: 'Tráfico de Drogas', zona: 'Centro-Oeste', bairro: 'Dom Pedro', lat: -3.082, lng: -60.025, data: '2026-05-24' },
]

export interface ResultadoOcorrencias {
  data: Ocorrencia[]
  demo: boolean
}

// Busca as ocorrências no Supabase; usa os dados de demonstração como fallback.
export async function getOcorrencias(): Promise<ResultadoOcorrencias> {
  if (!supabaseBrowser) return { data: OCORRENCIAS_DEMO, demo: true }
  try {
    const { data, error } = await supabaseBrowser
      .from('ocorrencias_manaus')
      .select('id, tipo, zona, bairro, lat, lng, data')
      .order('data', { ascending: false })
    if (error || !data || data.length === 0) return { data: OCORRENCIAS_DEMO, demo: true }
    return { data: data as Ocorrencia[], demo: false }
  } catch {
    return { data: OCORRENCIAS_DEMO, demo: true }
  }
}
