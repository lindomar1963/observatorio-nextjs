'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function SeminarioPopup() {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Aparece após 1.2s para não competir com o carregamento da página
    const t = setTimeout(() => setVisible(true), 1200)
    return () => clearTimeout(t)
  }, [])

  if (dismissed) return null

  return (
    <>
      <style>{`
        @keyframes popSlideUp {
          0%   { opacity: 0; transform: translateY(32px) scale(0.97); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes popSlideDown {
          0%   { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(32px) scale(0.97); }
        }
      `}</style>

      <div
        role="dialog"
        aria-modal="false"
        aria-label="4º Seminário de Segurança Inovadora"
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 9999,
          width: 'min(340px, calc(100vw - 2rem))',
          background: '#0A1628',
          border: '1px solid rgba(46,155,214,0.40)',
          borderRadius: '8px',
          boxShadow: '0 16px 56px rgba(0,0,0,0.65)',
          overflow: 'hidden',
          animation: visible ? 'popSlideUp 0.45s cubic-bezier(0.22,1,0.36,1) both' : 'none',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.3s',
          pointerEvents: visible ? 'auto' : 'none',
        }}
      >
        {/* Linha de destaque no topo */}
        <div style={{
          height: '3px',
          background: 'linear-gradient(90deg, #2E9BD6, #C9963B)',
        }} />

        {/* Imagem do banner */}
        <Link href="/seminario" onClick={() => setDismissed(true)} style={{ display: 'block' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/seminario-4.jpg"
            alt="4º Seminário de Segurança Inovadora"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </Link>

        {/* Rodapé do popup */}
        <div style={{
          padding: '0.85rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
        }}>
          <div>
            <p style={{
              color: '#2E9BD6',
              fontSize: '0.6rem',
              fontFamily: 'monospace',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              marginBottom: '0.2rem',
            }}>
              28 e 29 · Maio · 2026
            </p>
            <p style={{
              color: '#fff',
              fontSize: '0.75rem',
              fontWeight: 700,
              lineHeight: 1.3,
            }}>
              Inscrições gratuitas abertas
            </p>
          </div>

          <Link
            href="/seminario"
            onClick={() => setDismissed(true)}
            style={{
              flexShrink: 0,
              background: '#C9963B',
              color: '#0A1628',
              fontWeight: 800,
              fontSize: '0.7rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              padding: '0.55rem 1.1rem',
              textDecoration: 'none',
              borderRadius: '4px',
              whiteSpace: 'nowrap',
            }}
          >
            Inscreva-se →
          </Link>
        </div>

        {/* Botão fechar */}
        <button
          onClick={() => setDismissed(true)}
          aria-label="Fechar aviso do seminário"
          style={{
            position: 'absolute',
            top: '0.5rem',
            right: '0.5rem',
            background: 'rgba(0,0,0,0.55)',
            border: 'none',
            borderRadius: '50%',
            width: '22px',
            height: '22px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '0.75rem',
            lineHeight: 1,
            zIndex: 2,
          }}
        >
          ✕
        </button>
      </div>
    </>
  )
}
