'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function Nav() {
  const [open, setOpen] = useState(false)
  const links = [
    { href: '/observatorio', label: 'O Observatório' },
    { href: '/paineis', label: 'Painéis' },
    { href: '/municipios', label: 'Municípios' },
    { href: '/relatorios', label: 'Relatórios' },
    { href: '/biblioteca', label: 'Biblioteca' },
    { href: '/noticias', label: 'Notícias' },
    { href: '/contato', label: 'Contato' },
  ]
  return (
    <header role="banner">
      <nav
        aria-label="Navegação principal"
        className="bg-obs-navy px-4 md:px-8"
        style={{ height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <Link href="/" className="flex items-center gap-2" aria-label="Observatório de Segurança Pública do Amazonas — página inicial">
          <div
            aria-hidden="true"
            style={{
              width: 28, height: 32, background: '#C9963B',
              clipPath: 'polygon(50% 0%,100% 15%,100% 60%,50% 100%,0% 60%,0% 15%)',
              flexShrink: 0
            }}
          />
          <div className="text-white text-xs font-semibold leading-tight tracking-wider">
            OBSERVATÓRIO<br />
            <span className="text-obs-gold">SEGURANÇA PÚBLICA · AM</span>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6" role="list">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              role="listitem"
              className="text-white/60 hover:text-obs-gold text-xs font-semibold tracking-widest transition-colors duration-200 uppercase"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <Link
          href="/area-restrita"
          className="hidden md:inline-block bg-obs-gold text-obs-navy text-xs font-bold px-4 py-2 tracking-wider hover:bg-yellow-500 transition-colors"
        >
          ÁREA RESTRITA
        </Link>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white p-2"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <div className="space-y-1.5">
            <span className={`block w-6 h-0.5 bg-white transition-transform ${open ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-white transition-opacity ${open ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-white transition-transform ${open ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-obs-navy border-t border-white/10" role="navigation" aria-label="Menu mobile">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="block text-white/70 hover:text-obs-gold px-6 py-3 text-sm font-semibold border-b border-white/5"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/area-restrita"
            className="block bg-obs-gold text-obs-navy text-center py-3 text-sm font-bold"
            onClick={() => setOpen(false)}
          >
            ÁREA RESTRITA
          </Link>
        </div>
      )}
    </header>
  )
}
