import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import MapaClient from '@/components/MapaClient'
import SinespStats from '@/components/SinespStats'

export const metadata = {
  title: 'Mapa Interativo de Manaus — Observatório de Segurança Pública',
  description:
    'Mapa interativo de ocorrências por zonas de Manaus, com foco em crime organizado e tráfico de drogas.',
}

export default function MapaPage() {
  return (
    <main>
      <Nav />

      <section
        className="relative px-4 md:px-8 py-16 md:py-20 overflow-hidden"
        style={{ background: 'var(--obs-navy)' }}
        aria-labelledby="mapa-hero-title"
      >
        {/* Foto de fundo — dados e estatística */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/31738798/pexels-photo-31738798.jpeg?auto=compress&cs=tinysrgb&w=1600')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, #060A14 0%, rgba(6,10,20,0.92) 38%, rgba(6,10,20,0.55) 75%, rgba(6,10,20,0.35) 100%)',
          }}
        />
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 right-0"
          style={{ height: 3, background: 'linear-gradient(90deg, #22D3EE, transparent)' }}
        />

        <div className="relative max-w-5xl mx-auto">
          <p className="text-obs-gold text-xs font-bold tracking-widest uppercase mb-4">Geointeligência · Manaus</p>
          <h1 id="mapa-hero-title" className="font-display text-3xl md:text-4xl font-bold text-white mb-4">Mapa Interativo</h1>
          <p className="text-white/70 text-sm max-w-xl" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.6)' }}>
            Distribuição territorial de ocorrências pelas zonas de Manaus, com foco em
            crime organizado e tráfico de drogas. Use os filtros para refinar por tipo,
            zona e período.
          </p>
        </div>
      </section>

      <MapaClient />

      <SinespStats />

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
