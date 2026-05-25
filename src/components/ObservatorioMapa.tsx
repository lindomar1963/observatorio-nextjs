'use client'

import { useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import {
  ZONAS,
  PERIODOS_DIA,
  STATUS_INVESTIGACAO,
  LIMITES_RESULTADO,
  type PeriodoDia,
  type StatusInvestigacao,
  type ZonaManaus,
} from '@/lib/ocorrencias'
import {
  estimarPorZona,
  amostrarMarcadores,
  STATUS_PESO,
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
const TODOS_STATUS = STATUS_INVESTIGACAO.map((s) => s.status)

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
  return Math.max(total, 0.01)
}

/** Peso de uma faixa horária personalizada, distribuindo o peso de cada período por hora */
function pesoFaixaHoras(ini: number, fim: number): number {
  const cobre = (h: number) => (ini <= fim ? h >= ini && h <= fim : h >= ini || h <= fim)
  let total = 0
  for (const p of PERIODOS_DIA) {
    const pesoHora = p.peso / (p.horaMax - p.horaMin + 1)
    for (let h = p.horaMin; h <= p.horaMax; h++) if (cobre(h)) total += pesoHora
  }
  return Math.max(total, 0.01)
}

/** Peso combinado dos status selecionados */
function pesoStatus(selecionados: Set<StatusInvestigacao>): number {
  const total = STATUS_INVESTIGACAO.filter((s) => selecionados.has(s.status)).reduce(
    (acc, s) => acc + (STATUS_PESO[s.status] ?? 0),
    0
  )
  return Math.max(total, 0.01)
}

export default function ObservatorioMapa({ config }: { config: ObservatorioConfig }) {
  const TODOS_TIPOS = config.tipos.map((t) => t.tipo)
  const TODAS_ZONAS = ZONAS.map((z) => z.zona)

  const [tipos, setTipos] = useState<Set<string>>(new Set(TODOS_TIPOS))
  const [zonas, setZonas] = useState<Set<ZonaManaus>>(new Set(TODAS_ZONAS))
  const [periodos, setPeriodos] = useState<Set<PeriodoDia>>(new Set(TODOS_PERIODOS))
  const [statusSel, setStatusSel] = useState<Set<StatusInvestigacao>>(new Set(TODOS_STATUS))

  const [horaPersonalizada, setHoraPersonalizada] = useState(false)
  const [horaIni, setHoraIni] = useState(0)
  const [horaFim, setHoraFim] = useState(23)
  const [busca, setBusca] = useState('')
  const [heatmap, setHeatmap] = useState(false)
  const [limite, setLimite] = useState<number>(500)

  const [carregando, setCarregando] = useState(config.fonte === 'sinesp')
  const [modoReal, setModoReal] = useState(false)
  const [mesRef, setMesRef] = useState('')
  const [estimativa, setEstimativa] = useState<CelulaEstimativa[]>(() => estimativaDeDemo(config.demo))
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

  // Fator de escala combinado (período do dia × status de investigação)
  const fatorPeriodo = useMemo(
    () => (horaPersonalizada ? pesoFaixaHoras(horaIni, horaFim) : pesoPeriodos(periodos)),
    [horaPersonalizada, horaIni, horaFim, periodos]
  )
  const fatorStatus = useMemo(() => pesoStatus(statusSel), [statusSel])
  const fator = fatorPeriodo * fatorStatus

  const tiposVisiveis = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    return config.tipos.filter((t) => tipos.has(t.tipo) && (!termo || t.tipo.toLowerCase().includes(termo)))
  }, [config.tipos, tipos, busca])

  const tiposVisiveisSet = useMemo(() => new Set(tiposVisiveis.map((t) => t.tipo)), [tiposVisiveis])

  const estimativaFiltrada = useMemo(
    () => estimativa.filter((c) => tiposVisiveisSet.has(c.tipo) && zonas.has(c.zona)),
    [estimativa, tiposVisiveisSet, zonas]
  )

  const estimativaComFator = useMemo(
    () => estimativaFiltrada.map((c) => ({ ...c, total: Math.round(c.total * fator) })),
    [estimativaFiltrada, fator]
  )

  const totalExibido = useMemo(
    () => estimativaComFator.reduce((s, c) => s + c.total, 0),
    [estimativaComFator]
  )

  function horaNoFiltro(h: number | undefined): boolean {
    if (typeof h !== 'number') return true
    if (horaPersonalizada) {
      return horaIni <= horaFim ? h >= horaIni && h <= horaFim : h >= horaIni || h <= horaFim
    }
    return PERIODOS_DIA.some((p) => periodos.has(p.id) && h >= p.horaMin && h <= p.horaMax)
  }

  const marcadoresFiltrados = useMemo(() => {
    const base = marcadores.filter(
      (o) =>
        tiposVisiveisSet.has(o.tipo) &&
        zonas.has(o.zona) &&
        (o.status ? statusSel.has(o.status as StatusInvestigacao) : true) &&
        horaNoFiltro(o.hora)
    )
    return base.slice(0, limite)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marcadores, tiposVisiveisSet, zonas, statusSel, periodos, horaPersonalizada, horaIni, horaFim, limite])

  const zonasConcentracao = useMemo(
    () =>
      ZONAS.map((z) => ({
        ...z,
        total: estimativaComFator.filter((c) => c.zona === z.zona).reduce((s, c) => s + c.total, 0),
      })),
    [estimativaComFator]
  )

  const porTipo = useMemo(
    () =>
      config.tipos
        .filter((t) => tiposVisiveisSet.has(t.tipo))
        .map((t) => ({
          ...t,
          total: estimativaComFator.filter((c) => c.tipo === t.tipo).reduce((s, c) => s + c.total, 0),
        })),
    [config.tipos, tiposVisiveisSet, estimativaComFator]
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

  function toggleStatus(s: StatusInvestigacao) {
    setStatusSel((prev) => {
      const next = new Set(prev)
      next.has(s) ? next.delete(s) : next.add(s)
      return next
    })
  }

  function limpar() {
    setTipos(new Set(TODOS_TIPOS))
    setZonas(new Set(TODAS_ZONAS))
    setPeriodos(new Set(TODOS_PERIODOS))
    setStatusSel(new Set(TODOS_STATUS))
    setHoraPersonalizada(false)
    setHoraIni(0)
    setHoraFim(23)
    setBusca('')
    setHeatmap(false)
  }

  return (
    <section className="bg-[#0F2A45]">
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr]">
        <aside className="bg-obs-navy border-b lg:border-b-0 lg:border-r border-white/10 p-5 lg:max-h-[760px] lg:overflow-y-auto">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white text-sm font-bold tracking-wider uppercase">Filtros Avançados</h2>
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

          {/* Período temporal — referência */}
          <p className="text-obs-gold text-[11px] font-bold tracking-widest uppercase mb-3">Período temporal</p>
          {modoReal && mesRef ? (
            <div className="mb-4 px-3 py-2 bg-blue-900/30 border border-blue-600/30 rounded">
              <p className="text-[10px] text-blue-300/70 font-bold tracking-wider uppercase mb-0.5">Referência</p>
              <p className="text-blue-300 text-sm font-bold">{mesRef}</p>
              <p className="text-blue-300/50 text-[9px] mt-0.5">Base SINESP/MJ · dados mensais</p>
            </div>
          ) : (
            <div className="mb-4 px-3 py-2 bg-white/5 border border-white/10 rounded">
              <p className="text-[10px] text-white/30 font-bold tracking-wider uppercase mb-0.5">Referência</p>
              <p className="text-white/50 text-sm font-bold">{carregando ? 'Carregando…' : 'Estimativa'}</p>
            </div>
          )}

          {/* Período do dia */}
          <p className="text-white/50 text-[11px] font-bold tracking-widest uppercase mb-2">Período do dia</p>
          <div className="grid grid-cols-2 gap-1.5 mb-3">
            {PERIODOS_DIA.map((p) => {
              const ativo = !horaPersonalizada && periodos.has(p.id)
              return (
                <button
                  key={p.id}
                  disabled={horaPersonalizada}
                  onClick={() => togglePeriodo(p.id)}
                  className={`text-left px-2.5 py-2 border rounded text-[10px] font-bold transition-all ${
                    horaPersonalizada
                      ? 'border-white/10 text-white/20 cursor-not-allowed'
                      : ativo
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

          {/* Faixa horária personalizada */}
          <label className="flex items-center gap-2.5 cursor-pointer group mb-2">
            <input
              type="checkbox"
              checked={horaPersonalizada}
              onChange={(e) => setHoraPersonalizada(e.target.checked)}
              className="accent-obs-gold w-4 h-4"
            />
            <span className="text-white/70 text-xs group-hover:text-white transition-colors">Faixa horária personalizada</span>
          </label>
          {horaPersonalizada && (
            <div className="flex items-center gap-2 mb-4 pl-1">
              <select
                value={horaIni}
                onChange={(e) => setHoraIni(Number(e.target.value))}
                className="flex-1 bg-[#0F2A45] border border-white/15 text-white/80 text-xs px-2 py-2 rounded"
              >
                {Array.from({ length: 24 }, (_, h) => (
                  <option key={h} value={h}>{String(h).padStart(2, '0')}h</option>
                ))}
              </select>
              <span className="text-white/40 text-xs">até</span>
              <select
                value={horaFim}
                onChange={(e) => setHoraFim(Number(e.target.value))}
                className="flex-1 bg-[#0F2A45] border border-white/15 text-white/80 text-xs px-2 py-2 rounded"
              >
                {Array.from({ length: 24 }, (_, h) => (
                  <option key={h} value={h}>{String(h).padStart(2, '0')}h</option>
                ))}
              </select>
            </div>
          )}
          {config.fonte === 'sinesp' && (
            <p className="text-white/25 text-[9px] leading-relaxed mb-6">
              SINESP divulga totais mensais sem horário individual. Filtro aplica estimativa estatística proporcional.
            </p>
          )}
          {config.fonte !== 'sinesp' && <div className="mb-6" />}

          {/* Status de investigação */}
          <p className="text-obs-gold text-[11px] font-bold tracking-widest uppercase mb-3">Status de investigação</p>
          <div className="space-y-2 mb-6">
            {STATUS_INVESTIGACAO.map((s) => (
              <label key={s.status} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={statusSel.has(s.status)}
                  onChange={() => toggleStatus(s.status)}
                  className="accent-obs-gold w-4 h-4"
                />
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.cor }} />
                <span className="text-white/70 text-xs group-hover:text-white transition-colors">{s.status}</span>
              </label>
            ))}
          </div>

          {/* Geográfico (SINESP municipal · Manaus) */}
          <p className="text-obs-gold text-[11px] font-bold tracking-widest uppercase mb-3">Geográfico</p>
          <label className="block text-white/50 text-[11px] mb-1">Município</label>
          <select
            disabled
            value="Manaus"
            className="w-full bg-[#0F2A45]/60 border border-white/10 text-white/50 text-xs px-2 py-2 mb-4 rounded cursor-not-allowed"
          >
            <option value="Manaus">Manaus (base SINESP municipal)</option>
          </select>

          {/* Zona de Manaus */}
          <p className="text-white/50 text-[11px] font-bold tracking-widest uppercase mb-2">Zona de Manaus</p>
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

          {/* Busca textual */}
          <p className="text-obs-gold text-[11px] font-bold tracking-widest uppercase mb-3">Busca textual</p>
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar tipo de ocorrência…"
            className="w-full bg-[#0F2A45] border border-white/15 text-white/80 text-xs px-3 py-2 mb-6 rounded placeholder:text-white/25"
          />

          {/* Visualização */}
          <p className="text-obs-gold text-[11px] font-bold tracking-widest uppercase mb-3">Visualização</p>
          <label className="flex items-center gap-2.5 cursor-pointer group mb-3">
            <input
              type="checkbox"
              checked={heatmap}
              onChange={(e) => setHeatmap(e.target.checked)}
              className="accent-obs-gold w-4 h-4"
            />
            <span className="text-white/70 text-xs group-hover:text-white transition-colors">Visualizar como mapa de calor</span>
          </label>
          <label className="block text-white/50 text-[11px] mb-1">Limite de resultados</label>
          <select
            value={limite}
            onChange={(e) => setLimite(Number(e.target.value))}
            className="w-full bg-[#0F2A45] border border-white/15 text-white/80 text-xs px-2 py-2 mb-6 rounded"
          >
            {LIMITES_RESULTADO.map((n) => (
              <option key={n} value={n}>{n} pontos</option>
            ))}
          </select>

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
                  {(horaPersonalizada || periodos.size < TODOS_PERIODOS.length) && (
                    <span className="text-white/40">
                      {' '}·{' '}
                      {horaPersonalizada
                        ? `${String(horaIni).padStart(2, '0')}h–${String(horaFim).padStart(2, '0')}h`
                        : Array.from(periodos).map((pid) => PERIODOS_DIA.find((x) => x.id === pid)?.label ?? pid).join(' + ')}
                    </span>
                  )}
                  {modoReal && mesRef ? ` — ${mesRef}` : ''}
                </span>
              </p>
              {heatmap && (
                <span className="text-[10px] font-bold tracking-wider uppercase bg-orange-900/40 text-orange-300 border border-orange-600/30 px-2 py-1 rounded">
                  Mapa de calor
                </span>
              )}
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
            <MapaLeaflet ocorrencias={marcadoresFiltrados} zonas={zonasConcentracao} corResolver={corResolver} heatmap={heatmap} />
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
                cada zona. Os filtros de período do dia e status de investigação aplicam distribuição
                estatística típica (o SINESP não divulga horário nem andamento por ocorrência).
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
