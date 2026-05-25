import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import MapaClient from '@/components/MapaClient'

export const metadata = {
  title: 'Mapa Interativo de Manaus — Observatório de Segurança Pública',
  description:
    'Mapa interativo de ocorrências por zonas de Manaus, com foco em crime organizado e tráfico de drogas.',
}

export default function MapaPage() {
  return (
    <main>
      <Nav />

      <section className="bg-obs-navy px-4 md:px-8 py-16">
        <div className="max-w-5xl mx-auto">
          <p className="text-obs-gold text-xs font-bold tracking-widest uppercase mb-4">Geointeligência · Manaus</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">Mapa Interativo</h1>
          <p className="text-white/60 text-sm max-w-xl">
            Distribuição territorial de ocorrências pelas zonas de Manaus, com foco em
            crime organizado e tráfico de drogas. Use os filtros para refinar por tipo,
            zona e período.
          </p>
        </div>
      </section>

      <MapaClient />

      <section className="bg-obs-navy px-4 md:px-8 py-8 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <p className="text-white/30 text-xs">
            Os pontos representam ocorrências registradas; os círculos dourados indicam a
            concentração relativa por zona. Cartografia base: OpenStreetMap.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  )
}
