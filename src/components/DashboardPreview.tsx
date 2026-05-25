import Link from 'next/link'

export default function DashboardPreview() {
  return (
    <section className="px-4 md:px-8 py-10 bg-obs-panel" aria-labelledby="dash-title">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-obs-gold text-xs font-bold tracking-widest uppercase mb-1">Análise de Dados</p>
            <h2 id="dash-title" className="font-display text-xl font-bold text-white">
              Painéis interativos
            </h2>
          </div>
          <Link href="/paineis" className="text-obs-cyan text-xs font-bold hover:text-obs-violet transition-colors">
            Painel completo →
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              title: 'Crimes violentos letais',
              sub: 'Tendência mensal 2025 · SSP-AM',
              badge: '−5,2% no ano',
              badgeOk: true,
              color: '#22D3EE',
              desc: 'Monitoramento mensal dos homicídios dolosos com comparativo histórico e média móvel de 3 meses.',
              href: '/paineis',
            },
            {
              title: 'Mapa de calor — Municípios',
              sub: 'Incidência criminal por território',
              badge: '62 municípios',
              badgeOk: true,
              color: '#8B5CF6',
              desc: 'Visualização georreferenciada dos indicadores de segurança por município, calha e região integrada.',
              href: '/paineis',
            },
            {
              title: 'Distribuição por tipo de crime',
              sub: 'Participação % · Ano 2025',
              badge: 'Atualizado',
              badgeOk: true,
              color: '#FBBF24',
              desc: 'Análise proporcional das categorias criminais registradas no Amazonas com comparativo entre períodos.',
              href: '/paineis',
            },
          ].map((d, i) => (
            <Link
              key={i}
              href={d.href}
              className="neon-card p-5 rounded-sm hover:border-obs-cyan/30 transition-all block group"
              style={{ borderLeft: `3px solid ${d.color}` }}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-semibold text-white leading-snug pr-2">{d.title}</h3>
                <span className="text-xs font-bold px-2 py-0.5 flex-shrink-0 rounded"
                  style={{ background: `${d.color}18`, color: d.color }}>
                  {d.badge}
                </span>
              </div>
              <p className="text-xs text-white/35 mb-3">{d.sub}</p>
              <p className="text-xs text-white/45 leading-relaxed mb-4">{d.desc}</p>
              <span className="text-obs-cyan text-xs font-bold group-hover:text-obs-violet transition-colors">
                Abrir painel →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
