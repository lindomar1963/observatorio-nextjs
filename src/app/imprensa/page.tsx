import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'Imprensa — Observatório de Segurança Pública do Amazonas',
}

const CONTATOS_IMPRENSA = [
  { rotulo: 'E-mail', valor: 'coordenacao@observatoriodeseguranca.site' },
  { rotulo: 'Telefone', valor: '(92) 3182-3100' },
  { rotulo: 'Horário de atendimento', valor: 'Segunda a sexta, das 8h às 14h' },
]

export default function ImprensaPage() {
  return (
    <main>
      <Nav />
      <section className="bg-obs-navy px-4 md:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <p className="text-obs-gold text-xs font-bold tracking-widest uppercase mb-4">Para jornalistas</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">Imprensa</h1>
          <p className="text-white/60 text-sm max-w-xl">
            Releases, notas, dados e materiais de apoio para jornalistas e veículos de comunicação
            que cobrem segurança pública no Amazonas.
          </p>
        </div>
      </section>
      <section className="bg-gradient-to-b from-obs-navy to-[#0F2A45] px-4 md:px-8 py-12">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="font-display text-xl font-bold text-white mb-6">Contatos de imprensa</h2>
            <div className="space-y-4">
              {CONTATOS_IMPRENSA.map((c, i) => (
                <div key={i} className="border border-white/10 p-4">
                  <p className="text-obs-gold text-xs font-bold tracking-widest uppercase mb-1">{c.rotulo}</p>
                  <p className="text-white/80 text-sm">{c.valor}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-white mb-6">Materiais disponíveis</h2>
            <div className="space-y-3">
              {['Manual de identidade visual', 'Logotipos em alta resolução', 'Fotos institucionais', 'Releases e notas oficiais'].map((item, i) => (
                <div key={i} className="flex items-center gap-3 border border-white/10 p-3">
                  <span className="text-obs-gold">→</span>
                  <span className="text-white/70 text-sm">{item}</span>
                  <span className="ml-auto text-yellow-400 text-xs font-bold">Em breve</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="bg-obs-navy px-4 md:px-8 py-10 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <p className="text-white/50 text-sm mb-4">
            Para solicitações de entrevista com a equipe técnica ou dados específicos para reportagens,
            entre em contato pela assessoria de comunicação da ALEAM.
          </p>
          <Link href="/contato" className="inline-block bg-obs-gold text-obs-navy font-bold text-sm px-6 py-3 hover:bg-yellow-500 transition-colors">
            Entrar em contato
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  )
}
