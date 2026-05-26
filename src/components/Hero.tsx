import Link from 'next/link'
import type { Indicadores } from '@/lib/types'

export default function Hero({ indicadores }: { indicadores: Indicadores }) {
  const fmt = (n: number) => n.toLocaleString('pt-BR')
  const varStr = (v: number) =>
    `${v < 0 ? '↓' : '↑'} ${Math.abs(v).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}% · 12 meses`

  const cards = [
    { num: fmt(indicadores.municipios_monitorados), label: 'Municípios monitorados', sub: 'Cobertura de 100% do estado', color: '#22D3EE' },
    { num: fmt(indicadores.cvli_12m),               label: 'CVLI · últimos 12 meses', sub: varStr(indicadores.cvli_variacao), color: '#A3E635' },
    { num: fmt(indicadores.roubos_ano),             label: 'Roubos · últimos 12 meses', sub: varStr(indicadores.roubos_variacao), color: '#8B5CF6' },
    { num: fmt(indicadores.violencia_domestica_ano),label: 'Violência doméstica · 12 meses', sub: varStr(indicadores.violencia_domestica_variacao), color: '#EC4899' },
  ]

  const hexToRgb = (hex: string) => {
    const h = hex.replace('#', '')
    return `${parseInt(h.slice(0, 2), 16)},${parseInt(h.slice(2, 4), 16)},${parseInt(h.slice(4, 6), 16)}`
  }

  return (
    <section
      className="relative px-4 md:px-8 py-14 md:py-22 overflow-hidden"
      style={{ background: 'var(--obs-navy)' }}
      aria-labelledby="hero-title"
    >
      {/* Blobs de glow radial — decoração de fundo */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div style={{
          position: 'absolute', left: '-8%', top: '10%',
          width: 520, height: 520, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34,211,238,0.13) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', right: '-4%', top: '5%',
          width: 580, height: 580, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.13) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', left: '30%', bottom: '-5%',
          width: 460, height: 460, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.09) 0%, transparent 70%)',
        }} />
      </div>

      <div className="relative max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        <div>
          {/* Badge */}
          <div
            className="inline-block text-xs font-bold tracking-widest px-3 py-1 mb-5 uppercase rounded-sm"
            style={{
              background: 'rgba(34,211,238,0.12)',
              border: '1px solid rgba(34,211,238,0.35)',
              color: '#22D3EE',
            }}
          >
            ALEAM · Comissão de Segurança Pública
          </div>

          {/* Headline com gradiente ciano → violeta */}
          <h1
            id="hero-title"
            className="font-display text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-5"
          >
            <span className="grad-headline text-glow-cyan">
              Dados que protegem
            </span>
            <br />
            <span className="text-white">
              o Amazonas
            </span>
          </h1>

          <p className="text-obs-gray text-sm md:text-base leading-relaxed mb-8 font-light">
            Centro de análise, monitoramento e proposição de políticas públicas
            de segurança. Informação confiável para decisões melhores em todos
            os {indicadores.municipios_monitorados} municípios do Amazonas.
          </p>

          <div className="flex flex-wrap gap-3">
            {/* CTA primário — gradiente neon */}
            <Link
              href="/paineis"
              className="btn-grad text-obs-navy font-bold px-6 py-3 text-sm tracking-wider rounded-sm glow-cyan"
            >
              Acessar Painéis
            </Link>
            {/* CTA secundário — borda neon */}
            <Link
              href="/relatorios"
              className="font-semibold px-6 py-3 text-sm tracking-wider rounded-sm transition-all text-obs-violet border border-obs-violet/40 hover:border-obs-violet hover:glow-violet"
            >
              Últimos Relatórios
            </Link>
          </div>
        </div>

        {/* Cards de indicadores */}
        <div>
          <div className="grid grid-cols-2 gap-3" aria-label="Indicadores oficiais">
            {cards.map((s, i) => (
              <div
                key={i}
                className="neon-card p-4 relative overflow-hidden rounded-sm"
                style={{ borderLeft: `3px solid ${s.color}`, boxShadow: `0 0 14px rgba(${hexToRgb(s.color)},0.18)` }}
                aria-label={`${s.num} ${s.label}`}
              >
                <div className="font-display text-3xl font-bold text-white leading-none">{s.num}</div>
                <div className="text-white/45 text-xs mt-1 leading-snug">{s.label}</div>
                <div className="text-xs font-semibold mt-2" style={{ color: s.color }}>{s.sub}</div>
              </div>
            ))}
          </div>
          <p className="text-white/30 text-[10px] mt-3">
            Fonte: {indicadores.fonte} · atualizado em{' '}
            {new Date(indicadores.atualizado_em).toLocaleDateString('pt-BR')}
          </p>
        </div>
      </div>
    </section>
  )
}
