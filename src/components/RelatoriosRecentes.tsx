import Link from 'next/link'
import type { Relatorio } from '@/lib/types'

const catColors: Record<string, { color: string; bg: string }> = {
  'Segurança Pública': { color: '#1B4F72', bg: 'rgba(27,79,114,.1)' },
  'Acesso à Justiça':  { color: '#1A6B3C', bg: 'rgba(26,107,60,.1)' },
  'Defesa Social':     { color: '#C9963B', bg: 'rgba(201,150,59,.1)' },
}
const DEFAULT_CAT = { color: '#555', bg: 'rgba(0,0,0,.05)' }

export default function RelatoriosRecentes({ relatorios }: { relatorios: Relatorio[] }) {
  return (
    <section className="px-4 md:px-8 py-10 bg-white" aria-labelledby="rel-title">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-obs-gold text-xs font-bold tracking-widest uppercase mb-1">Publicações</p>
            <h2 id="rel-title" className="font-display text-xl font-bold text-obs-navy">
              Estudos e relatórios recentes
            </h2>
          </div>
          <Link href="/biblioteca" className="text-obs-blue text-xs font-bold hover:underline">
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
                className="border border-gray-100 p-5 flex flex-col hover:border-gray-200 transition-colors"
              >
                <div className="mb-3">
                  <span className="text-xs font-bold px-2 py-1 uppercase tracking-wider"
                    style={{ background: c.bg, color: c.color }}>
                    {r.categoria}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-obs-navy leading-snug mb-2 flex-1">
                  {r.titulo}
                </h3>
                <p className="text-xs text-gray-400 mb-4">
                  Publicado em {dataFmt} · {r.paginas} páginas
                </p>
                <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                  {r.arquivo_url ? (
                    <a href={r.arquivo_url} target="_blank" rel="noopener noreferrer"
                      className="text-xs font-bold text-obs-blue hover:underline"
                      aria-label={`Baixar PDF: ${r.titulo}`}>
                      ↓ Baixar PDF
                    </a>
                  ) : (
                    <Link href="/relatorios" className="text-xs font-bold text-obs-blue hover:underline">
                      ↓ Ver relatório
                    </Link>
                  )}
                  <span className="text-xs text-gray-400">↗ {r.acessos.toLocaleString('pt-BR')} acessos</span>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}