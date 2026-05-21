import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Notícias e Eventos — Observatório de Segurança Pública do Amazonas',
  description: 'Últimas notícias, publicações e eventos do Observatório de Segurança Pública da ALEAM.',
}

interface Noticia {
  titulo: string
  resumo: string
  data: string
  categoria: 'Nota técnica' | 'Evento' | 'Publicação' | 'Parceria' | 'Capacitação'
  destaque?: boolean
}

const NOTICIAS: Noticia[] = [
  {
    titulo: 'Observatório lança Relatório do 1º Trimestre de 2026 com dados dos 62 municípios',
    resumo: 'Publicação inédita consolida indicadores de CVLI, roubos e violência doméstica de todos os municípios do estado, com análise comparativa por calha regional.',
    data: '2026-05-02',
    categoria: 'Publicação',
    destaque: true,
  },
  {
    titulo: 'Protocolo de cooperação técnica firmado com o Ministério da Justiça',
    resumo: 'Acordo amplia o acesso do Observatório às bases do SINESP e abre caminho para integração com o Sistema Nacional de Informações de Segurança Pública.',
    data: '2026-04-22',
    categoria: 'Parceria',
    destaque: true,
  },
  {
    titulo: 'Seminário "Segurança Pública no Interior do Amazonas" reúne gestores de 15 municípios',
    resumo: 'Evento realizado em parceria com a UFAM e a SSP-AM discutiu os desafios da segurança pública em municípios com menos de 50 mil habitantes.',
    data: '2026-04-18',
    categoria: 'Evento',
  },
  {
    titulo: 'Nota Técnica sobre Feminicídio no Amazonas em 2025 é publicada',
    resumo: 'Estudo analisa o perfil das vítimas, reincidência de agressores e a efetividade das medidas protetivas de urgência no estado.',
    data: '2026-04-10',
    categoria: 'Nota técnica',
  },
  {
    titulo: 'Capacitação em análise criminal para servidores da SSP-AM',
    resumo: 'Curso de 40 horas em metodologia de análise criminal, geoprocessamento e elaboração de indicadores foi concluído por 32 analistas.',
    data: '2026-03-28',
    categoria: 'Capacitação',
  },
  {
    titulo: 'Parceria com UEA amplia pesquisas sobre violência no interior do estado',
    resumo: 'Convênio com a Universidade do Estado do Amazonas prevê desenvolvimento de dissertações e pesquisas aplicadas em municípios da Calha do Juruá.',
    data: '2026-03-15',
    categoria: 'Parceria',
  },
  {
    titulo: 'Relatório Anual de Segurança Pública 2025 disponível para download',
    resumo: 'Publicação de 180 páginas analisa a evolução dos indicadores de violência no Amazonas ao longo de 2025, com comparativo histórico desde 2019.',
    data: '2026-02-28',
    categoria: 'Publicação',
  },
  {
    titulo: 'Observatório participa do Fórum Brasileiro de Segurança Pública em São Paulo',
    resumo: 'Equipe técnica apresentou metodologia e resultados do monitoramento municipal desenvolvido no Amazonas, com destaque para abordagem em territórios ribeirinhos.',
    data: '2026-02-10',
    categoria: 'Evento',
  },
]

const catColor: Record<string, string> = {
  'Nota técnica': 'bg-obs-gold/20 text-obs-gold border-obs-gold/30',
  'Evento': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Publicação': 'bg-green-500/20 text-green-400 border-green-500/30',
  'Parceria': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Capacitação': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
}

const PROXIMOS_EVENTOS = [
  { titulo: 'Seminário Regional — Calha do Médio Amazonas', data: '12 jun 2026', local: 'Itacoatiara, AM' },
  { titulo: 'Lançamento do Boletim Trimestral — 2º Tri 2026', data: '30 jun 2026', local: 'Online / ALEAM' },
  { titulo: 'Capacitação em Segurança Comunitária para Gestores Municipais', data: '14 jul 2026', local: 'Manaus, AM' },
]

export default function NoticiasPage() {
  return (
    <main>
      <Nav />

      <section className="bg-obs-navy px-4 md:px-8 py-16">
        <div className="max-w-5xl mx-auto">
          <p className="text-obs-gold text-xs font-bold tracking-widest uppercase mb-4">Comunicação institucional</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">Notícias e Eventos</h1>
          <p className="text-white/60 text-sm max-w-xl">
            Acompanhe as publicações, eventos, parcerias e atividades técnicas do Observatório
            de Segurança Pública do Amazonas.
          </p>
        </div>
      </section>

      {/* Destaques */}
      <section className="bg-gradient-to-b from-obs-navy to-[#0F2A45] px-4 md:px-8 py-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-white/50 text-xs font-bold tracking-widest uppercase mb-6">Em destaque</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {NOTICIAS.filter((n) => n.destaque).map((n, i) => (
              <div key={i} className="border border-obs-gold/30 bg-obs-gold/5 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-bold px-2 py-0.5 border ${catColor[n.categoria]}`}>{n.categoria}</span>
                  <span className="text-white/30 text-xs">{new Date(n.data).toLocaleDateString('pt-BR')}</span>
                </div>
                <h3 className="text-white font-semibold text-base leading-snug mb-2">{n.titulo}</h3>
                <p className="text-white/55 text-xs leading-relaxed">{n.resumo}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Todas as notícias */}
      <section className="bg-[#0F2A45] px-4 md:px-8 py-10 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-white/50 text-xs font-bold tracking-widest uppercase mb-6">Todas as publicações</h2>
          <div className="space-y-4">
            {NOTICIAS.map((n, i) => (
              <div key={i} className="border border-white/10 bg-white/5 p-5 hover:border-white/20 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-bold px-2 py-0.5 border ${catColor[n.categoria]}`}>{n.categoria}</span>
                  <span className="text-white/30 text-xs">{new Date(n.data).toLocaleDateString('pt-BR')}</span>
                </div>
                <h3 className="text-white font-semibold text-sm leading-snug mb-2">{n.titulo}</h3>
                <p className="text-white/50 text-xs leading-relaxed">{n.resumo}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Próximos eventos */}
      <section className="bg-obs-navy px-4 md:px-8 py-12 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-xl font-bold text-white mb-6">Próximos eventos</h2>
          <div className="space-y-3">
            {PROXIMOS_EVENTOS.map((e, i) => (
              <div key={i} className="flex flex-col md:flex-row md:items-center gap-3 border border-white/10 p-4">
                <div className="flex-shrink-0 bg-obs-gold/20 border border-obs-gold/30 text-obs-gold text-xs font-bold px-3 py-2 text-center min-w-[100px]">
                  {e.data}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{e.titulo}</p>
                  <p className="text-white/40 text-xs">{e.local}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
