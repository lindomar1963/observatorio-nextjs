'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'

const SLIDES = [
  {
    tag: 'OBSERVATÓRIO · ALEAM',
    title: 'Centro de análise e monitoramento de segurança pública',
    desc: 'Dados integrados, indicadores oficiais e estudos técnicos para embasar políticas de segurança pública eficazes nos 62 municípios do Amazonas.',
    cta: { label: 'Conheça o Observatório', href: '/observatorio' },
    accent: '#22D3EE',
    bg: 'https://images.unsplash.com/photo-1542361345-89e58247f2d5?auto=format&fit=crop&w=1600&q=70',
    bgPos: 'center',
  },
  {
    tag: 'MONITORAMENTO ESTADUAL',
    title: 'Segurança pública nos 62 municípios do Amazonas',
    desc: 'Dados em tempo real sobre criminalidade, violência e indicadores de segurança pública em todo o estado, organizados por calha regional.',
    cta: { label: 'Ver Painéis', href: '/paineis' },
    accent: '#FBBF24',
    bg: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1600&q=70',
    bgPos: 'center',
  },
  {
    tag: 'ANÁLISE E INTELIGÊNCIA',
    title: 'Relatórios técnicos com rigor científico',
    desc: 'Diagnósticos, notas de pesquisa e estudos temáticos sobre criminalidade, violência doméstica e segurança pública no Amazonas.',
    cta: { label: 'Ver Relatórios', href: '/relatorios' },
    accent: '#3b82f6',
    bg: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=70',
    bgPos: 'center',
  },
  {
    tag: 'BASE LEGISLATIVA',
    title: 'Legislação e políticas públicas de segurança',
    desc: 'Acervo técnico com legislação federal e estadual, estudos comparados e referências para gestores, legisladores e pesquisadores.',
    cta: { label: 'Acessar Biblioteca', href: '/biblioteca' },
    accent: '#8B5CF6',
    bg: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1600&q=70',
    bgPos: 'center',
  },
  {
    tag: 'TRANSPARÊNCIA E DADOS ABERTOS',
    title: 'Acesso público a dados sobre segurança',
    desc: 'Bases de dados abertas em conformidade com a Lei de Acesso à Informação, disponíveis para pesquisadores, gestores e cidadãos.',
    cta: { label: 'Dados Abertos', href: '/dados-abertos' },
    accent: '#A3E635',
    bg: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=70',
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
    }, 9000)
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
        /* Card do seminário aparece no espaço lateral do carrossel (desktop) */
        @media (max-width: 960px) {
          .seminario-lateral-card { display: none !important; }
        }
        /* Popup flutuante some no desktop — o card lateral ocupa o lugar */
        @media (min-width: 961px) {
          .seminario-popup-float { display: none !important; }
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

      {/* Conteúdo: texto à esquerda + card do seminário à direita */}
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
          justifyContent: 'space-between',
          gap: '2rem',
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

        {/* Card do Seminário — espaço lateral direito, visível apenas no desktop */}
        <div
          className="seminario-lateral-card"
          style={{
            flexShrink: 0,
            width: '270px',
            background: 'rgba(6,10,20,0.82)',
            border: '1px solid rgba(34,211,238,0.38)',
            borderRadius: '8px',
            overflow: 'hidden',
            backdropFilter: 'blur(14px)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.55)',
          }}
        >
          <div style={{ height: '3px', background: 'linear-gradient(90deg,#22D3EE,#FBBF24)' }} />
          <Link href="/seminario" style={{ display: 'block' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/seminario-4.jpg"
              alt="4º Seminário de Segurança Inovadora"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </Link>
          <div style={{
            padding: '0.8rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
          }}>
            <div>
              <p style={{
                color: '#22D3EE',
                fontSize: '0.6rem',
                fontFamily: 'monospace',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                marginBottom: '0.2rem',
              }}>
                28 e 29 · Maio · 2026
              </p>
              <p style={{
                color: '#fff',
                fontSize: '0.72rem',
                fontWeight: 700,
                lineHeight: 1.3,
              }}>
                Inscrições gratuitas abertas
              </p>
            </div>
            <Link
              href="/seminario"
              style={{
                flexShrink: 0,
                background: '#FBBF24',
                color: '#060A14',
                fontWeight: 800,
                fontSize: '0.65rem',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                padding: '0.5rem 0.9rem',
                textDecoration: 'none',
                borderRadius: '4px',
                whiteSpace: 'nowrap',
              }}
            >
              Inscreva-se →
            </Link>
          </div>
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
