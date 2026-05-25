'use client'

import { useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { ZONAS, PERIODOS_DIA, type PeriodoDia, type ZonaManaus } from '@/lib/ocorrencias'
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

const TODOS_PERIODOS = PERIODOS_DIA.map((p) => p.id)

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

/** Peso combinado dos períodos selecionados (soma dos pesos individuais) */
function pesoPeriodos(selecionados: Set<PeriodoDia>): number {
  const total = PERIODOS_DIA.filter((p) => selecionados.has(p.id)).reduce((s, p) => s + p.peso, 0)
  return Math.max(total, 0.01) // nunca zero
}

export default function ObservatorioMapa({ config }: { config: ObservatorioConfig }) {
  const TODOS_TIPOS = config.tipos.map((t) => t.tipo)
  const TODAS_ZONAS = ZONAS.map((z) => z.zona)

  const [tipos, setTipos] = useState<Set<string>>(new Set(TODOS_TIPOS))
  const [zonas, setZonas] = useState<Set<ZonaManaus>>(new Set(TODAS_ZONAS))
  const [periodos, setPeriodos] = useState<Set<PeriodoDia>>(new Set(TODOS_PERIODOS))

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

  // Peso dos períodos selecionados (fator de escala)
  const fatorPeriodo = useMemo(() => pesoPeriodos(periodos), [periodos])

  const estimativaFiltrada = useMemo(
    () => estimativa.filter((c) => tipos.has(c.tipo) && zonas.has(c.zona)),
    [estimativa, tipos, zonas]
  )

  // Total com escala pelo período (para SINESP que só tem mensal)
  const totalExibido = useMemo(
    () => Math.round(estimativaFiltrada.reduce((s, c) => s + c.total, 0) * fatorPeriodo),
    [estimativaFiltrada, fatorPeriodo]
  )

  // Estimativa com escala pelo período aplicada
  const estimativaComPeriodo = useMemo(
    () => estimativaFiltrada.map((c) => ({ ...c, total: Math.round(c.total * fatorPeriodo) })),
    [estimativaFiltrada, fatorPeriodo]
  )

  const marcadoresFiltrados = useMemo(() => {
    const base = marcadores.filter((o) => tipos.has(o.tipo) && zonas.has(o.zona))
    // subsample markers proportional to period weight
    if (fatorPeriodo >= 0.99) return base
    const n = Math.round(base.length * fatorPeriodo)
    return base.slice(0, n)
  }, [marcadores, tipos, zonas, fatorPeriodo])

  const zonasConcentracao = useMemo(
    () =>
      ZONAS.map((z) => ({
        ...z,
        total: estimativaComPeriodo.filter((c) => c.zona === z.zona).reduce((s, c) => s + c.total, 0),
      })),
    [estimativaComPeriodo]
  )

  const porTipo = useMemo(
    () =>
      config.tipos.map((t) => ({
        ...t,
        total: estimativaComPeriodo.filter((c) => c.tipo === t.tipo).reduce((s, c) => s + c.total, 0),
      })),
    [config.tipos, estimativaComPeriodo]
  )

  function toggle<T>(set: Set<T>, val: T, setter: (s: Set<T>) => void) {
    const next = new Set(set)
    next.has(val) ? next.delete(val) : next.add(val)
    setter(next)
  }

  function togglePeriodo(p: PeriodoDia) {
    setPeriodos((prev) => {
      const next = new Set(prev)
      next.has(p) ? next.delete(p) : next.add(p)
      return next
    })
  }

  function limpar() {
    setTipos(new Set(TODOS_TIPOS))
    setZonas(new Set(TODAS_ZONAS))
    setPeriodos(new Set(TODOS_PERIODOS))
  }

  return (
    <section className="bg-[#0F2A45]">
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr]">
        <aside className="bg-obs-navy border-b lg:border-b-0 lg:border-r border-white/10 p-5 overflow-y-auto">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white text-sm font-bold tracking-wider uppercase">Filtros</h2>
            <button
              onClick={limpar}
              className="text-white/40 hover:text-obs-gold text-[10px] font-bold tracking-wider uppercase transition-colors"
            >
              Limpar
            </button>
          </div>

          {/* Tipo de ocorrência */}
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

          {/* Período temporal */}
          <p className="text-obs-gold text-[11px] font-bold tracking-widest uppercase mb-3">Período temporal</p>
          {modoReal && mesRef ? (
            <div className="mb-2 px-3 py-2 bg-blue-900/30 border border-blue-600/30 rounded">
              <p className="text-[10px] text-blue-300/70 font-bold tracking-wider uppercase mb-0.5">Referência</p>
              <p className="text-blue-300 text-sm font-bold">{mesRef}</p>
              <p className="text-blue-300/50 text-[9px] mt-0.5">Base SINESP/MJ · dados mensais</p>
            </div>
          ) : (
            <div className="mb-2 px-3 py-2 bg-white/5 border border-white/10 rounded">
              <p className="text-[10px] text-white/30 font-bold tracking-wider uppercase mb-0.5">Referência</p>
              <p className="text-white/50 text-sm font-bold">{carregando ? 'Carregando…' : 'Estimativa'}</p>
            </div>
          )}

          {/* Período do dia */}
          <p className="text-white/50 text-[11px] font-bold tracking-widest uppercase mb-2 mt-4">Período do dia</p>
          <div className="grid grid-cols-2 gap-1.5 mb-3">
            {PERIODOS_DIA.map((p) => {
              const ativo = periodos.has(p.id)
              return (
                <button
                  key={p.id}
                  onClick={() => togglePeriodo(p.id)}
                  className={`text-left px-2.5 py-2 border rounded text-[10px] font-bold transition-all ${
                    ativo
                      ? 'border-obs-gold bg-obs-gold/10 text-obs-gold'
                      : 'border-white/15 text-white/40 hover:border-white/30 hover:text-white/60'
                  }`}
                >
                  <div className="font-bold">{p.label}</div>
                  <div className={`text-[9px] font-normal ${ativo ? 'text-obs-gold/70' : 'text-white/30'}`}>{p.faixa}</div>
                </button>
              )
            })}
          </div>
          {config.fonte === 'sinesp' && (
            <p className="text-white/25 text-[9px] leading-relaxed mb-6">
              SINESP divulga totais mensais sem horário individual. Filtro aplica estimativa estatística proporcional.
            </p>
          )}

          {/* Zona de Manaus */}
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
          {/* Cabeçalho com referência temporal e contagem */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 bg-obs-navy border-b border-white/10">
            <div className="flex flex-wrap items-center gap-4">
              <p className="text-white text-sm">
                <span className="font-bold text-obs-gold">{carregando ? '…' : totalExibido.toLocaleString('pt-BR')}</span>
                <span className="text-white/60">
                  {' '}ocorrências
                  {periodos.size < TODOS_PERIODOS.length ? (
                    <span className="text-white/40">
                      {' '}·{' '}
                      {Array.from(periodos).map((pid) => {
                        const p = PERIODOS_DIA.find((x) => x.id === pid)
                        return p ? p.label : pid
                      }).join(' + ')}
                    </span>
                  ) : null}
                  {modoReal && mesRef ? ` — ${mesRef}` : ''}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {modoReal && mesRef && (
                <span className="text-[10px] font-bold tracking-wider uppercase bg-blue-900/40 text-blue-300 border border-blue-600/30 px-2 py-1 rounded">
                  {mesRef}
                </span>
              )}
              {modoReal && (
                <span className="text-[10px] font-bold tracking-wider uppercase bg-green-900/40 text-green-400 border border-green-600/30 px-2 py-1 rounded">
                  Base SINESP
                </span>
              )}
            </div>
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
                cada zona. O filtro por período do dia aplica distribuição estatística típica de crimes urbanos
                (SINESP não divulga horário por ocorrência).
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
