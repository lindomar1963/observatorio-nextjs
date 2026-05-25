'use client'

import { useEffect, useState } from 'react'
import type { AmbientalResponse } from '@/app/api/ambiental/route'

export default function AmbientalStats() {
  const [dados, setDados] = useState<AmbientalResponse | null>(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    fetch('/api/ambiental')
      .then((r) => r.json())
      .then((d: AmbientalResponse) => {
        setDados(d)
        setCarregando(false)
      })
      .catch(() => setCarregando(false))
  }, [])

  if (!carregando && !dados) return null

  const ehDemo = dados?.demo ?? true

  return (
    <section className="bg-[#0a1e35] border-t border-white/10 px-4 md:px-8 py-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <p className="text-obs-gold text-[10px] font-bold tracking-widest uppercase">
              Monitoramento ambiental · INPE
            </p>
            <h2 className="text-white text-sm font-bold tracking-wide">
              Indicadores Ambientais — Amazonas
            </h2>
          </div>
          <span
            className={`text-[10px] font-bold tracking-wider uppercase px-2 py-1 rounded border ${
              ehDemo
                ? 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30'
                : 'bg-green-900/40 text-green-400 border-green-600/30'
            }`}
          >
            {ehDemo ? 'Sem dados recentes' : 'Dados reais · INPE'}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(dados?.indicadores ?? []).map((ind) => {
            // Só "Queimada / Foco de Calor" tem dado real do INPE; os demais aguardam fonte.
            const temReal = !ehDemo && ind.total > 0
            return (
              <div key={ind.tipo} className="bg-obs-navy border border-white/10 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: ind.cor }} />
                  <p className="text-white/50 text-[10px] font-bold tracking-wider uppercase leading-tight">
                    {ind.tipo}
                  </p>
                </div>
                <p className="text-white text-2xl font-bold">
                  {temReal ? ind.total.toLocaleString('pt-BR') : '—'}
                </p>
                <p className="text-white/30 text-[10px] mt-1">{ind.periodo}</p>
              </div>
            )
          })}
        </div>

        <p className="text-white/25 text-[10px] mt-4">
          Fonte:{' '}
          <a
            href="https://terrabrasilis.dpi.inpe.br/queimadas/portal/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white/50 transition-colors"
          >
            {dados?.fonte ?? 'INPE'}
          </a>
          {ehDemo
            ? ' · Não foi possível obter os focos de calor recentes do INPE no momento.'
            : ' · Focos de calor geolocalizados, atualizados diariamente. Desmatamento (PRODES) e demais categorias em integração.'}
        </p>
      </div>
    </section>
  )
}
