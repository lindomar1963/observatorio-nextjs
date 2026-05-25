'use client'
import { useState } from 'react'
import Link from 'next/link'

const OBSERVATORIOS = [
  { href: '/mapa',                           label: 'Segurança Pública' },
  { href: '/observatorio-da-mulher',         label: 'Da Mulher' },
  { href: '/observatorio-da-crianca',        label: 'Da Criança' },
  { href: '/observatorio-do-idoso',          label: 'Do Idoso' },
  { href: '/observatorio-roubos-furtos',     label: 'Roubos e Furtos' },
  { href: '/observatorio-crimes-ambientais', label: 'Crimes Ambientais' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)

  const linkCls =
    'text-white/55 hover:text-obs-cyan text-xs font-semibold tracking-widest transition-colors duration-200 uppercase'

  const links = [
    { href: '/', label: 'Início' },
    { href: '/observatorio', label: 'O Observatório' },
    { href: '/paineis', label: 'Painéis' },
    { href: '/municipios', label: 'Municípios' },
    { href: '/relatorios', label: 'Relatórios' },
    { href: '/noticias', label: 'Notícias' },
    { href: '/contato', label: 'Contato' },
  ]

  return (
    <header role="banner">
      <nav
        aria-label="Navegação principal"
        className="bg-obs-navy border-b border-obs-border px-4 md:px-8"
        style={{ height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5" aria-label="Observatório de Segurança Pública do Amazonas — página inicial">
          {/* ícone neon */}
          <div
            aria-hidden="true"
            style={{
              width: 28, height: 32,
              background: 'linear-gradient(135deg, #22D3EE 0%, #8B5CF6 100%)',
              clipPath: 'polygon(50% 0%,100% 15%,100% 60%,50% 100%,0% 60%,0% 15%)',
              flexShrink: 0,
              filter: 'drop-shadow(0 0 8px rgba(34,211,238,0.7))',
            }}
          />
          <div className="text-white text-xs font-semibold leading-tight tracking-wider">
            OBSERVATÓRIO<br />
            <span className="text-obs-cyan text-glow-cyan">SEGURANÇA PÚBLICA · AM</span>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className={linkCls}>Início</Link>
          <Link href="/observatorio" className={linkCls}>O Observatório</Link>
          <Link href="/paineis" className={linkCls}>Painéis</Link>

          {/* Dropdown Observatórios */}
          <div className="relative group">
            <button className={`${linkCls} flex items-center gap-1`} aria-haspopup="true">
              Observatórios
              <span aria-hidden="true" className="text-[8px]">▼</span>
            </button>
            <div className="absolute left-0 top-full pt-3 hidden group-hover:block z-50">
              <div className="bg-obs-panel border border-obs-border min-w-[230px] shadow-2xl">
                {OBSERVATORIOS.map((o) => (
                  <Link
                    key={o.href}
                    href={o.href}
                    className="block px-4 py-3 text-white/60 hover:text-obs-cyan hover:bg-white/5 text-xs font-semibold border-b border-obs-border last:border-0 transition-colors"
                  >
                    {o.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Link href="/municipios" className={linkCls}>Municípios</Link>
          <Link href="/relatorios" className={linkCls}>Relatórios</Link>
          <Link href="/noticias" className={linkCls}>Notícias</Link>
          <Link href="/contato" className={linkCls}>Contato</Link>
        </div>

        {/* Botão Área Restrita — gradiente ciano→violeta */}
        <Link
          href="/area-restrita"
          className="hidden md:inline-block btn-grad text-obs-navy text-xs font-bold px-4 py-2 tracking-wider rounded-sm"
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
        <div className="md:hidden bg-obs-panel border-b border-obs-border" role="navigation" aria-label="Menu mobile">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="block text-white/60 hover:text-obs-cyan px-6 py-3 text-sm font-semibold border-b border-obs-border"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}

          <p className="px-6 pt-4 pb-1 text-obs-cyan text-[10px] font-bold tracking-widest uppercase">Observatórios</p>
          {OBSERVATORIOS.map((o) => (
            <Link
              key={o.href}
              href={o.href}
              className="block text-white/50 hover:text-obs-cyan px-8 py-2.5 text-sm font-semibold border-b border-obs-border"
              onClick={() => setOpen(false)}
            >
              {o.label}
            </Link>
          ))}

          <Link
            href="/area-restrita"
            className="block btn-grad text-obs-navy text-center py-3 text-sm font-bold mt-2"
            onClick={() => setOpen(false)}
          >
            ÁREA RESTRITA
          </Link>
        </div>
      )}
    </header>
  )
}
