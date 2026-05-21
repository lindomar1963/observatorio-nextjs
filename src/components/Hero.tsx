import Link from 'next/link'
import type { Indicadores } from '@/lib/types'

export default function Hero({ indicadores }: { indicadores: Indicadores }) {
  const cards = [
    { num: String(indicadores.municipios_monitorados), label: 'Municípios monitorados', sub: '100% do estado', color: '#C9963B' },
    { num: String(indicadores.municipios_com_plano > 0 ? indicadores.municipios_com_plano : 48), label: 'Relatórios publicados', sub: '+12 em 2026', color: '#1A6B3C' },
    { num: '18', label: 'Parceiros institucionais', sub: 'SSPs, UFAM, UEA, MPE', color: '#1B4F72' },
    { num: '9', label: 'Políticas públicas influenciadas', sub: 'desde a criação', color: '#8B1A1A' },
  ]

  return (
    <section
      className="px-4 md:px-8 py-12 md:py-20"
      style={{ background: 'linear-gradient(135deg, #0A1628 0%, #0F2040 55%, #0D1F3A 100%)' }}
      aria-labelledby="hero-title"
    >
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        <div>
          <div className="inline-block bg-obs-gold/20 border border-obs-gold/40 text-obs-gold text-xs font-bold tracking-widest px-3 py-1 mb-5 uppercase">
            ALEAM · Comissão de Segurança Pública
          </div>
          <h1 id="hero-title" className="font-display text-3xl md:text-4xl font-bold text-white leading-tight mb-5">
            Inteligência e <span className="text-obs-gold">dados</span> para a
            segurança pública do Amazonas
          </h1>
          <p className="text-white/60 text-sm md:text-base leading-relaxed mb-8 font-light">
            Centro de análise, monitoramento e proposição de políticas públicas
            de segurança. Informação confiável para decisões melhores em todos
            os {indicadores.municipios_monitorados} municípios do Amazonas.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/paineis" className="bg-obs-gold text-obs-navy font-bold px-6 py-3 text-sm tracking-wider hover:bg-yellow-500 transition-colors">
              Acessar Painéis
            </Link>
            <Link href="/relatorios" className="border border-white/30 text-white font-semibold px-6 py-3 text-sm tracking-wider hover:border-white/60 transition-colors">
              Últimos Relatórios
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3" aria-label="Indicadores institucionais">
          {cards.map((s, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-4 relative overflow-hidden"
              style={{ borderLeft: `3px solid ${s.color}` }}
              aria-label={`${s.num} ${s.label}`}>
              <div className="font-display text-3xl font-bold text-white leading-none">{s.num}</div>
              <div className="text-white/55 text-xs mt-1 leading-snug">{s.label}</div>
              <div className="text-xs font-semibold mt-2" style={{ color: s.color }}>↑ {s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}