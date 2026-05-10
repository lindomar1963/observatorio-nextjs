import Link from 'next/link'

const relatorios = [
  { cat: 'Segurança Pública', catColor: '#1B4F72', catBg: 'rgba(27,79,114,.1)', title: 'Segurança Pública no Interior do Amazonas — 1º Trimestre 2026', data: '02/05/2026', paginas: 48, acessos: '2.341' },
  { cat: 'Acesso à Justiça', catColor: '#1A6B3C', catBg: 'rgba(26,107,60,.1)', title: 'Mapeamento do Acesso à Justiça nas Calhas dos Rios Amazônicos', data: '18/04/2026', paginas: 62, acessos: '1.887' },
  { cat: 'Defesa Social', catColor: '#C9963B', catBg: 'rgba(201,150,59,.1)', title: 'Diagnóstico da Violência Juvenil e Fatores de Risco no Amazonas', data: '05/04/2026', paginas: 55, acessos: '3.102' },
]

export default function RelatoriosRecentes() {
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
          {relatorios.map((r, i) => (
            <article
              key={i}
              className="border border-gray-100 p-5 flex flex-col hover:border-gray-200 transition-colors"
            >
              <div className="mb-3">
                <span
                  className="text-xs font-bold px-2 py-1 uppercase tracking-wider"
                  style={{ background: r.catBg, color: r.catColor }}
                >
                  {r.cat}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-obs-navy leading-snug mb-2 flex-1">
                {r.title}
              </h3>
              <p className="text-xs text-gray-400 mb-4">
                Publicado em {r.data} · {r.paginas} páginas
              </p>
              <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                <Link
                  href="/biblioteca"
                  className="text-xs font-bold text-obs-blue hover:underline"
                  aria-label={`Baixar PDF: ${r.title}`}
                >
                  ↓ Baixar PDF
                </Link>
                <span className="text-xs text-gray-400">↗ {r.acessos} acessos</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
