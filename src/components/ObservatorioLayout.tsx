import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ObservatorioMapa from '@/components/ObservatorioMapa'
import AmbientalMapa from '@/components/AmbientalMapa'
import SinespStats from '@/components/SinespStats'
import AmbientalStats from '@/components/AmbientalStats'
import type { ObservatorioConfig } from '@/lib/observatorios'

export default function ObservatorioLayout({ config }: { config: ObservatorioConfig }) {
  const ehAmbiental = config.fonte === 'ambiental'

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

      {ehAmbiental ? <AmbientalMapa /> : <ObservatorioMapa config={config} />}

      {config.fonte === 'sinesp' && (
        <SinespStats obs={config.slug} titulo={`${config.nome} — Manaus`} />
      )}
      {ehAmbiental && <AmbientalStats />}

      <section className="bg-obs-navy px-4 md:px-8 py-8 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          {ehAmbiental ? (
            <p className="text-white/30 text-xs">
              Os pontos no mapa são focos de calor reais e geolocalizados detectados por satélite (INPE /
              Programa Queimadas). Dados de desmatamento (PRODES) e outras categorias serão integrados conforme
              disponibilidade das fontes oficiais. Cartografia base: OpenStreetMap.
            </p>
          ) : (
            <p className="text-white/30 text-xs">
              Os números de cada indicador são oficiais ({config.fonteLabel}, total municipal de Manaus). A
              distribuição pelas zonas no mapa é uma estimativa territorial ponderada pela população — a fonte
              oficial não divulga a localização exata de cada ocorrência. Cartografia base: OpenStreetMap.
            </p>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
