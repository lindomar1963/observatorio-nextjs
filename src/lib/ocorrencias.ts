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

export type StatusInvestigacao = 'Aberto' | 'Em Andamento' | 'Encerrado' | 'Arquivado'

export interface Ocorrencia {
  id: number
  tipo: TipoOcorrencia
  zona: ZonaManaus
  bairro: string
  municipio: string
  lat: number
  lng: number
  data: string // ISO yyyy-mm-dd
  hora: number  // 0-23
  status: StatusInvestigacao
  descricao: string
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

/** Status de investigação — cores conforme padrão de painéis de segurança */
export const STATUS_INVESTIGACAO: { status: StatusInvestigacao; cor: string }[] = [
  { status: 'Aberto',       cor: '#EF4444' }, // vermelho
  { status: 'Em Andamento', cor: '#F59E0B' }, // âmbar
  { status: 'Encerrado',    cor: '#22C55E' }, // verde
  { status: 'Arquivado',    cor: '#64748B' }, // cinza
]

/** Opções de limite de resultados exibidos no mapa */
export const LIMITES_RESULTADO = [100, 500, 1000] as const

/** Municípios do Amazonas com maior volume de registros (sede + interior) */
export const MUNICIPIOS_AM = [
  'Manaus',
  'Parintins',
  'Itacoatiara',
  'Manacapuru',
  'Coari',
  'Tefé',
  'Tabatinga',
] as const

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

/** Períodos do dia — fatias horárias com peso estatístico estimado (distribuição típica crimes urbanos Brasil) */
export const PERIODOS_DIA = [
  { id: 'madrugada', label: 'Madrugada', faixa: '00h–05h', horaMin: 0,  horaMax: 5,  peso: 0.15 },
  { id: 'manha',     label: 'Manhã',     faixa: '06h–11h', horaMin: 6,  horaMax: 11, peso: 0.20 },
  { id: 'tarde',     label: 'Tarde',     faixa: '12h–17h', horaMin: 12, horaMax: 17, peso: 0.30 },
  { id: 'noite',     label: 'Noite',     faixa: '18h–23h', horaMin: 18, horaMax: 23, peso: 0.35 },
] as const

export type PeriodoDia = (typeof PERIODOS_DIA)[number]['id']

// Dados de DEMONSTRAÇÃO — usados enquanto a base real (Supabase) não está conectada.
// Substituir pela tabela `ocorrencias_manaus` quando os dados oficiais estiverem disponíveis.
// Distribuição horária: Madrugada 15%, Manhã 20%, Tarde 30%, Noite 35%
export const OCORRENCIAS_DEMO: Ocorrencia[] = [
  { id: 1,  tipo: 'Tráfico de Drogas',   zona: 'Norte',       bairro: 'Cidade Nova',              municipio: 'Manaus', lat: -2.998,  lng: -59.982, data: '2026-05-18', hora: 21, status: 'Em Andamento', descricao: 'Ponto de venda de entorpecentes em via pública' },
  { id: 2,  tipo: 'Crime Organizado',    zona: 'Norte',       bairro: 'Novo Aleixo',              municipio: 'Manaus', lat: -3.012,  lng: -59.974, data: '2026-05-10', hora: 14, status: 'Aberto',       descricao: 'Disputa territorial entre facções rivais' },
  { id: 3,  tipo: 'Apreensão de Drogas', zona: 'Norte',       bairro: 'Monte das Oliveiras',      municipio: 'Manaus', lat: -3.005,  lng: -59.99,  data: '2026-04-29', hora: 3,  status: 'Encerrado',    descricao: 'Apreensão de maconha e cocaína em residência' },
  { id: 4,  tipo: 'Homicídio Faccional', zona: 'Norte',       bairro: 'Nova Cidade',              municipio: 'Manaus', lat: -2.985,  lng: -59.965, data: '2026-05-02', hora: 22, status: 'Aberto',       descricao: 'Homicídio com características de execução' },
  { id: 5,  tipo: 'Tráfico de Drogas',   zona: 'Norte',       bairro: 'Lago Azul',                municipio: 'Manaus', lat: -2.99,   lng: -59.96,  data: '2026-05-21', hora: 19, status: 'Em Andamento', descricao: 'Tráfico próximo a unidade escolar' },

  { id: 6,  tipo: 'Tráfico de Drogas',   zona: 'Sul',         bairro: 'Educandos',                municipio: 'Manaus', lat: -3.146,  lng: -60.018, data: '2026-05-15', hora: 15, status: 'Aberto',       descricao: 'Comércio de drogas em área portuária' },
  { id: 7,  tipo: 'Apreensão de Armas',  zona: 'Sul',         bairro: 'Cachoeirinha',             municipio: 'Manaus', lat: -3.131,  lng: -60.013, data: '2026-05-08', hora: 10, status: 'Encerrado',    descricao: 'Apreensão de armas de fogo e munição' },
  { id: 8,  tipo: 'Crime Organizado',    zona: 'Sul',         bairro: 'Japiim',                   municipio: 'Manaus', lat: -3.108,  lng: -59.998, data: '2026-04-25', hora: 23, status: 'Arquivado',    descricao: 'Extorsão a comerciantes locais' },
  { id: 9,  tipo: 'Tráfico de Drogas',   zona: 'Sul',         bairro: 'Colônia Oliveira Machado', municipio: 'Manaus', lat: -3.139,  lng: -60.005, data: '2026-05-19', hora: 18, status: 'Em Andamento', descricao: 'Distribuição de entorpecentes em beco' },
  { id: 10, tipo: 'Homicídio Faccional', zona: 'Sul',         bairro: 'Petrópolis',               municipio: 'Manaus', lat: -3.121,  lng: -59.99,  data: '2026-05-04', hora: 2,  status: 'Aberto',       descricao: 'Homicídio em via pública por disputa de tráfico' },

  { id: 11, tipo: 'Tráfico de Drogas',   zona: 'Leste',       bairro: 'Jorge Teixeira',           municipio: 'Manaus', lat: -3.038,  lng: -59.905, data: '2026-05-20', hora: 20, status: 'Em Andamento', descricao: 'Boca de fumo em conjunto habitacional' },
  { id: 12, tipo: 'Crime Organizado',    zona: 'Leste',       bairro: 'São José Operário',        municipio: 'Manaus', lat: -3.05,   lng: -59.918, data: '2026-05-12', hora: 16, status: 'Aberto',       descricao: 'Recrutamento de jovens por facção' },
  { id: 13, tipo: 'Homicídio Faccional', zona: 'Leste',       bairro: 'Zumbi dos Palmares',       municipio: 'Manaus', lat: -3.03,   lng: -59.895, data: '2026-05-06', hora: 22, status: 'Aberto',       descricao: 'Duplo homicídio com arma de fogo' },
  { id: 14, tipo: 'Apreensão de Drogas', zona: 'Leste',       bairro: 'Coroado',                  municipio: 'Manaus', lat: -3.06,   lng: -59.94,  data: '2026-04-28', hora: 9,  status: 'Encerrado',    descricao: 'Apreensão de drogas em ponto de ônibus' },
  { id: 15, tipo: 'Tráfico de Drogas',   zona: 'Leste',       bairro: 'Tancredo Neves',           municipio: 'Manaus', lat: -3.045,  lng: -59.93,  data: '2026-05-22', hora: 14, status: 'Em Andamento', descricao: 'Venda de drogas próximo a praça pública' },
  { id: 16, tipo: 'Apreensão de Armas',  zona: 'Leste',       bairro: 'Jorge Teixeira',           municipio: 'Manaus', lat: -3.042,  lng: -59.9,   data: '2026-05-01', hora: 4,  status: 'Encerrado',    descricao: 'Apreensão de pistola e fuzil' },

  { id: 17, tipo: 'Tráfico de Drogas',   zona: 'Oeste',       bairro: 'Compensa',                 municipio: 'Manaus', lat: -3.088,  lng: -60.072, data: '2026-05-17', hora: 19, status: 'Aberto',       descricao: 'Tráfico em área de ocupação irregular' },
  { id: 18, tipo: 'Crime Organizado',    zona: 'Oeste',       bairro: 'Glória',                   municipio: 'Manaus', lat: -3.095,  lng: -60.058, data: '2026-05-09', hora: 13, status: 'Em Andamento', descricao: 'Comércio ilícito controlado por facção' },
  { id: 19, tipo: 'Homicídio Faccional', zona: 'Oeste',       bairro: 'Santo Antônio',            municipio: 'Manaus', lat: -3.078,  lng: -60.068, data: '2026-05-03', hora: 21, status: 'Aberto',       descricao: 'Homicídio motivado por dívida de drogas' },
  { id: 20, tipo: 'Apreensão de Drogas', zona: 'Oeste',       bairro: 'Vila da Prata',            municipio: 'Manaus', lat: -3.1,    lng: -60.08,  data: '2026-04-30', hora: 7,  status: 'Encerrado',    descricao: 'Apreensão de entorpecentes em embarcação' },
  { id: 21, tipo: 'Tráfico de Drogas',   zona: 'Oeste',       bairro: 'São Jorge',                municipio: 'Manaus', lat: -3.082,  lng: -60.085, data: '2026-05-23', hora: 17, status: 'Em Andamento', descricao: 'Distribuição de drogas em via comercial' },

  { id: 22, tipo: 'Crime Organizado',    zona: 'Centro-Sul',  bairro: 'Aleixo',                   municipio: 'Manaus', lat: -3.09,   lng: -59.998, data: '2026-05-11', hora: 20, status: 'Aberto',       descricao: 'Lavagem de dinheiro do tráfico' },
  { id: 23, tipo: 'Apreensão de Drogas', zona: 'Centro-Sul',  bairro: 'Chapada',                  municipio: 'Manaus', lat: -3.1,    lng: -60.012, data: '2026-05-07', hora: 1,  status: 'Encerrado',    descricao: 'Apreensão de cocaína em abordagem policial' },
  { id: 24, tipo: 'Tráfico de Drogas',   zona: 'Centro-Sul',  bairro: 'Parque 10 de Novembro',    municipio: 'Manaus', lat: -3.085,  lng: -60.005, data: '2026-05-16', hora: 15, status: 'Em Andamento', descricao: 'Ponto de tráfico em área residencial' },
  { id: 25, tipo: 'Apreensão de Armas',  zona: 'Centro-Sul',  bairro: 'Adrianópolis',             municipio: 'Manaus', lat: -3.103,  lng: -60.0,   data: '2026-04-27', hora: 11, status: 'Arquivado',    descricao: 'Apreensão de arma sem registro' },

  { id: 26, tipo: 'Tráfico de Drogas',   zona: 'Centro-Oeste', bairro: 'Alvorada',               municipio: 'Manaus', lat: -3.072,  lng: -60.038, data: '2026-05-14', hora: 18, status: 'Em Andamento', descricao: 'Venda de drogas em ponto comercial' },
  { id: 27, tipo: 'Crime Organizado',    zona: 'Centro-Oeste', bairro: 'Da Paz',                 municipio: 'Manaus', lat: -3.08,   lng: -60.03,  data: '2026-05-13', hora: 16, status: 'Aberto',       descricao: 'Intimidação a testemunhas' },
  { id: 28, tipo: 'Homicídio Faccional', zona: 'Centro-Oeste', bairro: 'Planalto',               municipio: 'Manaus', lat: -3.068,  lng: -60.045, data: '2026-05-05', hora: 23, status: 'Aberto',       descricao: 'Homicídio com sinais de execução' },
  { id: 29, tipo: 'Apreensão de Drogas', zona: 'Centro-Oeste', bairro: 'Redenção',               municipio: 'Manaus', lat: -3.078,  lng: -60.042, data: '2026-04-26', hora: 8,  status: 'Encerrado',    descricao: 'Apreensão de drogas em fiscalização' },
  { id: 30, tipo: 'Tráfico de Drogas',   zona: 'Centro-Oeste', bairro: 'Dom Pedro',              municipio: 'Manaus', lat: -3.082,  lng: -60.025, data: '2026-05-24', hora: 22, status: 'Em Andamento', descricao: 'Tráfico em região de bares e casas noturnas' },

  // Interior do Amazonas (demonstração do filtro por município)
  { id: 31, tipo: 'Tráfico de Drogas',   zona: 'Norte',       bairro: 'Centro',                   municipio: 'Parintins',    lat: -2.628, lng: -56.735, data: '2026-05-12', hora: 20, status: 'Aberto',       descricao: 'Tráfico fluvial na orla' },
  { id: 32, tipo: 'Apreensão de Drogas', zona: 'Norte',       bairro: 'Centro',                   municipio: 'Itacoatiara', lat: -3.143, lng: -58.444, data: '2026-05-09', hora: 11, status: 'Encerrado',    descricao: 'Apreensão de drogas em embarcação' },
  { id: 33, tipo: 'Crime Organizado',    zona: 'Norte',       bairro: 'Centro',                   municipio: 'Manacapuru',  lat: -3.300, lng: -60.621, data: '2026-05-15', hora: 17, status: 'Em Andamento', descricao: 'Rota de escoamento de entorpecentes' },
  { id: 34, tipo: 'Apreensão de Armas',  zona: 'Norte',       bairro: 'Centro',                   municipio: 'Tabatinga',   lat: -4.252, lng: -69.938, data: '2026-05-19', hora: 9,  status: 'Encerrado',    descricao: 'Apreensão na fronteira tríplice' },
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
      .select('id, tipo, zona, bairro, municipio, lat, lng, data, hora, status, descricao')
      .order('data', { ascending: false })
    if (error || !data || data.length === 0) return { data: OCORRENCIAS_DEMO, demo: true }
    return { data: data as Ocorrencia[], demo: false }
  } catch {
    return { data: OCORRENCIAS_DEMO, demo: true }
  }
}
