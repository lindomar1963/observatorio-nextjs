import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'O Observatório — Observatório de Segurança Pública do Amazonas',
  description: 'Missão, visão, valores e base legal do Observatório de Segurança Pública da ALEAM.',
}

const PILARES = [
  { titulo: 'Monitoramento', descricao: 'Coleta e sistematização contínua de dados de criminalidade, violência e segurança pública nos 62 municípios do Amazonas.' },
  { titulo: 'Análise', descricao: 'Produção de relatórios técnicos, diagnósticos e estudos com metodologia científica rigorosa e transparência metodológica.' },
  { titulo: 'Proposição', descricao: 'Subsídio técnico a deputados estaduais, gestores municipais e órgãos de segurança para formulação de políticas públicas baseadas em evidências.' },
  { titulo: 'Articulação', descricao: 'Fortalecimento de redes com universidades, institutos de pesquisa, organismos federais e internacionais para cooperação técnica.' },
]

const PARCEIROS = [
  'SSP-AM — Secretaria de Segurança Pública do Amazonas',
  'SINESP — Sistema Nacional de Informações de Segurança Pública',
  'SEJUSC — Secretaria de Justiça, Direitos Humanos e Cidadania',
  'SESP-AM — Secretaria de Estado de Segurança Pública',
  'UFAM — Universidade Federal do Amazonas',
  'UEA — Universidade do Estado do Amazonas',
]

const HISTORICO = [
  { ano: '2025', evento: 'Aprovação da Resolução Legislativa nº 1.089/2025 pela ALEAM, instituindo o Observatório de Segurança Pública, vinculado à Comissão de Segurança Pública, Acesso à Justiça e Defesa Social (CSPJD), presidida pelo Dep. Dan Câmara (Republicanos).', link: null },
  { ano: '2025', evento: '3º Seminário de Segurança Inovadora — realizado nos dias 29 e 30 de maio de 2025 no Auditório Belarmino Lins, promovido pela CSPJD da ALEAM. Apresentação de casos de sucesso em segurança pública.', link: 'https://www.aleam.gov.br/terceira-edicao-do-seminario-de-seguranca-inovadora-da-aleam-apresentara-casos-de-sucesso-em-seguranca-publica/' },
  { ano: '2026', evento: 'Lançamento oficial do Portal do Observatório de Segurança Pública do Amazonas, com painéis de dados e indicadores para os 62 municípios do estado.', link: null },
]

export default function ObservatorioPage() {
  return (
    <main>
      <Nav />

      <section className="bg-obs-navy px-4 md:px-8 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <p className="text-obs-gold text-xs font-bold tracking-widest uppercase mb-4">ALEAM · Observatório de Segurança Pública</p>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-white leading-tight mb-6">
            O Observatório
          </h1>
          <p className="text-white/70 text-base leading-relaxed max-w-2xl">
            O Observatório de Segurança Pública do Amazonas é vinculado à Comissão de Segurança Pública,
            Acesso à Justiça e Defesa Social da Assembleia Legislativa do Estado do Amazonas (ALEAM).
            Atua como instância técnica independente para monitoramento, análise e produção de conhecimento
            sobre segurança pública em todo o estado.
          </p>
        </div>
      </section>

      <section className="bg-obs-navy px-4 md:px-8 py-16">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            { label: 'Missão', text: 'Produzir e disseminar conhecimento técnico-científico sobre segurança pública no Amazonas, contribuindo para a formulação de políticas públicas eficazes e a redução da violência no estado.' },
            { label: 'Visão', text: 'Ser referência nacional em pesquisa e monitoramento em segurança pública, reconhecido pela excelência técnica, imparcialidade e contribuição efetiva à cidadania amazônica.' },
            { label: 'Valores', text: 'Transparência · Rigor científico · Independência técnica · Imparcialidade política · Compromisso com direitos humanos · Respeito à diversidade amazônica.' },
          ].map((item) => (
            <div key={item.label} className="border border-white/10 p-6">
              <h2 className="text-obs-gold text-xs font-bold tracking-widest uppercase mb-3">{item.label}</h2>
              <p className="text-white/65 text-sm leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-obs-panel px-4 md:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-white mb-2">Pilares de atuação</h2>
          <p className="text-white/50 text-sm mb-10">Quatro eixos estruturantes orientam o trabalho do Observatório.</p>
          <div className="grid md:grid-cols-2 gap-6">
            {PILARES.map((p, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-obs-gold/20 border border-obs-gold/40 flex items-center justify-center text-obs-gold text-xs font-bold">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm mb-1">{p.titulo}</h3>
                  <p className="text-white/55 text-xs leading-relaxed">{p.descricao}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-obs-navy px-4 md:px-8 py-16 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-white mb-6">Base Legal</h2>
          <div className="border border-obs-gold/20 bg-obs-gold/5 p-6">
            <p className="text-obs-gold text-xs font-bold tracking-widest uppercase mb-2">Resolução Legislativa ALEAM nº 1.089/2025</p>
            <p className="text-white/70 text-sm leading-relaxed mb-4">
              Institui o Observatório de Segurança Pública, Acesso à Justiça e Defesa Social da
              Assembleia Legislativa do Estado do Amazonas, vinculado à respectiva Comissão permanente,
              com as finalidades de pesquisa, monitoramento e produção de conhecimento técnico-científico
              no campo da segurança pública.
            </p>
            <p className="text-white/40 text-xs">Publicada no Diário Oficial do Estado do Amazonas · Manaus, AM</p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-obs-navy to-[#060A14] px-4 md:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-white mb-10">Histórico</h2>
          <div className="space-y-0">
            {HISTORICO.map((item, i) => (
              <div key={i} className="flex gap-6 pb-8 relative">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-obs-gold flex items-center justify-center text-obs-navy text-xs font-bold flex-shrink-0">
                    {item.ano}
                  </div>
                  {i < HISTORICO.length - 1 && <div className="w-px flex-1 bg-obs-gold/20 mt-1" />}
                </div>
                <div className="pt-2">
                  <p className="text-white/65 text-sm leading-relaxed mb-2">{item.evento}</p>
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-xs font-bold text-obs-gold hover:text-yellow-400 transition-colors"
                    >
                      Saiba mais →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-obs-navy px-4 md:px-8 py-16 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-white mb-2">Parceiros institucionais</h2>
          <p className="text-white/50 text-sm mb-8">Organismos com protocolo de cooperação técnica ativo.</p>
          <ul className="grid md:grid-cols-2 gap-3">
            {PARCEIROS.map((p, i) => (
              <li key={i} className="flex items-start gap-3 text-white/60 text-sm">
                <span className="text-obs-gold mt-0.5 flex-shrink-0">→</span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Footer />
    </main>
  )
}
