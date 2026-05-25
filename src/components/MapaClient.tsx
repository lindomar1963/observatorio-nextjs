'use client'

import { useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import {
  TIPOS,
  ZONAS,
  PERIODOS_DIA,
  STATUS_INVESTIGACAO,
  LIMITES_RESULTADO,
  MUNICIPIOS_AM,
  type PeriodoDia,
  type StatusInvestigacao,
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
const TODOS_STATUS = STATUS_INVESTIGACAO.map((s) => s.status)

// Período de referência estatística dos dados
const MES_REFERENCIA = 'Maio / 2026'

export default function MapaClient() {
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([])

  const [tipos, setTipos] = useState<Set<TipoOcorrencia>>(new Set(TODOS_TIPOS))
  const [zonas, setZonas] = useState<Set<ZonaManaus>>(new Set(TODAS_ZONAS))
  const [periodos, setPeriodos] = useState<Set<PeriodoDia>>(new Set(TODOS_PERIODOS))
  const [statusSel, setStatusSel] = useState<Set<StatusInvestigacao>>(new Set(TODOS_STATUS))
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')

  // Faixa horária personalizada
  const [horaPersonalizada, setHoraPersonalizada] = useState(false)
  const [horaIni, setHoraIni] = useState(0)
  const [horaFim, setHoraFim] = useState(23)

  // Busca textual
  const [busca, setBusca] = useState('')

  // Geográfico
  const [municipio, setMunicipio] = useState('Todos')

  // Visualização
  const [heatmap, setHeatmap] = useState(false)
  const [limite, setLimite] = useState<number>(500)

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
    const termo = busca.trim().toLowerCase()
    const lista = ocorrencias.filter((o) => {
      if (!tipos.has(o.tipo)) return false
      if (!zonas.has(o.zona)) return false
      if (!statusSel.has(o.status)) return false
      if (municipio !== 'Todos' && o.municipio !== municipio) return false
      if (dataInicio && o.data < dataInicio) return false
      if (dataFim && o.data > dataFim) return false

      // Período: faixa personalizada tem prioridade sobre os botões
      if (horaPersonalizada) {
        if (horaIni <= horaFim) {
          if (o.hora < horaIni || o.hora > horaFim) return false
        } else {
          // faixa que cruza a meia-noite (ex: 20h–02h)
          if (o.hora < horaIni && o.hora > horaFim) return false
        }
      } else {
        const periodoMatch = PERIODOS_DIA.some(
          (p) => periodos.has(p.id) && o.hora >= p.horaMin && o.hora <= p.horaMax
        )
        if (!periodoMatch) return false
      }

      if (termo) {
        const alvo = `${o.descricao} ${o.bairro} ${o.tipo} ${o.municipio}`.toLowerCase()
        if (!alvo.includes(termo)) return false
      }
      return true
    })
    return lista.slice(0, limite)
  }, [
    ocorrencias, tipos, zonas, statusSel, municipio, dataInicio, dataFim,
    horaPersonalizada, horaIni, horaFim, periodos, busca, limite,
  ])

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
    setDataInicio('')
    setDataFim('')
    setHoraPersonalizada(false)
    setHoraIni(0)
    setHoraFim(23)
    setBusca('')
    setMunicipio('Todos')
  }

  return (
    <section className="bg-obs-navy">
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr]">
        {/* Filtros Avançados */}
        <aside className="bg-obs-panel border-b lg:border-b-0 lg:border-r border-obs-border p-5 overflow-y-auto max-h-[800px]">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white text-sm font-bold tracking-wider uppercase">Filtros Avançados</h2>
            <button
              onClick={limpar}
              className="text-white/40 hover:text-obs-cyan text-[10px] font-bold tracking-wider uppercase transition-colors"
            >
              Limpar
            </button>
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

          {/* Visualização */}
          <p className="text-obs-cyan text-[11px] font-bold tracking-widest uppercase mb-3">Visualização</p>
          <label className="flex items-center gap-2.5 cursor-pointer group mb-3">
            <input
              type="checkbox"
              checked={heatmap}
              onChange={(e) => setHeatmap(e.target.checked)}
              className="accent-obs-cyan w-4 h-4"
            />
            <span className="text-white/70 text-xs group-hover:text-white transition-colors">Visualizar como mapa de calor</span>
          </label>
          <label className="block text-white/50 text-[11px] mb-1">Limite de resultados</label>
          <select
            value={limite}
            onChange={(e) => setLimite(Number(e.target.value))}
            className="w-full bg-obs-card border border-obs-border text-white/80 text-xs px-2 py-2 mb-6 rounded"
          >
            {LIMITES_RESULTADO.map((n) => (
              <option key={n} value={n}>{n} ocorrências</option>
            ))}
          </select>

          {/* Legenda */}
          <p className="text-obs-cyan text-[11px] font-bold tracking-widest uppercase mb-3">Legenda</p>
          <div className="grid grid-cols-2 gap-1.5 mb-6">
            {TIPOS.map((t) => (
              <div key={t.tipo} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: t.cor }} />
                <span className="text-white/50 text-[10px]">{t.tipo}</span>
              </div>
            ))}
          </div>

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
            <MapaLeaflet ocorrencias={filtradas} zonas={zonasConcentracao} heatmap={heatmap} />
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
