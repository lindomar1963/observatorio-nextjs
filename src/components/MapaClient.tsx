'use client'

import { useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import {
  TIPOS,
  ZONAS,
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

export default function MapaClient() {
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([])

  const [tipos, setTipos] = useState<Set<TipoOcorrencia>>(new Set(TODOS_TIPOS))
  const [zonas, setZonas] = useState<Set<ZonaManaus>>(new Set(TODAS_ZONAS))
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
      return true
    })
  }, [ocorrencias, tipos, zonas, dataInicio, dataFim])

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

  function limpar() {
    setTipos(new Set(TODOS_TIPOS))
    setZonas(new Set(TODAS_ZONAS))
    setDataInicio('')
    setDataFim('')
  }

  return (
    <section className="bg-obs-navy">
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr]">
        {/* Filtros Avançados */}
        <aside className="bg-obs-panel border-b lg:border-b-0 lg:border-r border-obs-border p-5 overflow-y-auto max-h-[800px]">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white text-sm font-bold tracking-wider uppercase">Filtros Avançados</h2>
          </div>

          <p className="text-obs-cyan text-[11px] font-bold tracking-widest uppercase mb-3">Tipo de ocorrência</p>
          <div className="space-y-2 mb-6">
            {TIPOS.map((t) => (
              <label key={t.tipo} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={tipos.has(t.tipo)}
                  onChange={() => toggleTipo(t.tipo)}
                  className="accent-obs-cyan w-4 h-4"
                />
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: t.cor }} />
                <span className="text-white/60 text-xs group-hover:text-white transition-colors">{t.tipo}</span>
              </label>
            ))}
          </div>

          <p className="text-obs-cyan text-[11px] font-bold tracking-widest uppercase mb-3">Zona de Manaus</p>
          <div className="space-y-2 mb-6">
            {ZONAS.map((z) => (
              <label key={z.zona} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={zonas.has(z.zona)}
                  onChange={() => toggleZona(z.zona)}
                  className="accent-obs-cyan w-4 h-4"
                />
                <span className="text-white/60 text-xs group-hover:text-white transition-colors">Zona {z.zona}</span>
              </label>
            ))}
          </div>

          <p className="text-obs-cyan text-[11px] font-bold tracking-widest uppercase mb-3">Período</p>
          <label className="block text-white/40 text-[11px] mb-1">Data início</label>
          <input
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            className="w-full bg-obs-card border border-obs-border text-white/80 text-xs px-2 py-2 mb-3 rounded"
          />
          <label className="block text-white/40 text-[11px] mb-1">Data fim</label>
          <input
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            className="w-full bg-obs-card border border-obs-border text-white/80 text-xs px-2 py-2 mb-5 rounded"
          />

          <button
            onClick={limpar}
            className="w-full border border-obs-cyan/30 text-obs-cyan/70 hover:text-obs-cyan hover:border-obs-cyan/60 text-xs font-bold tracking-wider uppercase py-2.5 rounded transition-colors"
          >
            Limpar filtros
          </button>
        </aside>

        {/* Mapa + resumo */}
        <div className="flex flex-col">
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 bg-obs-panel border-b border-obs-border">
            <p className="text-white text-sm">
              <span className="font-bold text-obs-cyan">{filtradas.length}</span>
              <span className="text-white/50"> ocorrências exibidas</span>
            </p>
          </div>

          <div className="h-[460px] md:h-[560px]">
            <MapaLeaflet ocorrencias={filtradas} zonas={zonasConcentracao} />
          </div>

          {/* Resumo por zona */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-obs-border">
            {zonasConcentracao.map((z) => (
              <div key={z.zona} className="bg-obs-panel p-3">
                <p className="text-obs-gray text-[10px] font-bold tracking-wider uppercase">Zona {z.zona}</p>
                <p className="text-obs-cyan text-xl font-bold">{z.total}</p>
              </div>
            ))}
          </div>

          {/* Resumo por tipo */}
          <div className="flex flex-wrap gap-x-5 gap-y-2 px-5 py-4 bg-obs-card border-t border-obs-border">
            {porTipo.map((t) => (
              <div key={t.tipo} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: t.cor }} />
                <span className="text-white/50 text-xs">
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
