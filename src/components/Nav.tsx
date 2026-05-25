'use client'
import { useState } from 'react'
import Link from 'next/link'

const OBSERVATORIOS = [
  { href: '/mapa',                            label: 'Segurança Pública' },
  { href: '/observatorio-da-mulher',          label: 'Da Mulher' },
  { href: '/observatorio-da-crianca',         label: 'Da Criança' },
  { href: '/observatorio-do-idoso',           label: 'Do Idoso' },
  { href: '/observatorio-roubos-furtos',      label: 'Roubos e Furtos' },
  { href: '/observatorio-acidentes-transito', label: 'Acidentes de Trânsito' },
  { href: '/observatorio-violencia-juvenil',  label: 'Violência Juvenil' },
  { href: '/observatorio-crimes-digitais',    label: 'Crimes Digitais' },
  { href: '/observatorio-crimes-ambientais',  label: 'Crimes Ambientais' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)

  const linkCls =
    'text-white/60 hover:text-obs-gold text-xs font-semibold tracking-widest transition-colors duration-200 uppercase'

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
              <div className="bg-obs-navy border border-white/10 min-w-[230px] shadow-2xl">
                {OBSERVATORIOS.map((o) => (
                  <Link
                    key={o.href}
                    href={o.href}
                    className="block px-4 py-3 text-white/70 hover:text-obs-gold hover:bg-white/5 text-xs font-semibold border-b border-white/5 last:border-0 transition-colors"
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

          <p className="px-6 pt-4 pb-1 text-obs-gold text-[10px] font-bold tracking-widest uppercase">Observatórios</p>
          {OBSERVATORIOS.map((o) => (
            <Link
              key={o.href}
              href={o.href}
              className="block text-white/60 hover:text-obs-gold px-8 py-2.5 text-sm font-semibold border-b border-white/5"
              onClick={() => setOpen(false)}
            >
              {o.label}
            </Link>
          ))}

          <Link
            href="/area-restrita"
            className="block bg-obs-gold text-obs-navy text-center py-3 text-sm font-bold mt-2"
            onClick={() => setOpen(false)}
          >
            ÁREA RESTRITA
          </Link>
        </div>
      )}
    </header>
  )
}
