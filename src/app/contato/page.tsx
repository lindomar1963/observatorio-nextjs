import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Contato — Observatório de Segurança Pública do Amazonas',
  description: 'Entre em contato com a equipe do Observatório de Segurança Pública da ALEAM.',
}

const CANAIS = [
  {
    rotulo: 'E-mail institucional',
    valor: 'coordenacao@observatoriodeseguranca.site',
    descricao: 'Para solicitações formais, parcerias institucionais e pedidos de acesso à informação.',
  },
  {
    rotulo: 'Telefone',
    valor: '(92) 3182-3100',
    descricao: 'Assembleia Legislativa do Estado do Amazonas — solicitar ramal do Observatório.',
  },
  {
    rotulo: 'Endereço',
    valor: 'Av. Mário Ypiranga Monteiro, 3280 — Flores, Manaus/AM — CEP 69058-001',
    descricao: 'Sede da Assembleia Legislativa do Estado do Amazonas (ALEAM).',
  },
  {
    rotulo: 'Horário de atendimento',
    valor: 'Segunda a sexta, das 8h às 14h',
    descricao: 'Atendimento presencial mediante agendamento prévio por e-mail.',
  },
]

const FINALIDADES = [
  { titulo: 'Solicitação de dados', descricao: 'Pesquisadores e gestores podem solicitar microdados e séries históricas mediante justificativa técnica e assinatura de termo de uso.' },
  { titulo: 'Parcerias institucionais', descricao: 'Universidades, órgãos públicos e organizações da sociedade civil interessados em protocolo de cooperação técnica.' },
  { titulo: 'Imprensa', descricao: 'Jornalistas e veículos de comunicação que buscam informações sobre dados publicados ou entrevistas com a equipe técnica.' },
  { titulo: 'Sugestões e críticas', descricao: 'Contribuições da sociedade civil para aprimoramento dos painéis, relatórios e metodologias do Observatório.' },
]

export default function ContatoPage() {
  return (
    <main>
      <Nav />

      <section className="bg-obs-navy px-4 md:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <p className="text-obs-gold text-xs font-bold tracking-widest uppercase mb-4">Fale conosco</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">Contato</h1>
          <p className="text-white/60 text-sm max-w-xl">
            Entre em contato com a equipe técnica do Observatório de Segurança Pública da ALEAM
            para solicitações de dados, parcerias, imprensa ou qualquer outra demanda institucional.
          </p>
        </div>
      </section>

      <section className="bg-obs-navy px-4 md:px-8 py-12">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          {CANAIS.map((c, i) => (
            <div key={i} className="border border-white/10 p-6">
              <p className="text-obs-gold text-xs font-bold tracking-widest uppercase mb-2">{c.rotulo}</p>
              <p className="text-white font-semibold text-sm mb-2">{c.valor}</p>
              <p className="text-white/45 text-xs leading-relaxed">{c.descricao}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-obs-panel px-4 md:px-8 py-12 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-xl font-bold text-white mb-2">Para qual finalidade você precisa de contato?</h2>
          <p className="text-white/50 text-sm mb-8">Orientações específicas por tipo de demanda.</p>
          <div className="grid md:grid-cols-2 gap-4">
            {FINALIDADES.map((f, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 bg-obs-gold/20 border border-obs-gold/40 flex items-center justify-center text-obs-gold text-xs font-bold mt-0.5">
                  {i + 1}
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm mb-1">{f.titulo}</h3>
                  <p className="text-white/50 text-xs leading-relaxed">{f.descricao}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-obs-navy px-4 md:px-8 py-12 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-xl font-bold text-white mb-2">Lei de Acesso à Informação</h2>
          <p className="text-white/60 text-sm leading-relaxed max-w-2xl mb-6">
            O Observatório de Segurança Pública é uma instância vinculada à ALEAM, sujeita às
            disposições da Lei nº 12.527/2011 (Lei de Acesso à Informação). Pedidos formais de
            informação devem ser encaminhados pelo Sistema Eletrônico do Serviço de Informação
            ao Cidadão (e-SIC) da Assembleia Legislativa do Amazonas.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://www.aleam.gov.br"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-obs-gold text-obs-navy font-bold text-sm px-6 py-3 hover:bg-yellow-500 transition-colors"
            >
              Portal da ALEAM →
            </a>
            <a
              href="/transparencia"
              className="inline-block border border-white/30 text-white font-semibold text-sm px-6 py-3 hover:border-white/60 transition-colors"
            >
              Transparência
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
