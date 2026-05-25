'use client'

import { useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import {
  TIPOS,
  ZONAS,
  PERIODOS_DIA,
  type PeriodoDia,
  getOcorrencias,
  type Ocorrencia,
  type TipoOcorrencia,
  type ZonaManaus,
} from '@/lib/ocorrencias'

const MapaLeaflet = dynamic(() => import('./MapaLeaflet'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-obs-navy text-white/40 text-xs font-mono">
      Carregando mapa…
    </div>
  ),
})

const TODOS_TIPOS = TIPOS.map((t) => t.tipo)
const TODAS_ZONAS = ZONAS.map((z) => z.zona)
const TODOS_PERIODOS = PERIODOS_DIA.map((p) => p.id)

// Período de referência estatística dos dados
const MES_REFERENCIA = 'Maio / 2026'

export default function MapaClient() {
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([])

  const [tipos, setTipos] = useState<Set<TipoOcorrencia>>(new Set(TODOS_TIPOS))
  const [zonas, setZonas] = useState<Set<ZonaManaus>>(new Set(TODAS_ZONAS))
  const [periodos, setPeriodos] = useState<Set<PeriodoDia>>(new Set(TODOS_PERIODOS))
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')

  useEffect(() => {
    let ativo = true
    getOcorrencias().then((r) => {
      if (!ativo) return
      setOcorrencias(r.data)
    })
    return () => {
      ativo = false
    }
  }, [])

  const filtradas = useMemo(() => {
    return ocorrencias.filter((o) => {
      if (!tipos.has(o.tipo)) return false
      if (!zonas.has(o.zona)) return false
      if (dataInicio && o.data < dataInicio) return false
      if (dataFim && o.data > dataFim) return false
      // filtro por período do dia
      const periodoMatch = PERIODOS_DIA.some(
        (p) => periodos.has(p.id) && o.hora >= p.horaMin && o.hora <= p.horaMax
      )
      if (!periodoMatch) return false
      return true
    })
  }, [ocorrencias, tipos, zonas, dataInicio, dataFim, periodos])

  const zonasConcentracao = useMemo(
    () =>
      ZONAS.map((z) => ({
        ...z,
        total: filtradas.filter((o) => o.zona === z.zona).length,
      })),
    [filtradas]
  )

  const porTipo = useMemo(
    () =>
      TIPOS.map((t) => ({
        ...t,
        total: filtradas.filter((o) => o.tipo === t.tipo).length,
      })),
    [filtradas]
  )

  function toggleTipo(t: TipoOcorrencia) {
    setTipos((prev) => {
      const next = new Set(prev)
      next.has(t) ? next.delete(t) : next.add(t)
      return next
    })
  }

  function toggleZona(z: ZonaManaus) {
    setZonas((prev) => {
      const next = new Set(prev)
      next.has(z) ? next.delete(z) : next.add(z)
      return next
    })
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
    setDataInicio('')
    setDataFim('')
  }

  return (
    <section className="bg-[#0F2A45]">
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr]">
        {/* Filtros Avançados */}
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
            {TIPOS.map((t) => (
              <label key={t.tipo} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={tipos.has(t.tipo)}
                  onChange={() => toggleTipo(t.tipo)}
                  className="accent-obs-gold w-4 h-4"
                />
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: t.cor }} />
                <span className="text-white/70 text-xs group-hover:text-white transition-colors">{t.tipo}</span>
              </label>
            ))}
          </div>

          {/* Período temporal */}
          <p className="text-obs-gold text-[11px] font-bold tracking-widest uppercase mb-3">Período temporal</p>
          <div className="mb-3">
            <label className="block text-white/50 text-[11px] mb-1">Data início</label>
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="w-full bg-[#0F2A45] border border-white/15 text-white/80 text-xs px-2 py-2 mb-3 rounded"
            />
            <label className="block text-white/50 text-[11px] mb-1">Data fim</label>
            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="w-full bg-[#0F2A45] border border-white/15 text-white/80 text-xs px-2 py-2 rounded"
            />
          </div>

          {/* Período do dia */}
          <p className="text-white/50 text-[11px] font-bold tracking-widest uppercase mb-2 mt-4">Período do dia</p>
          <div className="grid grid-cols-2 gap-1.5 mb-6">
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

          {/* Zona de Manaus */}
          <p className="text-obs-gold text-[11px] font-bold tracking-widest uppercase mb-3">Zona de Manaus</p>
          <div className="space-y-2 mb-6">
            {ZONAS.map((z) => (
              <label key={z.zona} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={zonas.has(z.zona)}
                  onChange={() => toggleZona(z.zona)}
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

        {/* Mapa + resumo */}
        <div className="flex flex-col">
          {/* Cabeçalho com referência temporal */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 bg-obs-navy border-b border-white/10">
            <div className="flex flex-wrap items-center gap-4">
              <p className="text-white text-sm">
                <span className="font-bold text-obs-gold">{filtradas.length}</span>
                <span className="text-white/60"> ocorrências exibidas</span>
              </p>
              {/* Período selecionado */}
              {periodos.size < TODOS_PERIODOS.length && (
                <span className="text-[10px] text-white/40">
                  {Array.from(periodos).map((pid) => {
                    const p = PERIODOS_DIA.find((x) => x.id === pid)
                    return p ? p.label : pid
                  }).join(' · ')}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-wider uppercase text-white/30">
                Referência:
              </span>
              <span className="text-[10px] font-bold tracking-wider uppercase bg-blue-900/40 text-blue-300 border border-blue-600/30 px-2 py-1 rounded">
                {MES_REFERENCIA}
              </span>
            </div>
          </div>

          <div className="h-[460px] md:h-[560px]">
            <MapaLeaflet ocorrencias={filtradas} zonas={zonasConcentracao} />
          </div>

          {/* Resumo por zona */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-white/10">
            {zonasConcentracao.map((z) => (
              <div key={z.zona} className="bg-obs-navy p-3">
                <p className="text-white/40 text-[10px] font-bold tracking-wider uppercase">Zona {z.zona}</p>
                <p className="text-white text-xl font-bold">{z.total}</p>
              </div>
            ))}
          </div>

          {/* Resumo por tipo */}
          <div className="flex flex-wrap gap-x-5 gap-y-2 px-5 py-4 bg-[#0F2A45] border-t border-white/10">
            {porTipo.map((t) => (
              <div key={t.tipo} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: t.cor }} />
                <span className="text-white/70 text-xs">
                  {t.tipo} <span className="text-white font-bold">{t.total}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
