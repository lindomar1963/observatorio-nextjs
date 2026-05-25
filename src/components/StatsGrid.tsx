import Link from 'next/link'
import type { Indicadores } from '@/lib/types'

function fmt(n: number) {
  return n.toLocaleString('pt-BR')
}

export default function StatsGrid({ indicadores }: { indicadores: Indicadores }) {
  const stats = [
    {
      value: fmt(indicadores.cvli_12m),
      label: 'Homicídios dolosos',
      sub: 'Últimos 12 meses · AM',
      delta: `${indicadores.cvli_variacao > 0 ? '↑' : '↓'} ${indicadores.cvli_variacao > 0 ? '+' : ''}${indicadores.cvli_variacao}% vs. ano anterior`,
      positive: indicadores.cvli_variacao < 0,
      color: '#3B82F6',
    },
    {
      value: fmt(indicadores.roubos_ano),
      label: 'Roubos registrados',
      sub: 'Acumulado no ano · AM',
      delta: `${indicadores.roubos_variacao > 0 ? '↑ +' : '↓ '}${indicadores.roubos_variacao}% vs. 2024`,
      positive: indicadores.roubos_variacao < 0,
      color: '#FBBF24',
    },
    {
      value: fmt(indicadores.violencia_domestica_ano),
      label: 'Violência doméstica',
      sub: 'Ocorrências no ano · AM',
      delta: `${indicadores.violencia_domestica_variacao > 0 ? '↑ +' : '↓ '}${indicadores.violencia_domestica_variacao}% vs. ano anterior`,
      positive: indicadores.violencia_domestica_variacao < 0,
      color: '#A3E635',
    },
    {
      value: fmt(indicadores.municipios_com_plano),
      label: 'Municípios com plano',
      sub: 'Plano municipal de segurança',
      delta: `↑ de ${indicadores.municipios_monitorados} municípios`,
      positive: true,
      color: '#22D3EE',
    },
  ]

  return (
    <section className="px-4 md:px-8 py-10 bg-obs-panel" aria-labelledby="stats-title">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-obs-cyan text-xs font-bold tracking-widest uppercase mb-1">Indicadores</p>
            <h2 id="stats-title" className="font-display text-xl font-bold text-white">
              Monitoramento em tempo real
            </h2>
          </div>
          <Link href="/paineis" className="text-obs-cyan text-xs font-bold hover:text-obs-violet transition-colors">
            Ver todos os painéis →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((s, i) => (
            <article
              key={i}
              className="neon-card p-4 relative overflow-hidden rounded-sm"
              style={{ borderLeft: `3px solid ${s.color}` }}
            >
              <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">{s.label}</p>
              <p className="font-display text-2xl font-bold text-white leading-none">{s.value}</p>
              <p className="text-xs text-white/30 mt-1">{s.sub}</p>
              <p className={`text-xs font-bold mt-2`} style={{ color: s.positive ? '#A3E635' : '#EC4899' }}>
                {s.delta}
              </p>
            </article>
          ))}
        </div>
        <p className="text-white/20 text-xs mt-4 text-right">
          Fonte: {indicadores.fonte} · Atualização: diária às 06:00 BRT
        </p>
      </div>
    </section>
  )
}
