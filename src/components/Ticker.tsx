'use client'

import { useEffect, useState } from 'react'
import type { AvisoTicker } from '@/lib/types'

export default function Ticker({
  avisos = [],
}: {
  atualizado_em?: string
  fonte?: string
  relatorioRecente?: unknown
  avisos?: AvisoTicker[]
}) {
  // Busca avisos frescos do banco (sem cache) a cada carregamento,
  // para refletir imediatamente o que está na Gestão do Painel.
  const [avisosAtuais, setAvisosAtuais] = useState<AvisoTicker[]>(avisos)

  useEffect(() => {
    fetch('/api/avisos', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d: { avisos: AvisoTicker[] }) => {
        if (Array.isArray(d.avisos)) setAvisosAtuais(d.avisos)
      })
      .catch(() => {})
  }, [])

  if (avisosAtuais.length === 0) return null

  return (
    <div
      className="bg-obs-blue px-4 md:px-8 flex items-center gap-4 overflow-hidden"
      style={{ height: '36px' }}
      role="marquee"
      aria-label="Avisos e atualizações recentes"
    >
      <span className="bg-obs-gold text-obs-navy text-xs font-bold px-2 py-0.5 flex-shrink-0 uppercase tracking-widest">
        Atualização
      </span>
      <p className="text-white/80 text-xs whitespace-nowrap">
        {avisosAtuais.map((a, i) => (
          <span key={a.id}>
            {i > 0 && <span className="text-white/40">{'  ·  '}</span>}
            {a.link ? (
              <a
                href={a.link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white hover:underline transition-colors"
              >
                {a.texto}
              </a>
            ) : (
              a.texto
            )}
          </span>
        ))}
      </p>
    </div>
  )
}
