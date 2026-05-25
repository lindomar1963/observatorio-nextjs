'use client'

import { useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import type { AmbientalResponse } from '@/app/api/ambiental/route'

const MapaLeaflet = dynamic(() => import('./MapaLeaflet'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-obs-navy text-white/40 text-xs font-mono">
      Carregando mapa…
    </div>
  ),
})

// Centro aproximado do estado do Amazonas
const AM_CENTRO: [number, number] = [-4.5, -64.0]
const AM_ZOOM = 5

export default function AmbientalMapa() {
  const [dados, setDados] = useState<AmbientalResponse | null>(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    let ativo = true
    fetch('/api/ambiental')
      .then((r) => r.json())
      .then((d: AmbientalResponse) => {
        if (!ativo) return
        setDados(d)
        setCarregando(false)
      })
      .catch(() => setCarregando(false))
    return () => {
      ativo = false
    }
  }, [])

  const ehReal = !!dados && !dados.demo && dados.focos.length > 0

  const pontos = useMemo(
    () =>
      (dados?.focos ?? []).map((f) => ({
        id: f.id,
        tipo: 'Queimada / Foco de Calor',
        zona: '',
        bairro: f.municipio || 'Amazonas',
        lat: f.lat,
        lng: f.lon,
        data: '',
      })),
    [dados]
  )

  // Top municípios por número de focos
  const topMunicipios = useMemo(() => {
    const mapa = new Map<string, number>()
    for (const f of dados?.focos ?? []) {
      const m = f.municipio || '—'
      mapa.set(m, (mapa.get(m) ?? 0) + 1)
    }
    return Array.from(mapa.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
  }, [dados])

  return (
    <section className="bg-[#0F2A45]">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 bg-obs-navy border-b border-white/10">
        <p className="text-white text-sm">
          <span className="font-bold text-obs-gold">
            {carregando ? '…' : (dados?.totalFocos ?? 0).toLocaleString('pt-BR')}
          </span>
          <span className="text-white/60">
            {' '}focos de calor no Amazonas{ehReal && dados?.periodo ? ` · ${dados.periodo}` : ''}
          </span>
        </p>
        {ehReal ? (
          <span className="text-[10px] font-bold tracking-wider uppercase bg-green-900/40 text-green-400 border border-green-600/30 px-2 py-1 rounded">
            Dados reais · INPE (geolocalizado)
          </span>
        ) : (
          <span className="text-[10px] font-bold tracking-wider uppercase bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 px-2 py-1 rounded">
            Sem dados recentes do INPE
          </span>
        )}
      </div>

      <div className="h-[460px] md:h-[600px]">
        <MapaLeaflet
          ocorrencias={pontos}
          zonas={[]}
          center={AM_CENTRO}
          zoom={AM_ZOOM}
          raioPonto={4}
          corResolver={() => '#EA580C'}
        />
      </div>

      {ehReal && topMunicipios.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-white/10">
          {topMunicipios.map(([mun, qtd]) => (
            <div key={mun} className="bg-obs-navy p-3">
              <p className="text-white/40 text-[10px] font-bold tracking-wider uppercase truncate" title={mun}>
                {mun}
              </p>
              <p className="text-white text-xl font-bold">{qtd.toLocaleString('pt-BR')}</p>
            </div>
          ))}
        </div>
      )}

      <div className="px-5 py-3 bg-obs-navy border-t border-white/10">
        <p className="text-white/35 text-[11px] leading-relaxed">
          {ehReal ? (
            <>
              Cada ponto é um <strong className="text-white/55">foco de calor real e geolocalizado</strong>{' '}
              detectado por satélite e divulgado pelo INPE. Mostrando até 800 focos mais recentes do estado do
              Amazonas. Fonte:{' '}
              <a
                href="https://terrabrasilis.dpi.inpe.br/queimadas/portal/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white/60 transition-colors"
              >
                INPE / Programa Queimadas
              </a>
              .
            </>
          ) : (
            <>
              Não foi possível obter os focos de calor recentes do INPE no momento. Consulte os dados oficiais
              diretamente no{' '}
              <a
                href="https://terrabrasilis.dpi.inpe.br/queimadas/portal/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white/60 transition-colors"
              >
                portal do Programa Queimadas (INPE)
              </a>
              .
            </>
          )}
        </p>
      </div>
    </section>
  )
}
