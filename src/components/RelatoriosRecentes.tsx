import Link from 'next/link'
import type { Relatorio } from '@/lib/types'

const catColors: Record<string, { color: string; bg: string }> = {
  'Segurança Pública': { color: '#22D3EE', bg: 'rgba(34,211,238,.10)' },
  'Acesso à Justiça':  { color: '#A3E635', bg: 'rgba(163,230,53,.10)' },
  'Defesa Social':     { color: '#FBBF24', bg: 'rgba(251,191,36,.10)' },
}
const DEFAULT_CAT = { color: '#94A3B8', bg: 'rgba(148,163,184,.08)' }

export default function RelatoriosRecentes({ relatorios }: { relatorios: Relatorio[] }) {
  return (
    <section className="px-4 md:px-8 py-10 bg-obs-navy" aria-labelledby="rel-title">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-obs-gold text-xs font-bold tracking-widest uppercase mb-1">Publicações</p>
            <h2 id="rel-title" className="font-display text-xl font-bold text-white">
              Estudos e relatórios recentes
            </h2>
          </div>
          <Link href="/biblioteca" className="text-obs-cyan text-xs font-bold hover:text-obs-violet transition-colors">
            Biblioteca completa →
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {relatorios.map((r) => {
            const c = catColors[r.categoria] ?? DEFAULT_CAT
            const dataFmt = new Date(r.publicado_em + 'T12:00:00').toLocaleDateString('pt-BR')
            return (
              <article
                key={r.id}
                className="neon-card p-5 flex flex-col rounded-sm hover:border-obs-cyan/30 transition-colors"
              >
                <div className="mb-3">
                  <span className="text-xs font-bold px-2 py-1 uppercase tracking-wider rounded-sm"
                    style={{ background: c.bg, color: c.color }}>
                    {r.categoria}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-white leading-snug mb-2 flex-1">
                  {r.titulo}
                </h3>
                <p className="text-xs text-white/35 mb-4">
                  Publicado em {dataFmt} · {r.paginas} páginas
                </p>
                <div className="border-t border-obs-border pt-3 flex justify-between items-center">
                  {r.arquivo_url ? (
                    <a href={r.arquivo_url} target="_blank" rel="noopener noreferrer"
                      className="text-xs font-bold text-obs-cyan hover:text-obs-violet transition-colors"
                      aria-label={`Baixar PDF: ${r.titulo}`}>
                      ↓ Baixar PDF
                    </a>
                  ) : (
                    <Link href="/relatorios" className="text-xs font-bold text-obs-cyan hover:text-obs-violet transition-colors">
                      ↓ Ver relatório
                    </Link>
                  )}
                  <span className="text-xs text-white/30">↗ {r.acessos.toLocaleString('pt-BR')} acessos</span>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
