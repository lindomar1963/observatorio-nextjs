/** Parceiros com Acordo de Cooperação Técnica formal */
const ACT: { nome: string; nomeCompleto: string; href: string }[] = [
  { nome: 'UEA',          nomeCompleto: 'Universidade do Estado do Amazonas',     href: 'https://www.uea.edu.br/' },
  { nome: 'SSP-AM',       nomeCompleto: 'Secretaria de Segurança Pública do AM',  href: 'https://www.ssp.am.gov.br/' },
  { nome: 'IBSP',         nomeCompleto: 'Instituto Brasileiro de Segurança Pública', href: 'https://ibsp.org.br/' },
  { nome: 'Boas Novas',   nomeCompleto: 'Faculdades Boas Novas',                  href: 'https://www.fbnovas.edu.br/' },
]

/** Demais parceiros institucionais */
const PARCEIROS: { nome: string; href: string }[] = [
  { nome: 'UFAM',                    href: 'https://www.ufam.edu.br/' },
  { nome: 'Ministério Público — AM', href: 'https://www.mpam.mp.br/' },
  { nome: 'Defensoria Pública — AM', href: 'https://www.defensoria.am.def.br/' },
  { nome: 'TJAM',                    href: 'https://www.tjam.jus.br/' },
  { nome: 'FBSP',                    href: 'https://forumseguranca.org.br/' },
  { nome: 'IBGE',                    href: 'https://www.ibge.gov.br/' },
  { nome: 'FGV',                     href: 'https://www.fgv.br/' },
  { nome: 'SENASP',                  href: 'https://www.gov.br/mj/pt-br/assuntos/sua-seguranca/seguranca-publica/senasp-1' },
  { nome: 'DETRAN-AM',               href: 'https://www.detran.am.gov.br/' },
  { nome: 'SEAP-AM',                 href: 'https://www.seap.am.gov.br/' },
]

export default function Parceiros() {
  return (
    <section className="px-4 md:px-8 py-10 bg-obs-panel border-t border-obs-border" aria-labelledby="parc-title">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <p className="text-obs-gold text-xs font-bold tracking-widest uppercase mb-1">Rede Institucional</p>
          <h2 id="parc-title" className="font-display text-xl font-bold text-white">
            Parceiros do Observatório
          </h2>
        </div>

        {/* Acordos de Cooperação Técnica */}
        <div className="mb-6">
          <p className="text-obs-cyan text-[10px] font-bold tracking-widest uppercase mb-3">
            Acordo de Cooperação Técnica
          </p>
          <ul className="flex flex-wrap gap-3" aria-label="Parceiros com Acordo de Cooperação Técnica">
            {ACT.map((p) => (
              <li key={p.nome}>
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={p.nomeCompleto}
                  className="block border border-obs-cyan/30 bg-obs-cyan/5 px-4 py-2 text-xs font-semibold text-obs-cyan/80 hover:border-obs-cyan hover:text-obs-cyan hover:bg-obs-cyan/10 transition-all rounded-sm"
                  aria-label={`Visitar site: ${p.nomeCompleto}`}
                >
                  {p.nome} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Parceiros institucionais */}
        <div>
          <p className="text-white/30 text-[10px] font-bold tracking-widest uppercase mb-3">
            Parceiros Institucionais
          </p>
          <ul className="flex flex-wrap gap-3" aria-label="Demais parceiros institucionais">
            {PARCEIROS.map((p) => (
              <li key={p.nome}>
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block neon-card px-4 py-2 text-xs font-semibold text-white/50 hover:border-obs-cyan/40 hover:text-obs-cyan transition-all rounded-sm"
                  aria-label={`Visitar site: ${p.nome}`}
                >
                  {p.nome} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </section>
  )
}
