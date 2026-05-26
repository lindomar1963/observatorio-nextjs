'use client'

import { useEffect, useState } from 'react'
import type { AvisoTicker, Relatorio } from '@/lib/types'

export default function Ticker({
  atualizado_em,
  fonte = 'SSP-AM / SINESP',
  relatorioRecente,
  avisos = [],
}: {
  atualizado_em: string
  fonte?: string
  relatorioRecente?: Relatorio | null
  avisos?: AvisoTicker[]
}) {
  // Inicia com os avisos vindos do servidor e atualiza com dados frescos
  // (sem cache) para refletir inserções recentes feitas no painel.
  const [avisosAtuais, setAvisosAtuais] = useState<AvisoTicker[]>(avisos)

  useEffect(() => {
    fetch('/api/avisos', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d: { avisos: AvisoTicker[] }) => {
        if (Array.isArray(d.avisos)) setAvisosAtuais(d.avisos)
      })
      .catch(() => {})
  }, [])

  const hora = new Date(atualizado_em).toLocaleString('pt-BR', {
    timeZone: 'America/Manaus',
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

  const itens: { texto: string; link: string | null }[] = [
    { texto: `Dados atualizados em ${hora} (Manaus) · Fonte: ${fonte}`, link: null },
  ]
  if (relatorioRecente) {
    itens.push({
      texto: `Novo relatório: ${relatorioRecente.titulo}`,
      link: relatorioRecente.arquivo_url,
    })
  }
  for (const a of avisosAtuais) {
    itens.push({ texto: a.texto, link: a.link })
  }

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
        {itens.map((item, i) => (
          <span key={i}>
            {i > 0 && <span className="text-white/40">{'  ·  '}</span>}
            {item.link ? (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white hover:underline transition-colors"
              >
                {item.texto}
              </a>
            ) : (
              item.texto
            )}
          </span>
        ))}
      </p>
    </div>
  )
}
