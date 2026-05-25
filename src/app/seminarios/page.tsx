import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'Seminários e Capacitações — Observatório de Segurança Pública do Amazonas',
}

const EVENTOS = [
  {
    titulo: 'Seminário Regional — Calha do Médio Amazonas',
    data: '12 de junho de 2026',
    local: 'Itacoatiara, AM',
    descricao: 'Debate sobre indicadores de segurança pública nos municípios da Calha do Médio Amazonas, com participação de gestores municipais, delegados e representantes da comunidade.',
    status: 'Inscrições abertas',
  },
  {
    titulo: 'Capacitação em Segurança Comunitária para Gestores Municipais',
    data: '14 de julho de 2026',
    local: 'Manaus, AM',
    descricao: 'Capacitação de 20 horas voltada a secretários municipais de segurança, guardas municipais e gestores de políticas públicas sobre metodologias de segurança comunitária.',
    status: 'Inscrições em breve',
  },
  {
    titulo: 'Workshop: Análise Criminal e Geoprocessamento',
    data: '28 de agosto de 2026',
    local: 'Online',
    descricao: 'Treinamento técnico em ferramentas de análise criminal, uso de SIG (Sistemas de Informação Geográfica) e elaboração de mapas de calor para gestores de segurança pública.',
    status: 'Inscrições em breve',
  },
]

const REALIZADOS = [
  { titulo: 'Capacitação em Análise Criminal — SSP-AM', data: 'Março 2026', participantes: 32 },
  { titulo: 'Seminário "Segurança Pública no Interior do Amazonas"', data: 'Abril 2026', participantes: 120 },
  { titulo: 'Workshop: Indicadores de Violência Doméstica', data: 'Fevereiro 2026', participantes: 45 },
]

export default function SeminariosPage() {
  return (
    <main>
      <Nav />
      <section className="bg-obs-navy px-4 md:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <p className="text-obs-gold text-xs font-bold tracking-widest uppercase mb-4">Formação e capacitação</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">Seminários e Capacitações</h1>
          <p className="text-white/60 text-sm max-w-xl">
            Eventos, seminários, workshops e capacitações promovidos pelo Observatório de Segurança
            Pública do Amazonas para gestores, profissionais de segurança e pesquisadores.
          </p>
        </div>
      </section>
      <section className="bg-obs-navy px-4 md:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-white/50 text-xs font-bold tracking-widest uppercase mb-6">Próximos eventos</h2>
          <div className="space-y-5">
            {EVENTOS.map((e, i) => (
              <div key={i} className="border border-obs-border bg-obs-card p-5">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-obs-gold/20 text-obs-gold border border-obs-gold/30 text-xs font-bold px-2 py-0.5">{e.status}</span>
                  <span className="text-white/40 text-xs self-center">{e.data} · {e.local}</span>
                </div>
                <h3 className="text-white font-semibold text-base mb-2">{e.titulo}</h3>
                <p className="text-white/55 text-xs leading-relaxed">{e.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-obs-navy px-4 md:px-8 py-12 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-xl font-bold text-white mb-6">Eventos realizados</h2>
          <div className="space-y-3">
            {REALIZADOS.map((e, i) => (
              <div key={i} className="flex items-center gap-4 border border-white/10 p-4">
                <div className="flex-1">
                  <p className="text-white/80 text-sm font-medium">{e.titulo}</p>
                  <p className="text-white/40 text-xs">{e.data}</p>
                </div>
                <p className="text-white/40 text-xs flex-shrink-0">{e.participantes} participantes</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-obs-navy px-4 md:px-8 py-10 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <p className="text-white/55 text-sm mb-4">
            Para propor parcerias em capacitações ou solicitar realização de evento em seu município, entre em contato.
          </p>
          <Link href="/contato" className="inline-block bg-obs-gold text-obs-navy font-bold text-sm px-6 py-3 hover:bg-yellow-500 transition-colors">
            Propor parceria
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  )
}
