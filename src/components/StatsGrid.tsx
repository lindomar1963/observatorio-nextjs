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
      color: '#1B4F72',
    },
    {
      value: fmt(indicadores.roubos_ano),
      label: 'Roubos registrados',
      sub: 'Acumulado no ano · AM',
      delta: `${indicadores.roubos_variacao > 0 ? '↑ +' : '↓ '}${indicadores.roubos_variacao}% vs. 2024`,
      positive: indicadores.roubos_variacao < 0,
      color: '#C9963B',
    },
    {
      value: fmt(indicadores.violencia_domestica_ano),
      label: 'Violência doméstica',
      sub: 'Ocorrências no ano · AM',
      delta: `${indicadores.violencia_domestica_variacao > 0 ? '↑ +' : '↓ '}${indicadores.violencia_domestica_variacao}% vs. ano anterior`,
      positive: indicadores.violencia_domestica_variacao < 0,
      color: '#1A6B3C',
    },
    {
      value: fmt(indicadores.municipios_com_plano),
      label: 'Municípios com plano',
      sub: 'Plano municipal de segurança',
      delta: `↑ de ${indicadores.municipios_monitorados} municípios`,
      positive: true,
      color: '#0A1628',
    },
  ]

  return (
    <section className="px-4 md:px-8 py-10 bg-white" aria-labelledby="stats-title">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-obs-gold text-xs font-bold tracking-widest uppercase mb-1">Indicadores</p>
            <h2 id="stats-title" className="font-display text-xl font-bold text-obs-navy">
              Monitoramento em tempo real
            </h2>
          </div>
          <Link href="/paineis" className="text-obs-blue text-xs font-bold hover:underline">
            Ver todos os painéis →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((s, i) => (
            <article key={i} className="border border-gray-100 p-4 relative overflow-hidden hover:border-gray-200 transition-colors"
              style={{ borderLeft: `3px solid ${s.color}` }}>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{s.label}</p>
              <p className="font-display text-2xl font-bold text-obs-navy leading-none">{s.value}</p>
              <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
              <p className={`text-xs font-bold mt-2 ${s.positive ? 'text-obs-green' : 'text-red-700'}`}>
                {s.delta}
              </p>
            </article>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-4 text-right">
          Fonte: {indicadores.fonte} · Atualização: diária às 06:00 BRT
        </p>
      </div>
    </section>
  )
}