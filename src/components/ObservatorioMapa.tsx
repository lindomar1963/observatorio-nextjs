'use client'

import { useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { ZONAS, type ZonaManaus } from '@/lib/ocorrencias'
import {
  estimarPorZona,
  amostrarMarcadores,
  type ObservatorioConfig,
  type CelulaEstimativa,
  type OcorrenciaTematica,
} from '@/lib/observatorios'
import type { SinespResponse } from '@/app/api/sinesp/route'

const MapaLeaflet = dynamic(() => import('./MapaLeaflet'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-obs-navy text-white/40 text-xs font-mono">
      Carregando mapa…
    </div>
  ),
})

/** Estimativa e marcadores a partir dos pontos de demonstração (fallback). */
function estimativaDeDemo(demo: OcorrenciaTematica[]): CelulaEstimativa[] {
  const mapa = new Map<string, number>()
  for (const o of demo) {
    const k = `${o.tipo}|${o.zona}`
    mapa.set(k, (mapa.get(k) ?? 0) + 1)
  }
  return Array.from(mapa.entries()).map(([k, total]) => {
    const [tipo, zona] = k.split('|')
    return { tipo, zona: zona as ZonaManaus, total }
  })
}

export default function ObservatorioMapa({ config }: { config: ObservatorioConfig }) {
  const TODOS_TIPOS = config.tipos.map((t) => t.tipo)
  const TODAS_ZONAS = ZONAS.map((z) => z.zona)

  const [tipos, setTipos] = useState<Set<string>>(new Set(TODOS_TIPOS))
  const [zonas, setZonas] = useState<Set<ZonaManaus>>(new Set(TODAS_ZONAS))

  const [carregando, setCarregando] = useState(config.fonte === 'sinesp')
  const [modoReal, setModoReal] = useState(false)
  const [mesRef, setMesRef] = useState('')
  const [estimativa, setEstimativa] = useState<CelulaEstimativa[]>(() =>
    estimativaDeDemo(config.demo)
  )
  const [marcadores, setMarcadores] = useState<OcorrenciaTematica[]>(config.demo)

  useEffect(() => {
    if (config.fonte !== 'sinesp') return
    let ativo = true
    fetch(`/api/sinesp?obs=${encodeURIComponent(config.slug)}`)
      .then((r) => r.json())
      .then((d: SinespResponse) => {
        if (!ativo) return
        if (d.ok && d.indicadores.length > 0) {
          const est = estimarPorZona(d.indicadores.map((i) => ({ tipo: i.tipo, total: i.total })))
          setEstimativa(est)
          setMarcadores(amostrarMarcadores(est))
          setMesRef(d.indicadores[0]?.mesRef ?? '')
          setModoReal(true)
        }
        setCarregando(false)
      })
      .catch(() => setCarregando(false))
    return () => {
      ativo = false
    }
  }, [config.fonte, config.slug])

  const corResolver = useMemo(() => {
    const mapa = new Map(config.tipos.map((t) => [t.tipo, t.cor]))
    return (t: string) => mapa.get(t) ?? '#64748B'
  }, [config])

  const estimativaFiltrada = useMemo(
    () => estimativa.filter((c) => tipos.has(c.tipo) && zonas.has(c.zona)),
    [estimativa, tipos, zonas]
  )

  const totalExibido = useMemo(
    () => estimativaFiltrada.reduce((s, c) => s + c.total, 0),
    [estimativaFiltrada]
  )

  const marcadoresFiltrados = useMemo(
    () => marcadores.filter((o) => tipos.has(o.tipo) && zonas.has(o.zona)),
    [marcadores, tipos, zonas]
  )

  const zonasConcentracao = useMemo(
    () =>
      ZONAS.map((z) => ({
        ...z,
        total: estimativaFiltrada.filter((c) => c.zona === z.zona).reduce((s, c) => s + c.total, 0),
      })),
    [estimativaFiltrada]
  )

  const porTipo = useMemo(
    () =>
      config.tipos.map((t) => ({
        ...t,
        total: estimativaFiltrada.filter((c) => c.tipo === t.tipo).reduce((s, c) => s + c.total, 0),
      })),
    [config.tipos, estimativaFiltrada]
  )

  function toggle<T>(set: Set<T>, val: T, setter: (s: Set<T>) => void) {
    const next = new Set(set)
    next.has(val) ? next.delete(val) : next.add(val)
    setter(next)
  }

  function limpar() {
    setTipos(new Set(TODOS_TIPOS))
    setZonas(new Set(TODAS_ZONAS))
  }

  return (
    <section className="bg-[#0F2A45]">
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr]">
        <aside className="bg-obs-navy border-b lg:border-b-0 lg:border-r border-white/10 p-5">
          <h2 className="text-white text-sm font-bold tracking-wider uppercase mb-5">Filtros</h2>

          <p className="text-obs-gold text-[11px] font-bold tracking-widest uppercase mb-3">Tipo de ocorrência</p>
          <div className="space-y-2 mb-6">
            {config.tipos.map((t) => (
              <label key={t.tipo} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={tipos.has(t.tipo)}
                  onChange={() => toggle(tipos, t.tipo, setTipos)}
                  className="accent-obs-gold w-4 h-4"
                />
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: t.cor }} />
                <span className="text-white/70 text-xs group-hover:text-white transition-colors">{t.tipo}</span>
              </label>
            ))}
          </div>

          <p className="text-obs-gold text-[11px] font-bold tracking-widest uppercase mb-3">Zona de Manaus</p>
          <div className="space-y-2 mb-6">
            {ZONAS.map((z) => (
              <label key={z.zona} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={zonas.has(z.zona)}
                  onChange={() => toggle(zonas, z.zona, setZonas)}
                  className="accent-obs-gold w-4 h-4"
                />
                <span className="text-white/70 text-xs group-hover:text-white transition-colors">Zona {z.zona}</span>
              </label>
            ))}
          </div>

          <button
            onClick={limpar}
            className="w-full border border-white/20 text-white/70 hover:text-white hover:border-white/40 text-xs font-bold tracking-wider uppercase py-2.5 transition-colors"
          >
            Limpar filtros
          </button>
        </aside>

        <div className="flex flex-col">
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 bg-obs-navy border-b border-white/10">
            <p className="text-white text-sm">
              <span className="font-bold text-obs-gold">{carregando ? '…' : totalExibido.toLocaleString('pt-BR')}</span>
              <span className="text-white/60"> ocorrências{modoReal && mesRef ? ` em ${mesRef}` : ''}</span>
            </p>
            {modoReal ? (
              <span className="text-[10px] font-bold tracking-wider uppercase bg-green-900/40 text-green-400 border border-green-600/30 px-2 py-1 rounded">
                Estimativa territorial · base SINESP
              </span>
            ) : (
              <span className="text-[10px] font-bold tracking-wider uppercase bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 px-2 py-1 rounded">
                Distribuição ilustrativa
              </span>
            )}
          </div>

          <div className="h-[460px] md:h-[560px]">
            <MapaLeaflet ocorrencias={marcadoresFiltrados} zonas={zonasConcentracao} corResolver={corResolver} />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-white/10">
            {zonasConcentracao.map((z) => (
              <div key={z.zona} className="bg-obs-navy p-3">
                <p className="text-white/40 text-[10px] font-bold tracking-wider uppercase">Zona {z.zona}</p>
                <p className="text-white text-xl font-bold">{z.total.toLocaleString('pt-BR')}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2 px-5 py-4 bg-[#0F2A45] border-t border-white/10">
            {porTipo.map((t) => (
              <div key={t.tipo} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: t.cor }} />
                <span className="text-white/70 text-xs">
                  {t.tipo} <span className="text-white font-bold">{t.total.toLocaleString('pt-BR')}</span>
                </span>
              </div>
            ))}
          </div>

          {modoReal && (
            <div className="px-5 py-3 bg-obs-navy border-t border-white/10">
              <p className="text-white/35 text-[11px] leading-relaxed">
                Os <strong className="text-white/55">números são oficiais</strong> (SINESP/MJ, total
                municipal de {mesRef}). A distribuição pelas zonas é uma{' '}
                <strong className="text-white/55">estimativa territorial ponderada pela população</strong> de
                cada zona — o SINESP não divulga a localização exata de cada ocorrência.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
