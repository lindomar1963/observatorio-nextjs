import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Termos de Uso — Observatório de Segurança Pública do Amazonas',
}

const SECOES = [
  {
    titulo: '1. Aceitação dos termos',
    texto: 'O acesso e uso deste portal implica na aceitação integral dos presentes termos. Caso não concorde com alguma condição, recomendamos que não utilize o portal.',
  },
  {
    titulo: '2. Uso das informações',
    texto: 'Os dados, relatórios e indicadores disponibilizados pelo Observatório são de acesso público e podem ser utilizados livremente, desde que citada a fonte: "Observatório de Segurança Pública do Amazonas — ALEAM". É vedado o uso com fins comerciais sem autorização prévia.',
  },
  {
    titulo: '3. Limitação de responsabilidade',
    texto: 'As informações disponibilizadas têm caráter técnico e institucional. O Observatório não se responsabiliza por interpretações equivocadas dos dados ou por decisões tomadas com base exclusiva nas informações do portal.',
  },
  {
    titulo: '4. Propriedade intelectual',
    texto: 'Os relatórios, estudos e análises produzidos pelo Observatório são de titularidade da ALEAM. A reprodução parcial é permitida com citação de fonte. A reprodução integral requer autorização prévia.',
  },
  {
    titulo: '5. Links externos',
    texto: 'Este portal pode conter links para sites de terceiros. O Observatório não se responsabiliza pelo conteúdo, disponibilidade ou práticas de privacidade desses sites.',
  },
  {
    titulo: '6. Alterações',
    texto: 'Estes termos podem ser atualizados a qualquer momento. Recomenda-se a consulta periódica. O uso continuado do portal após alterações implica a aceitação dos novos termos.',
  },
]

export default function TermosPage() {
  return (
    <main>
      <Nav />
      <section className="bg-obs-navy px-4 md:px-8 py-16">
        <div className="max-w-3xl mx-auto">
          <p className="text-obs-gold text-xs font-bold tracking-widest uppercase mb-4">Uso do portal</p>
          <h1 className="font-display text-3xl font-bold text-white mb-4">Termos de Uso</h1>
          <p className="text-white/40 text-xs">Última atualização: maio de 2026</p>
        </div>
      </section>
      <section className="bg-gradient-to-b from-obs-navy to-[#0F2A45] px-4 md:px-8 py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          {SECOES.map((s, i) => (
            <div key={i}>
              <h2 className="text-white font-semibold text-base mb-2">{s.titulo}</h2>
              <p className="text-white/60 text-sm leading-relaxed">{s.texto}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  )
}
