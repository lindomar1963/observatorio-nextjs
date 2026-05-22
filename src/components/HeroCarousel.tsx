'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'

const SLIDES = [
  {
    tag: 'MONITORAMENTO ESTADUAL',
    title: 'Segurança pública nos 62 municípios do Amazonas',
    desc: 'Dados em tempo real sobre criminalidade, violência e indicadores de segurança pública em todo o estado, organizados por calha regional.',
    cta: { label: 'Ver Painéis', href: '/paineis' },
    accent: '#C9963B',
    gradFrom: '#0A1628',
    gradTo: '#1a2f4a',
    icon: '🗺️',
  },
  {
    tag: 'ANÁLISE E INTELIGÊNCIA',
    title: 'Relatórios técnicos com rigor científico',
    desc: 'Diagnósticos, notas de pesquisa e estudos temáticos sobre criminalidade, violência doméstica e segurança pública no Amazonas.',
    cta: { label: 'Ver Relatórios', href: '/relatorios' },
    accent: '#3b82f6',
    gradFrom: '#060d1a',
    gradTo: '#0d1f40',
    icon: '📊',
  },
  {
    tag: 'BASE LEGISLATIVA',
    title: 'Legislação e políticas públicas de segurança',
    desc: 'Acervo técnico com legislação federal e estadual, estudos comparados e referências para gestores, legisladores e pesquisadores.',
    cta: { label: 'Acessar Biblioteca', href: '/biblioteca' },
    accent: '#a855f7',
    gradFrom: '#0c0a20',
    gradTo: '#1a0d3a',
    icon: '📚',
  },
  {
    tag: 'TRANSPARÊNCIA E DADOS ABERTOS',
    title: 'Acesso público a dados sobre segurança',
    desc: 'Bases de dados abertas em conformidade com a Lei de Acesso à Informação, disponíveis para pesquisadores, gestores e cidadãos.',
    cta: { label: 'Dados Abertos', href: '/dados-abertos' },
    accent: '#10b981',
    gradFrom: '#041a12',
    gradTo: '#062a1e',
    icon: '🔓',
  },
]

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0)
  const [fading, setFading] = useState(false)

  const goTo = useCallback((i: number) => {
    if (i === current) return
    setFading(true)
    setTimeout(() => {
      setCurrent(i)
      setFading(false)
    }, 350)
  }, [current])

  useEffect(() => {
    const id = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setCurrent((c) => (c + 1) % SLIDES.length)
        setFading(false)
      }, 350)
    }, 7000)
    return () => clearInterval(id)
  }, [])

  const s = SLIDES[current]

  return (
    <section
      aria-label="Destaques do Observatório"
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${s.gradFrom} 0%, ${s.gradTo} 100%)`,
        transition: 'background 0.8s ease',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* grid background */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* accent line top */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${s.accent}, transparent)`,
          opacity: 0.6,
          transition: 'background 0.8s ease',
        }}
      />

      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '3.5rem 6vw 2.5rem',
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: '2rem',
          alignItems: 'center',
          opacity: fading ? 0 : 1,
          transform: fading ? 'translateY(10px)' : 'translateY(0)',
          transition: 'opacity 0.35s ease, transform 0.35s ease',
        }}
      >
        <div>
          <p style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontFamily: 'monospace',
            fontSize: '0.62rem',
            letterSpacing: '0.22em',
            color: s.accent,
            textTransform: 'uppercase',
            border: `1px solid ${s.accent}35`,
            background: `${s.accent}10`,
            padding: '0.25rem 0.75rem',
            borderRadius: '2px',
            marginBottom: '1rem',
            transition: 'all 0.5s',
          }}>
            ▸ {s.tag}
          </p>

          <h2 style={{
            fontFamily: 'var(--font-playfair, serif)',
            fontSize: 'clamp(1.5rem, 3.5vw, 2.4rem)',
            fontWeight: 700,
            color: '#fff',
            lineHeight: 1.2,
            marginBottom: '0.8rem',
            maxWidth: '640px',
          }}>
            {s.title}
          </h2>

          <p style={{
            color: 'rgba(240,248,255,0.55)',
            fontSize: '0.88rem',
            lineHeight: 1.7,
            maxWidth: '540px',
            marginBottom: '1.5rem',
          }}>
            {s.desc}
          </p>

          <Link
            href={s.cta.href}
            style={{
              display: 'inline-block',
              background: s.accent,
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.78rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '0.65rem 1.75rem',
              textDecoration: 'none',
              borderRadius: '3px',
              transition: 'opacity 0.2s',
            }}
          >
            {s.cta.label} →
          </Link>
        </div>

        <div
          aria-hidden="true"
          style={{
            fontSize: '4rem',
            opacity: 0.15,
            display: 'none',
          }}
          className="md:block"
        >
          {s.icon}
        </div>
      </div>

      {/* dot navigation */}
      <div
        style={{
          display: 'flex',
          gap: '0.4rem',
          justifyContent: 'center',
          paddingBottom: '1.5rem',
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
              background: i === current ? s.accent : 'rgba(255,255,255,0.2)',
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
