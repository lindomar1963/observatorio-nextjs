'use client'

import { useEffect, useState } from 'react'
import type { NoticiasResponse, NoticiaExterna } from '@/app/api/noticias/route'

const catColor: Record<string, string> = {
  'ALEAM':            'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Segurança Pública':'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Manaus':           'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  'Polícia':          'bg-obs-lime/20 text-obs-lime border-obs-lime/30',
  'Drogas':           'bg-red-500/20 text-red-400 border-red-500/30',
}

function tempoRelativo(iso: string): string {
  const diff = Date.now() - +new Date(iso)
  const h = Math.floor(diff / 3_600_000)
  if (h < 1) return 'agora há pouco'
  if (h < 24) return `há ${h} h`
  const d = Math.floor(h / 24)
  if (d === 1) return 'ontem'
  if (d < 30) return `há ${d} dias`
  return new Date(iso).toLocaleDateString('pt-BR')
}

function Skeleton() {
  return (
    <div className="border border-obs-border bg-obs-card p-5 animate-pulse">
      <div className="h-3 w-24 bg-white/10 rounded mb-3" />
      <div className="h-4 w-full bg-white/10 rounded mb-2" />
      <div className="h-4 w-2/3 bg-white/10 rounded" />
    </div>
  )
}

export default function NoticiasAoVivo() {
  const [dados, setDados] = useState<NoticiasResponse | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [filtro, setFiltro] = useState<string>('Todas')

  useEffect(() => {
    fetch('/api/noticias')
      .then((r) => r.json())
      .then((d: NoticiasResponse) => {
        setDados(d)
        setCarregando(false)
      })
      .catch(() => setCarregando(false))
  }, [])

  // Falhou completamente: não renderiza a seção (a página mantém o conteúdo institucional)
  if (!carregando && (!dados || !dados.ok || dados.noticias.length === 0)) {
    return null
  }

  // ALEAM sempre primeiro nos filtros, demais em ordem de aparecimento
  const categorias = dados
    ? ['Todas', 'ALEAM', ...Array.from(new Set(dados.noticias.map((n) => n.categoria))).filter((c) => c !== 'ALEAM')]
    : ['Todas', 'ALEAM']

  const lista: NoticiaExterna[] =
    dados?.noticias.filter((n) => filtro === 'Todas' || n.categoria === filtro) ?? []

  // ALEAM em destaque (topo), demais abaixo
  const aleamList = lista.filter((n) => n.categoria === 'ALEAM')
  const outras = lista.filter((n) => n.categoria !== 'ALEAM')

  return (
    <section className="bg-obs-panel px-4 md:px-8 py-12 border-t border-obs-border">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <p className="text-obs-gold text-[10px] font-bold tracking-widest uppercase mb-1">
              Monitoramento automático · Google Notícias
            </p>
            <h2 className="text-white text-lg font-bold">Notícias em tempo real</h2>
          </div>
          <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase text-obs-lime">
            <span className="w-2 h-2 rounded-full bg-obs-lime animate-pulse" /> Ao vivo
          </span>
        </div>

        {/* Filtros de categoria — ALEAM primeiro */}
        {!carregando && (
          <div className="flex flex-wrap gap-2 mb-6">
            {categorias.map((c) => (
              <button
                key={c}
                onClick={() => setFiltro(c)}
                className={`text-[11px] font-bold tracking-wider uppercase px-3 py-1.5 border transition-colors ${
                  filtro === c
                    ? 'bg-obs-cyan text-obs-navy border-obs-cyan'
                    : 'text-white/50 border-obs-border hover:border-obs-cyan/40 hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {carregando ? (
          <div className="grid md:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            {/* Bloco de destaque: ALEAM */}
            {aleamList.length > 0 && filtro === 'Todas' && (
              <div className="mb-8">
                <h3 className="text-purple-400 text-xs font-bold tracking-widest uppercase mb-4">
                  ALEAM — Assembleia Legislativa do Amazonas
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {aleamList.slice(0, 4).map((n, i) => (
                    <NoticiaCard key={`aleam-${i}`} n={n} destaque />
                  ))}
                </div>
              </div>
            )}

            {/* Demais notícias */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(filtro === 'Todas' ? outras : lista).map((n, i) => (
                <NoticiaCard key={i} n={n} />
              ))}
            </div>
          </>
        )}

        {!carregando && dados?.ok && (
          <p className="text-white/25 text-[10px] mt-8">
            Fonte: Google Notícias · ALEAM (aleam.am.leg.br) e segurança pública no Amazonas ·
            Atualização a cada 30 min ·{' '}
            {dados.noticias.length} matérias monitoradas
          </p>
        )}
      </div>
    </section>
  )
}

function NoticiaCard({ n, destaque }: { n: NoticiaExterna; destaque?: boolean }) {
  return (
    <a
      href={n.link}
      target="_blank"
      rel="noopener noreferrer"
      className={`block border-2 p-5 transition-colors group ${
        destaque
          ? 'border-obs-gold/55 bg-purple-500/10 hover:border-obs-gold'
          : 'border-obs-gold/30 bg-obs-card hover:border-obs-gold'
      }`}
    >
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span
          className={`text-[10px] font-bold px-2 py-0.5 border ${
            catColor[n.categoria] ?? 'bg-white/10 text-white/60 border-white/20'
          }`}
        >
          {n.categoria}
        </span>
        <span className="text-white/45 text-[10px]">{tempoRelativo(n.data)}</span>
      </div>
      <h3 className="text-white font-semibold text-sm leading-snug mb-2 group-hover:text-obs-gold transition-colors">
        {n.titulo}
      </h3>
      <p className="text-white/55 text-[11px]">{n.fonte}</p>
    </a>
  )
}
