import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ObservatorioMapa from '@/components/ObservatorioMapa'
import SinespStats from '@/components/SinespStats'
import AmbientalStats from '@/components/AmbientalStats'
import type { ObservatorioConfig } from '@/lib/observatorios'

export default function ObservatorioLayout({ config }: { config: ObservatorioConfig }) {
  return (
    <main>
      <Nav />

      <section className="bg-obs-navy px-4 md:px-8 py-16">
        <div className="max-w-5xl mx-auto">
          <p className="text-obs-gold text-xs font-bold tracking-widest uppercase mb-4">{config.tagline}</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">{config.nome}</h1>
          <p className="text-white/60 text-sm max-w-xl">{config.descricao}</p>
        </div>
      </section>

      <ObservatorioMapa config={config} />

      {config.fonte === 'sinesp' && (
        <SinespStats obs={config.slug} titulo={`${config.nome} — Manaus`} />
      )}
      {config.fonte === 'ambiental' && <AmbientalStats />}

      <section className="bg-obs-navy px-4 md:px-8 py-8 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <p className="text-white/30 text-xs">
            Os pontos no mapa representam uma distribuição ilustrativa por zona de Manaus; os
            números oficiais aparecem no painel de indicadores acima ({config.fonteLabel}).
            Cartografia base: OpenStreetMap.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  )
}
