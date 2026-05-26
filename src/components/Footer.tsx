import Link from 'next/link'

interface FooterLink {
  href: string
  label: string
  external?: boolean
}

interface FooterCol {
  title: string
  links: FooterLink[]
}

export default function Footer() {
  const cols: FooterCol[] = [
    {
      title: 'O Observatório',
      links: [
        { href: '/observatorio', label: 'Sobre' },
        { href: '/observatorio', label: 'Missão e valores' },
        { href: 'https://sapl.al.am.leg.br/norma/13917?display', label: 'Resolução ALEAM', external: true },
      ],
    },
    {
      title: 'Observatórios',
      links: [
        { href: '/mapa',                           label: 'Segurança Pública' },
        { href: '/observatorio-da-mulher',         label: 'Da Mulher' },
        { href: '/observatorio-da-crianca',        label: 'Da Criança' },
        { href: '/observatorio-do-idoso',          label: 'Do Idoso' },
        { href: '/observatorio-roubos-furtos',     label: 'Roubos e Furtos' },
        { href: '/observatorio-crimes-ambientais', label: 'Crimes Ambientais' },
        { href: '/observatorio-acidentes-transito',label: 'Acidentes de Trânsito' },
        { href: '/observatorio-crimes-digitais',   label: 'Crimes Digitais' },
        { href: '/observatorio-violencia-juvenil', label: 'Violência Juvenil' },
      ],
    },
    {
      title: 'Conteúdo',
      links: [
        { href: '/paineis', label: 'Painéis e mapas' },
        { href: '/relatorios', label: 'Relatórios' },
        { href: '/noticias', label: 'Notícias' },
        { href: '/municipios', label: 'Municípios' },
      ],
    },
    {
      title: 'Institucional',
      links: [
        { href: '/transparencia', label: 'Transparência' },
        { href: '/dados-abertos', label: 'Dados abertos' },
        { href: '/contato', label: 'Contato' },
        { href: '/imprensa', label: 'Imprensa' },
      ],
    },
  ]

  return (
    <footer role="contentinfo" className="bg-obs-navy border-t border-obs-border">
      <div className="px-4 md:px-8 py-10 grid md:grid-cols-3 lg:grid-cols-5 gap-8">
        {/* Marca */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2.5 mb-4">
            <div
              aria-hidden="true"
              style={{
                width: 24, height: 28,
                background: 'linear-gradient(135deg, #22D3EE 0%, #8B5CF6 100%)',
                clipPath: 'polygon(50% 0%,100% 15%,100% 60%,50% 100%,0% 60%,0% 15%)',
                flexShrink: 0,
                filter: 'drop-shadow(0 0 6px rgba(34,211,238,0.6))',
              }}
            />
            <div className="text-white text-xs font-semibold leading-tight">
              OBSERVATÓRIO<br />
              <span className="text-obs-cyan">SEGURANÇA PÚBLICA · AM</span>
            </div>
          </div>
          <p className="text-white/35 text-xs leading-relaxed">
            Vinculado à Comissão de Segurança Pública, Acesso à Justiça e
            Defesa Social da Assembleia Legislativa do Estado do Amazonas.
          </p>
        </div>

        {/* Links */}
        {cols.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h3 className="text-obs-cyan text-[10px] font-bold tracking-widest uppercase mb-4">
              {col.title}
            </h3>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l.label}>
                  {l.external ? (
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/35 text-xs hover:text-obs-cyan transition-colors"
                    >
                      {l.label}
                    </a>
                  ) : (
                    <Link
                      href={l.href}
                      className="text-white/35 text-xs hover:text-obs-cyan transition-colors"
                    >
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      {/* Rodapé inferior */}
      <div className="border-t border-obs-border px-4 md:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-2">
        <p className="text-white/20 text-xs">
          © {new Date().getFullYear()} Observatório de Segurança Pública do Amazonas — ALEAM · Manaus, AM
        </p>
        <nav aria-label="Links legais" className="flex gap-4">
          {[
            { href: '/privacidade', label: 'Política de Privacidade' },
            { href: '/termos', label: 'Termos de Uso' },
            { href: '/lgpd', label: 'LGPD' },
          ].map((l) => (
            <Link key={l.href} href={l.href} className="text-white/20 text-xs hover:text-white/50 transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
