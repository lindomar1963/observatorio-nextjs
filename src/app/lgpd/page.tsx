import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'LGPD — Observatório de Segurança Pública do Amazonas',
}

const DIREITOS = [
  { titulo: 'Acesso', descricao: 'Confirmar a existência de tratamento e acessar seus dados pessoais.' },
  { titulo: 'Correção', descricao: 'Solicitar a correção de dados incompletos, inexatos ou desatualizados.' },
  { titulo: 'Anonimização ou exclusão', descricao: 'Pedir a anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desconformidade.' },
  { titulo: 'Portabilidade', descricao: 'Solicitar a portabilidade dos dados a outro fornecedor de serviço ou produto.' },
  { titulo: 'Revogação de consentimento', descricao: 'Revogar o consentimento dado a qualquer momento, mediante manifestação expressa.' },
  { titulo: 'Informação sobre compartilhamento', descricao: 'Obter informação sobre as entidades com as quais o controlador compartilhou dados.' },
]

export default function LgpdPage() {
  return (
    <main>
      <Nav />
      <section className="bg-obs-navy px-4 md:px-8 py-16">
        <div className="max-w-3xl mx-auto">
          <p className="text-obs-gold text-xs font-bold tracking-widest uppercase mb-4">Lei nº 13.709/2018</p>
          <h1 className="font-display text-3xl font-bold text-white mb-4">Lei Geral de Proteção de Dados</h1>
          <p className="text-white/60 text-sm max-w-xl">
            O Observatório de Segurança Pública da ALEAM trata dados pessoais em conformidade com a
            Lei Geral de Proteção de Dados (LGPD), garantindo os direitos dos titulares e a segurança
            das informações.
          </p>
        </div>
      </section>
      <section className="bg-obs-navy px-4 md:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-xl font-bold text-white mb-6">Seus direitos como titular</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {DIREITOS.map((d, i) => (
              <div key={i} className="border border-obs-border bg-obs-card p-4">
                <h3 className="text-obs-gold text-xs font-bold tracking-widest uppercase mb-2">{d.titulo}</h3>
                <p className="text-white/60 text-xs leading-relaxed">{d.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-obs-navy px-4 md:px-8 py-10 border-t border-white/10">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-xl font-bold text-white mb-4">Como exercer seus direitos</h2>
          <p className="text-white/60 text-sm leading-relaxed mb-6">
            Para exercer qualquer dos seus direitos como titular de dados, envie solicitação para
            o e-mail <span className="text-obs-gold">coordenacao@observatoriodeseguranca.site</span> identificando-se
            e descrevendo o direito que deseja exercer. O prazo de resposta é de até 15 dias úteis.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/privacidade" className="inline-block bg-obs-gold text-obs-navy font-bold text-sm px-6 py-3 hover:bg-yellow-500 transition-colors">
              Política de Privacidade
            </Link>
            <Link href="/contato" className="inline-block border border-white/30 text-white font-semibold text-sm px-6 py-3 hover:border-white/60 transition-colors">
              Contato
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
