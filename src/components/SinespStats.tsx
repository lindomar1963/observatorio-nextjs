'use client'

import { useEffect, useState } from 'react'
import type { SinespResponse, SinespIndicador } from '@/app/api/sinesp/route'

function Variacao({ v }: { v: number | null }) {
  if (v === null) return null
  const positivo = v > 0
  const neutro = v === 0
  return (
    <span
      className={`text-[10px] font-bold ml-1 ${
        neutro ? 'text-white/40' : positivo ? 'text-red-400' : 'text-lime-400'
      }`}
    >
      {positivo ? '▲' : neutro ? '–' : '▼'} {Math.abs(v)}%
    </span>
  )
}

function CardSkeleton() {
  return (
    <div className="bg-obs-navy border border-white/10 p-4 animate-pulse">
      <div className="h-2 w-20 bg-white/10 rounded mb-3" />
      <div className="h-8 w-12 bg-white/10 rounded mb-2" />
      <div className="h-2 w-16 bg-white/5 rounded" />
    </div>
  )
}

export default function SinespStats({
  obs,
  titulo = 'Indicadores Criminais — Manaus',
  fallbackIndicadores,
}: {
  obs?: string
  titulo?: string
  fallbackIndicadores?: SinespIndicador[]
} = {}) {
  const [dados, setDados] = useState<SinespResponse | null>(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const url = obs ? `/api/sinesp?obs=${encodeURIComponent(obs)}` : '/api/sinesp'
    fetch(url)
      .then((r) => r.json())
      .then((d: SinespResponse) => {
        setDados(d)
        setCarregando(false)
      })
      .catch(() => setCarregando(false))
  }, [obs])

  // Determina se os dados são reais ou estimados
  const apiOk = !carregando && dados?.ok && (dados?.indicadores?.length ?? 0) > 0
  const isEstimativa = !carregando && !apiOk

  // Se não há fallback e a API falhou — não renderiza nada
  if (isEstimativa && (!fallbackIndicadores || fallbackIndicadores.length === 0)) {
    return null
  }

  const indicadores = apiOk ? dados!.indicadores : (fallbackIndicadores ?? [])
  const mesRef = apiOk ? (indicadores[0]?.mesRef ?? '…') : 'Estimativa'

  return (
    <section className="bg-[#0a1422] border-t border-white/10 px-4 md:px-8 py-6">
      <div className="max-w-5xl mx-auto">
        {/* Cabeçalho */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <p className="text-obs-gold text-[10px] font-bold tracking-widest uppercase">
              Dados Oficiais · SINESP / MJ
            </p>
            <h2 className="text-white text-sm font-bold tracking-wide">
              {titulo}
              {!carregando && (
                <span className="text-white/40 font-normal ml-2">({mesRef})</span>
              )}
            </h2>
          </div>
          {carregando ? (
            <span className="text-[10px] bg-green-900/40 text-green-400 border border-green-600/30 px-2 py-1 font-bold tracking-wider uppercase rounded animate-pulse">
              Fonte Oficial
            </span>
          ) : apiOk ? (
            <span className="text-[10px] bg-green-900/40 text-green-400 border border-green-600/30 px-2 py-1 font-bold tracking-wider uppercase rounded">
              Fonte Oficial
            </span>
          ) : (
            <span className="text-[10px] bg-amber-900/40 text-amber-400 border border-amber-600/30 px-2 py-1 font-bold tracking-wider uppercase rounded">
              ⚠ Estimativa
            </span>
          )}
        </div>

        {/* Aviso de estimativa */}
        {isEstimativa && (
          <div className="mb-4 flex items-start gap-2 bg-amber-900/20 border border-amber-700/30 rounded px-3 py-2">
            <span className="text-amber-400 text-sm mt-0.5 flex-shrink-0">⚠</span>
            <p className="text-amber-300/80 text-[11px] leading-snug">
              Base SINESP temporariamente indisponível — os números abaixo são estimativas
              baseadas em médias históricas regionais. Os dados oficiais serão exibidos assim
              que a fonte for restabelecida.
            </p>
          </div>
        )}

        {/* Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {carregando
            ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
            : indicadores.map((ind: SinespIndicador) => (
                <div
                  key={ind.tipo}
                  className={`border p-4 hover:border-white/20 transition-colors ${
                    isEstimativa
                      ? 'bg-obs-navy border-amber-800/30'
                      : 'bg-obs-navy border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${isEstimativa ? 'opacity-60' : ''}`}
                      style={{ background: ind.cor }}
                    />
                    <p className="text-white/50 text-[10px] font-bold tracking-wider uppercase leading-tight">
                      {ind.tipo}
                    </p>
                  </div>
                  <p className={`text-2xl font-bold ${isEstimativa ? 'text-white/70' : 'text-white'}`}>
                    {isEstimativa ? '~' : ''}{ind.total.toLocaleString('pt-BR')}
                    {!isEstimativa && <Variacao v={ind.variacao} />}
                  </p>
                  <p className="text-white/30 text-[10px] mt-1">
                    {isEstimativa ? 'estimativa mensal' : `ocorrências em ${ind.mesRef}`}
                  </p>
                </div>
              ))}
        </div>

        {/* Rodapé de fonte */}
        {!carregando && (
          <p className="text-white/25 text-[10px] mt-4">
            {apiOk ? (
              <>
                Fonte:{' '}
                <a
                  href="https://dados.mj.gov.br/dataset/sistema-nacional-de-estatisticas-de-seguranca-publica"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-white/50 transition-colors"
                >
                  {dados!.fonte}
                </a>
                {' · '}Atualização mensal · Nível municipal (Manaus)
                {indicadores[0]?.variacao !== null && (
                  <span>
                    {' · '}
                    <span className="text-lime-400">▼ queda</span> /{' '}
                    <span className="text-red-400">▲ alta</span> vs. mês anterior
                  </span>
                )}
              </>
            ) : (
              <>
                <span className="text-amber-500/60">⚠ Estimativa</span>
                {' · '}Os dados reais serão exibidos automaticamente quando a base{' '}
                <a
                  href="https://dados.mj.gov.br/dataset/sistema-nacional-de-estatisticas-de-seguranca-publica"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-white/50 transition-colors"
                >
                  SINESP / Ministério da Justiça
                </a>{' '}
                estiver disponível.
              </>
            )}
          </p>
        )}
      </div>
    </section>
  )
}
