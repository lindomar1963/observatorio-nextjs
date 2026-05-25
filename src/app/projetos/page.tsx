import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'Projetos e Captação — Observatório de Segurança Pública do Amazonas',
}

const PROJETOS = [
  {
    titulo: 'Sistema Integrado de Monitoramento Municipal (SIMM)',
    descricao: 'Desenvolvimento de plataforma tecnológica para coleta automatizada de dados de segurança pública nos 62 municípios do Amazonas, com painéis em tempo real.',
    status: 'Em execução',
    parceiros: ['ALEAM', 'SSP-AM', 'SENASP/MJ'],
    prazo: '2024–2026',
  },
  {
    titulo: 'Plano Municipal de Segurança Pública — Municípios do Interior',
    descricao: 'Apoio técnico para elaboração ou revisão de Planos Municipais de Segurança Pública em 20 municípios com menos de 50 mil habitantes.',
    status: 'Em execução',
    parceiros: ['ALEAM', 'SEJUSC', 'Prefeituras municipais'],
    prazo: '2025–2026',
  },
  {
    titulo: 'Pesquisa: Violência e Acesso à Justiça nas Calhas dos Rios',
    descricao: 'Levantamento de campo sobre acesso a serviços de segurança pública e justiça em comunidades ribeirinhas, com foco em populações indígenas e quilombolas.',
    status: 'Em elaboração',
    parceiros: ['UFAM', 'UEA', 'FUNAI'],
    prazo: '2026–2027',
  },
  {
    titulo: 'Rede Estadual de Observatórios Municipais',
    descricao: 'Criação de observatórios municipais de segurança pública nos 12 maiores municípios do interior, com metodologia e capacitação fornecidas pelo Observatório estadual.',
    status: 'Em elaboração',
    parceiros: ['ALEAM', 'Prefeituras', 'SENASP/MJ'],
    prazo: '2026–2028',
  },
]

const statusColor: Record<string, string> = {
  'Em execução': 'bg-green-500/20 text-green-400 border-green-500/30',
  'Em elaboração': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'Concluído': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
}

export default function ProjetosPage() {
  return (
    <main>
      <Nav />
      <section className="bg-obs-navy px-4 md:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <p className="text-obs-gold text-xs font-bold tracking-widest uppercase mb-4">Programas e iniciativas</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">Projetos e Captação</h1>
          <p className="text-white/60 text-sm max-w-xl">
            Projetos, programas e iniciativas em desenvolvimento pelo Observatório de Segurança
            Pública do Amazonas, em parceria com órgãos federais, estaduais e municipais.
          </p>
        </div>
      </section>
      <section className="bg-obs-navy px-4 md:px-8 py-12">
        <div className="max-w-4xl mx-auto space-y-5">
          {PROJETOS.map((p, i) => (
            <div key={i} className="border border-obs-border bg-obs-card p-5">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className={`text-xs font-bold px-2 py-0.5 border ${statusColor[p.status] || 'bg-white/10 text-white/40'}`}>
                  {p.status}
                </span>
                <span className="text-white/35 text-xs self-center">{p.prazo}</span>
              </div>
              <h3 className="text-white font-semibold text-base leading-snug mb-2">{p.titulo}</h3>
              <p className="text-white/55 text-sm leading-relaxed mb-4">{p.descricao}</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-white/30 text-xs font-semibold">Parceiros:</span>
                {p.parceiros.map((par, j) => (
                  <span key={j} className="text-obs-gold/70 text-xs">{par}{j < p.parceiros.length - 1 ? ' ·' : ''}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-obs-navy px-4 md:px-8 py-10 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-xl font-bold text-white mb-4">Captação de recursos</h2>
          <p className="text-white/60 text-sm leading-relaxed max-w-xl mb-6">
            O Observatório está aberto a parcerias com organismos nacionais e internacionais,
            fundações e agências de cooperação para financiamento de pesquisas e projetos
            de fortalecimento da segurança pública no Amazonas.
          </p>
          <Link href="/contato" className="inline-block bg-obs-gold text-obs-navy font-bold text-sm px-6 py-3 hover:bg-yellow-500 transition-colors">
            Propor parceria ou financiamento
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  )
}
