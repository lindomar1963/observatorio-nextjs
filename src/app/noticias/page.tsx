import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import NoticiasAoVivo from '@/components/NoticiasAoVivo'
import { getNoticias } from '@/lib/queries'
import type { Noticia } from '@/lib/types'

export const revalidate = 3600

export const metadata = {
  title: 'Notícias e Eventos — Observatório de Segurança Pública do Amazonas',
  description: 'Últimas notícias, publicações e eventos do Observatório de Segurança Pública da ALEAM.',
}

const catColor: Record<string, string> = {
  'Nota técnica': 'bg-obs-gold/20 text-obs-gold border-obs-gold/30',
  'Evento': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Publicação': 'bg-green-500/20 text-green-400 border-green-500/30',
  'Parceria': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Capacitação': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
}

const PROXIMOS_EVENTOS = [
  { titulo: '4º Seminário de Segurança Inovadora', data: '28 e 29 · Mai · 2026', local: 'Auditório Belarmino Lins — ALEAM · Manaus', destaque: true },
  { titulo: 'Seminário Regional — Calha do Médio Amazonas', data: '12 jun 2026', local: 'Itacoatiara, AM' },
  { titulo: 'Lançamento do Boletim Trimestral — 2º Tri 2026', data: '30 jun 2026', local: 'Online / ALEAM' },
  { titulo: 'Capacitação em Segurança Comunitária para Gestores Municipais', data: '14 jul 2026', local: 'Manaus, AM' },
]

export default async function NoticiasPage() {
  const noticias = await getNoticias(20)
  const destaques = noticias.filter((n: Noticia) => n.destaque)

  return (
    <main>
      <Nav />

      <section className="bg-obs-navy px-4 md:px-8 py-16">
        <div className="max-w-5xl mx-auto">
          <p className="text-obs-gold text-xs font-bold tracking-widest uppercase mb-4">Comunicação institucional</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">Notícias e Eventos</h1>
          <p className="text-white/60 text-sm max-w-xl">
            Acompanhe as publicações, eventos, parcerias e atividades técnicas do Observatório
            de Segurança Pública do Amazonas.
          </p>
        </div>
      </section>

      <NoticiasAoVivo />

      {destaques.length > 0 && (
        <section className="bg-obs-navy px-4 md:px-8 py-10">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-white/50 text-xs font-bold tracking-widest uppercase mb-6">Em destaque</h2>
            <div className="grid md:grid-cols-2 gap-5">
              {destaques.map((n: Noticia) => (
                <div key={n.id} className="border-2 border-obs-gold bg-obs-gold/5 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs font-bold px-2 py-0.5 border ${catColor[n.categoria] ?? 'bg-white/10 text-white/60 border-white/20'}`}>{n.categoria}</span>
                    <span className="text-white/45 text-xs">{new Date(n.data_publicacao).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <h3 className="text-obs-gold font-semibold text-base leading-snug mb-2">{n.titulo}</h3>
                  <p className="text-white/65 text-xs leading-relaxed">{n.resumo}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-obs-panel px-4 md:px-8 py-10 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-white/50 text-xs font-bold tracking-widest uppercase mb-6">Publicações do Observatório</h2>
          <div className="space-y-4">
            {noticias.map((n: Noticia) => (
              <div key={n.id} className="border-2 border-obs-gold/35 bg-obs-card p-5 hover:border-obs-gold transition-colors group">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-bold px-2 py-0.5 border ${catColor[n.categoria] ?? 'bg-white/10 text-white/60 border-white/20'}`}>{n.categoria}</span>
                  <span className="text-white/45 text-xs">{new Date(n.data_publicacao).toLocaleDateString('pt-BR')}</span>
                </div>
                <h3 className="text-white font-semibold text-sm leading-snug mb-2 group-hover:text-obs-gold transition-colors">{n.titulo}</h3>
                <p className="text-white/60 text-xs leading-relaxed">{n.resumo}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-obs-navy px-4 md:px-8 py-12 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-xl font-bold text-white mb-6">Próximos eventos</h2>
          <div className="space-y-3">
            {PROXIMOS_EVENTOS.map((e, i) => (
              <div
                key={i}
                className={`flex flex-col md:flex-row md:items-center gap-3 p-4 ${
                  (e as { destaque?: boolean }).destaque
                    ? 'border-2 border-obs-gold bg-obs-gold/5'
                    : 'border-2 border-obs-gold/30 hover:border-obs-gold/70 transition-colors'
                }`}
              >
                <div
                  className={`flex-shrink-0 text-xs font-bold px-3 py-2 text-center min-w-[120px] ${
                    (e as { destaque?: boolean }).destaque
                      ? 'bg-obs-gold text-obs-navy'
                      : 'bg-obs-gold/20 border border-obs-gold/30 text-obs-gold'
                  }`}
                >
                  {e.data}
                </div>
                <div className="flex-1">
                  <p className={`font-semibold text-sm ${(e as { destaque?: boolean }).destaque ? 'text-obs-gold' : 'text-white'}`}>{e.titulo}</p>
                  <p className="text-white/40 text-xs">{e.local}</p>
                </div>
                {(e as { destaque?: boolean }).destaque && (
                  <a
                    href="/seminario"
                    className="flex-shrink-0 bg-obs-gold text-obs-navy text-xs font-bold px-4 py-2 hover:bg-yellow-500 transition-colors whitespace-nowrap"
                  >
                    Ver programa →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}