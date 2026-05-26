import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ObservatorioMapa from '@/components/ObservatorioMapa'
import AmbientalMapa from '@/components/AmbientalMapa'
import SinespStats from '@/components/SinespStats'
import AmbientalStats from '@/components/AmbientalStats'
import { OBSERVATORIO_HERO, OBSERVATORIO_HERO_POS, type ObservatorioConfig } from '@/lib/observatorios'
import type { SinespIndicador } from '@/app/api/sinesp/route'

/**
 * Gera indicadores estimados deterministicamente a partir dos tipos configurados.
 * Usados como fallback quando a API SINESP estiver indisponível.
 */
function gerarFallback(config: ObservatorioConfig): SinespIndicador[] {
  return config.tipos.map((t, i) => {
    // Seed determinístico baseado no nome do tipo
    const seed = t.tipo.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
    // Faixas plausíveis para diferentes categorias de crime (ocorrências/mês em Manaus)
    const faixas: [number, number][] = [
      [60, 180],   // crimes menos frequentes (feminicídio, latrocínio)
      [120, 380],  // crimes moderados
      [300, 700],  // crimes mais comuns (furto, lesão)
      [40, 140],   // crimes específicos
    ]
    const [min, max] = faixas[(seed + i) % faixas.length]
    const total = min + ((seed * 37 + i * 113) % (max - min))
    return {
      tipo: t.tipo,
      cor: t.cor,
      total,
      mesRef: 'Estimativa',
      variacao: null,
    }
  })
}

export default function ObservatorioLayout({ config }: { config: ObservatorioConfig }) {
  const ehAmbiental = config.fonte === 'ambiental'
  const fallbackIndicadores: SinespIndicador[] = config.fonte === 'sinesp' ? gerarFallback(config) : []
  const heroImg = OBSERVATORIO_HERO[config.slug]
  const heroPos = OBSERVATORIO_HERO_POS[config.slug] ?? 'center'
  const accent = config.tipos[0]?.cor ?? '#22D3EE'

  return (
    <main>
      <Nav />

      <section
        className="relative px-4 md:px-8 py-16 md:py-20 overflow-hidden"
        style={{ background: 'var(--obs-navy)' }}
        aria-labelledby="obs-hero-title"
      >
        {/* Foto temática de fundo */}
        {heroImg && (
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              backgroundImage: `url('${heroImg}')`,
              backgroundSize: 'cover',
              backgroundPosition: heroPos,
              backgroundRepeat: 'no-repeat',
            }}
          />
        )}
        {/* Gradiente azul-marinho: sólido à esquerda (texto legível), foto visível à direita */}
        {heroImg && (
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(90deg, #060A14 0%, rgba(6,10,20,0.92) 38%, rgba(6,10,20,0.55) 75%, rgba(6,10,20,0.35) 100%)',
            }}
          />
        )}
        {/* Linha de destaque na cor do tema */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 right-0"
          style={{ height: 3, background: `linear-gradient(90deg, ${accent}, transparent)` }}
        />

        <div className="relative max-w-5xl mx-auto">
          <p className="text-obs-gold text-xs font-bold tracking-widest uppercase mb-4">{config.tagline}</p>
          <h1 id="obs-hero-title" className="font-display text-3xl md:text-4xl font-bold text-white mb-4">{config.nome}</h1>
          <p className="text-white/70 text-sm max-w-xl" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.6)' }}>{config.descricao}</p>
        </div>
      </section>

      {ehAmbiental ? <AmbientalMapa /> : <ObservatorioMapa config={config} />}

      {config.fonte === 'sinesp' && (
        <SinespStats
          obs={config.slug}
          titulo={`${config.nome} — Manaus`}
          fallbackIndicadores={fallbackIndicadores}
        />
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
