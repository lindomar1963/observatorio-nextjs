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
  const [demo, setDemo] = useState(true)
  const [carregando, setCarregando] = useState(true)

  const [tipos, setTipos] = useState<Set<TipoOcorrencia>>(new Set(TODOS_TIPOS))
  const [zonas, setZonas] = useState<Set<ZonaManaus>>(new Set(TODAS_ZONAS))
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')

  useEffect(() => {
    let ativo = true
    getOcorrencias().then((r) => {
      if (!ativo) return
      setOcorrencias(r.data)
      setDemo(r.demo)
      setCarregando(false)
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
    <section className="bg-[#0F2A45]">
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr]">
        {/* Filtros Avançados */}
        <aside className="bg-obs-navy border-b lg:border-b-0 lg:border-r border-white/10 p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white text-sm font-bold tracking-wider uppercase">Filtros Avançados</h2>
          </div>

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

          <p className="text-obs-gold text-[11px] font-bold tracking-widest uppercase mb-3">Período</p>
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
            className="w-full bg-[#0F2A45] border border-white/15 text-white/80 text-xs px-2 py-2 mb-5 rounded"
          />

          <button
            onClick={limpar}
            className="w-full border border-white/20 text-white/70 hover:text-white hover:border-white/40 text-xs font-bold tracking-wider uppercase py-2.5 transition-colors"
          >
            Limpar filtros
          </button>
        </aside>

        {/* Mapa + resumo */}
        <div className="flex flex-col">
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 bg-obs-navy border-b border-white/10">
            <p className="text-white text-sm">
              <span className="font-bold text-obs-gold">{filtradas.length}</span>
              <span className="text-white/60"> ocorrências exibidas</span>
            </p>
            {demo && !carregando && (
              <span className="text-[10px] font-bold tracking-wider uppercase bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 px-2 py-1 rounded">
                Dados de demonstração
              </span>
            )}
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
