'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'

const px = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1600`

const SLIDES = [
  {
    tag: 'GEOINTELIGÊNCIA · MANAUS',
    title: 'Observatório de Segurança Pública',
    desc: 'Mapa interativo e indicadores de criminalidade por zonas de Manaus — com foco em crime organizado e tráfico de drogas.',
    cta: { label: 'Acessar Observatório', href: '/mapa' },
    accent: '#22D3EE',
    bg: px(10653886),
    bgPos: 'center',
  },
  {
    tag: 'VIOLÊNCIA DE GÊNERO',
    title: 'Observatório da Mulher',
    desc: 'Feminicídio, estupro, violência doméstica e ameaça — enfrentamento à violência de gênero em Manaus.',
    cta: { label: 'Acessar Observatório', href: '/observatorio-da-mulher' },
    accent: '#EC4899',
    bg: px(2437901),
    bgPos: 'center',
  },
  {
    tag: 'INFÂNCIA E ADOLESCÊNCIA',
    title: 'Observatório da Criança',
    desc: 'Proteção à infância e adolescência — monitoramento dos crimes contra crianças e adolescentes.',
    cta: { label: 'Acessar Observatório', href: '/observatorio-da-crianca' },
    accent: '#F59E0B',
    bg: px(27093997),
    bgPos: 'center',
  },
  {
    tag: 'PROTEÇÃO À PESSOA IDOSA',
    title: 'Observatório do Idoso',
    desc: 'Violência física, estelionato, abandono e ameaça — proteção à pessoa idosa com base no Estatuto do Idoso.',
    cta: { label: 'Acessar Observatório', href: '/observatorio-do-idoso' },
    accent: '#8B5CF6',
    bg: px(11957449),
    bgPos: 'center',
  },
  {
    tag: 'PATRIMÔNIO E SEGURANÇA NAS RUAS',
    title: 'Observatório de Roubos e Furtos',
    desc: 'Celulares, pedestres e veículos — um dos crimes de maior impacto no cotidiano da população.',
    cta: { label: 'Acessar Observatório', href: '/observatorio-roubos-furtos' },
    accent: '#FBBF24',
    bg: px(30546987),
    bgPos: 'center',
  },
  {
    tag: 'DEFESA DO MEIO AMBIENTE',
    title: 'Observatório de Crimes Ambientais',
    desc: 'Desmatamento, queimadas, garimpo e pesca ilegal — com dados de focos de calor do INPE.',
    cta: { label: 'Acessar Observatório', href: '/observatorio-crimes-ambientais' },
    accent: '#22C55E',
    bg: px(4070727),
    bgPos: 'center',
  },
  {
    tag: 'SEGURANÇA VIÁRIA',
    title: 'Observatório de Acidentes de Trânsito',
    desc: 'Sinistros fatais, embriaguez ao volante, atropelamentos e lesões — segurança viária em Manaus.',
    cta: { label: 'Acessar Observatório', href: '/observatorio-acidentes-transito' },
    accent: '#EF4444',
    bg: px(11985980),
    bgPos: 'center',
  },
  {
    tag: 'PROTEÇÃO À JUVENTUDE',
    title: 'Observatório de Violência Juvenil',
    desc: 'Homicídios juvenis, lesões, atos infracionais e envolvimento com o tráfico — proteção à juventude.',
    cta: { label: 'Acessar Observatório', href: '/observatorio-violencia-juvenil' },
    accent: '#A3E635',
    bg: px(12430063),
    bgPos: 'center',
  },
  {
    tag: 'SEGURANÇA NO AMBIENTE DIGITAL',
    title: 'Observatório de Crimes Cibernéticos',
    desc: 'Estelionato online, golpes do PIX, fraude bancária e invasão de dispositivos — segurança digital.',
    cta: { label: 'Acessar Observatório', href: '/observatorio-crimes-digitais' },
    accent: '#22D3EE',
    bg: px(5935787),
    bgPos: 'center',
  },
  {
    tag: 'IDEALIZADOR DO OBSERVATÓRIO',
    title: 'Dep. Comandante Dan',
    desc: 'Presidente da Comissão de Segurança Pública, Acesso à Justiça e Defesa Social da ALEAM e idealizador do Observatório de Segurança Pública do Amazonas.',
    cta: { label: 'Conheça o mandato', href: 'https://www.comandantedan.com.br/' },
    accent: '#FBBF24',
    bg: 'https://comandantedan.com.br/arquivos/imagens/01-%5B30-01-26%5D%5B00-48-51%5D.jpg',
    bgPos: 'center top',
  },
]

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0)
  const [fading, setFading] = useState(false)
  const [paused, setPaused] = useState(false)

  const goTo = useCallback((i: number) => {
    if (i === current) return
    setFading(true)
    setTimeout(() => {
      setCurrent(i)
      setFading(false)
    }, 400)
  }, [current])

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setCurrent((c) => (c + 1) % SLIDES.length)
        setFading(false)
      }, 400)
    }, 6000)
    return () => clearInterval(id)
  }, [paused])

  const s = SLIDES[current]
  const isExternal = s.cta.href.startsWith('http')

  // Texto do botão: preto em fundos claros, branco em escuros
  const corTextoBotao = (() => {
    const h = s.accent.replace('#', '')
    const r = parseInt(h.slice(0, 2), 16)
    const g = parseInt(h.slice(2, 4), 16)
    const b = parseInt(h.slice(4, 6), 16)
    return 0.299 * r + 0.587 * g + 0.114 * b > 150 ? '#0A1322' : '#ffffff'
  })()

  const ctaStyle = {
    display: 'inline-block',
    background: s.accent,
    color: corTextoBotao,
    fontWeight: 800,
    fontSize: '0.78rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
    padding: '0.75rem 1.9rem',
    textDecoration: 'none',
    borderRadius: '3px',
    boxShadow: `0 6px 24px ${s.accent}50`,
  }

  return (
    <section
      aria-label="Destaques do Observatório"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: '440px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: '#060A14',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <style>{`
        @keyframes obsKenBurns {
          0%   { transform: scale(1.04) translate(0, 0); }
          100% { transform: scale(1.16) translate(-1.5%, -1.5%); }
        }
        @keyframes obsFadeUp {
          0%   { opacity: 0; transform: translateY(14px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Imagem de fundo com zoom lento (Ken Burns) */}
      <div
        key={current}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url('${s.bg}')`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: s.bgPos,
          animation: 'obsKenBurns 8s ease-out forwards',
          opacity: fading ? 0 : 1,
          transition: 'opacity 0.4s ease',
        }}
      />

      {/* Escurecimento para legibilidade */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(90deg, rgba(8,18,34,0.94) 0%, rgba(8,18,34,0.80) 45%, rgba(8,18,34,0.40) 100%)`,
        }}
      />

      {/* Grade sutil sobre a imagem */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Linha de destaque no topo */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${s.accent}, transparent)`,
          opacity: 0.7,
          transition: 'background 0.8s ease',
        }}
      />

      {/* Conteúdo: texto do slide */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '1100px',
          width: '100%',
          margin: '0 auto',
          padding: '3rem 6vw',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Texto do slide */}
        <div
          key={`txt-${current}`}
          style={{
            flex: 1,
            maxWidth: '580px',
            opacity: fading ? 0 : 1,
            animation: fading ? 'none' : 'obsFadeUp 0.6s ease both',
          }}
        >
          <p style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            fontFamily: 'monospace',
            fontSize: '0.82rem',
            fontWeight: 700,
            letterSpacing: '0.18em',
            color: s.accent,
            textTransform: 'uppercase',
            border: `1px solid ${s.accent}66`,
            background: `${s.accent}26`,
            padding: '0.4rem 0.95rem',
            borderRadius: '2px',
            marginBottom: '1.1rem',
            backdropFilter: 'blur(4px)',
            textShadow: '0 1px 6px rgba(0,0,0,0.55)',
          }}>
            ▸ {s.tag}
          </p>

          <h2 style={{
            fontFamily: 'var(--font-playfair, serif)',
            fontSize: 'clamp(1.6rem, 4vw, 2.7rem)',
            fontWeight: 700,
            color: '#fff',
            lineHeight: 1.15,
            marginBottom: '0.9rem',
            textShadow: '0 2px 20px rgba(0,0,0,0.5)',
          }}>
            {s.title}
          </h2>

          <p style={{
            color: 'rgba(240,248,255,0.82)',
            fontSize: '0.92rem',
            lineHeight: 1.7,
            maxWidth: '520px',
            marginBottom: '1.6rem',
            textShadow: '0 1px 12px rgba(0,0,0,0.6)',
          }}>
            {s.desc}
          </p>

          {isExternal ? (
            <a href={s.cta.href} target="_blank" rel="noopener noreferrer" style={ctaStyle}>
              {s.cta.label} →
            </a>
          ) : (
            <Link href={s.cta.href} style={ctaStyle}>
              {s.cta.label} →
            </Link>
          )}
        </div>

      </div>

      {/* Navegação por pontos */}
      <div
        style={{
          position: 'absolute',
          bottom: '1.1rem',
          left: 0,
          right: 0,
          zIndex: 4,
          display: 'flex',
          gap: '0.4rem',
          justifyContent: 'center',
        }}
        role="tablist"
        aria-label="Slides"
      >
        {SLIDES.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === current}
            aria-label={`Slide ${i + 1}: ${SLIDES[i].tag}`}
            onClick={() => goTo(i)}
            style={{
              width: i === current ? '28px' : '8px',
              height: '6px',
              borderRadius: '3px',
              background: i === current ? s.accent : 'rgba(255,255,255,0.3)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.35s ease',
              padding: 0,
            }}
          />
        ))}
      </div>
    </section>
  )
}
