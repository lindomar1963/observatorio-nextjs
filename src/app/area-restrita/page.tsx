import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'Área Restrita — Observatório de Segurança Pública do Amazonas',
}

export default function AreaRestritaPage() {
  return (
    <main>
      <Nav />
      <section className="bg-obs-navy min-h-[80vh] px-4 md:px-8 py-16 flex items-center">
        <div className="max-w-md mx-auto w-full">
          <p className="text-obs-gold text-xs font-bold tracking-widest uppercase mb-4">Acesso restrito</p>
          <h1 className="font-display text-3xl font-bold text-white mb-4">Área Restrita</h1>
          <p className="text-white/55 text-sm mb-8">
            Acesso exclusivo para a equipe técnica, parlamentares credenciados e parceiros
            institucionais do Observatório. Sistema de autenticação em implantação.
          </p>
          <div className="border border-white/10 bg-white/5 p-6 mb-6">
            <div className="space-y-4">
              <div>
                <label className="text-white/50 text-xs font-bold tracking-widest uppercase block mb-2">E-mail institucional</label>
                <div className="border border-white/20 bg-white/5 px-4 py-3 text-white/30 text-sm">coordenacao@observatoriodeseguranca.site</div>
              </div>
              <div>
                <label className="text-white/50 text-xs font-bold tracking-widest uppercase block mb-2">Senha</label>
                <div className="border border-white/20 bg-white/5 px-4 py-3 text-white/30 text-sm">••••••••</div>
              </div>
              <div className="bg-obs-gold/20 border border-obs-gold/30 p-3 text-obs-gold text-xs">
                Sistema de autenticação em desenvolvimento. Disponível em breve.
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/" className="bg-obs-gold text-obs-navy font-bold text-sm px-6 py-3 hover:bg-yellow-500 transition-colors">
              ← Voltar ao início
            </Link>
            <Link href="/contato" className="border border-white/30 text-white font-semibold text-sm px-6 py-3 hover:border-white/60 transition-colors">
              Solicitar acesso
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
