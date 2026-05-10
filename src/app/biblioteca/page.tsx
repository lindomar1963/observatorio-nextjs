import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Link from 'next/link'
export const metadata = { title: 'Biblioteca Técnica — Observatório de Segurança Pública do Amazonas' }
export default function BibliotecaPage() {
  return (
    <main>
      <Nav />
      <section className="px-4 md:px-8 py-16 bg-obs-navy min-h-screen">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-obs-gold text-xs font-bold tracking-widest uppercase mb-3">Em desenvolvimento</p>
          <h1 className="font-display text-3xl font-bold text-white mb-4">Biblioteca Técnica</h1>
          <p className="text-white/60 text-sm mb-8">Legislação, relatórios, estudos e cartilhas. Disponível em breve.</p>
          <Link href="/" className="bg-obs-gold text-obs-navy font-bold px-6 py-3 text-sm">← Voltar ao início</Link>
        </div>
      </section>
      <Footer />
    </main>
  )
}
