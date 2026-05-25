import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Link from 'next/link'
import fs from 'fs'
import path from 'path'

export const metadata = {
  title: 'Transparência — Observatório de Segurança Pública do Amazonas',
}

const PORTAL_ALEAM = 'https://www.aleam.am.leg.br'

interface ItemTransparencia {
  titulo: string
  tipo: string
  status: 'Disponível' | 'Em elaboração' | 'Portal ALEAM'
  /** Arquivo esperado em /public/docs — vira link automático quando o PDF existir */
  arquivo?: string
  /** Link externo direto (ex.: portal da ALEAM) */
  href?: string
}

const ITENS: ItemTransparencia[] = [
  // Institucional
  { titulo: 'Resolução de criação — ALEAM nº 003/2023', tipo: 'Documento legal', status: 'Disponível', arquivo: 'resolucao-criacao-003-2023.pdf' },
  { titulo: 'Relatório de atividades 2024', tipo: 'Relatório institucional', status: 'Disponível', arquivo: 'relatorio-atividades-2024.pdf' },
  { titulo: 'Relatório de atividades 2025', tipo: 'Relatório institucional', status: 'Em elaboração' },
  { titulo: 'Orçamento e execução financeira 2025', tipo: 'Financeiro', status: 'Portal ALEAM', href: PORTAL_ALEAM },
  { titulo: 'Contratos e convênios vigentes', tipo: 'Contratações', status: 'Portal ALEAM', href: PORTAL_ALEAM },
  { titulo: 'Plano de trabalho 2026', tipo: 'Planejamento', status: 'Em elaboração' },
  // Acordos de Cooperação Técnica
  { titulo: 'ACT — Universidade do Estado do Amazonas (UEA)', tipo: 'Acordo de Cooperação Técnica', status: 'Disponível', arquivo: 'act-uea.pdf' },
  { titulo: 'ACT — Secretaria de Segurança Pública do AM (SSP-AM)', tipo: 'Acordo de Cooperação Técnica', status: 'Disponível', arquivo: 'act-ssp-am.pdf' },
  { titulo: 'ACT — Instituto Brasileiro de Segurança Pública (IBSP)', tipo: 'Acordo de Cooperação Técnica', status: 'Disponível', arquivo: 'act-ibsp.pdf' },
  { titulo: 'ACT — Faculdades Boas Novas', tipo: 'Acordo de Cooperação Técnica', status: 'Disponível', arquivo: 'act-boas-novas.pdf' },
]

const statusColor: Record<string, string> = {
  'Disponível': 'text-green-400',
  'Em elaboração': 'text-yellow-400',
  'Portal ALEAM': 'text-blue-400',
}

/** Resolve o link de cada item: href externo, PDF existente em /docs, ou nenhum. */
function resolverLink(item: ItemTransparencia): { url: string; externo: boolean } | null {
  if (item.href) return { url: item.href, externo: true }
  if (item.arquivo) {
    const existe = fs.existsSync(path.join(process.cwd(), 'public', 'docs', item.arquivo))
    if (existe) return { url: `/docs/${item.arquivo}`, externo: false }
  }
  return null
}

export default function TransparenciaPage() {
  return (
    <main>
      <Nav />
      <section className="bg-obs-navy px-4 md:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <p className="text-obs-gold text-xs font-bold tracking-widest uppercase mb-4">Prestação de contas</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">Transparência</h1>
          <p className="text-white/60 text-sm max-w-xl">
            Documentos, relatórios institucionais, contratos e informações de acesso público
            do Observatório de Segurança Pública do Amazonas, em cumprimento à Lei nº 12.527/2011.
          </p>
        </div>
      </section>
      <section className="bg-obs-navy px-4 md:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-3">
            {ITENS.map((item, i) => {
              const link = resolverLink(item)
              const conteudo = (
                <>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${link ? 'text-white group-hover:text-obs-cyan transition-colors' : 'text-white/85'}`}>
                      {item.titulo}
                    </p>
                    <p className="text-white/35 text-xs">{item.tipo}</p>
                  </div>
                  <span className={`text-xs font-bold flex-shrink-0 inline-flex items-center gap-1 ${statusColor[item.status] || 'text-white/40'}`}>
                    {item.status}
                    {link && (
                      <span aria-hidden className="opacity-70">{link.externo ? '↗' : '↓'}</span>
                    )}
                  </span>
                </>
              )

              if (link) {
                return (
                  <a
                    key={i}
                    href={link.url}
                    target={link.externo ? '_blank' : undefined}
                    rel={link.externo ? 'noopener noreferrer' : undefined}
                    download={link.externo ? undefined : true}
                    className="group flex flex-col md:flex-row md:items-center gap-2 border border-obs-border bg-obs-card p-4 hover:border-obs-cyan/50 hover:bg-obs-card/70 transition-colors"
                  >
                    {conteudo}
                  </a>
                )
              }

              return (
                <div key={i} className="flex flex-col md:flex-row md:items-center gap-2 border border-obs-border bg-obs-card p-4 opacity-90">
                  {conteudo}
                </div>
              )
            })}
          </div>
          <p className="text-white/30 text-xs mt-8">
            Documentos marcados como &quot;Portal ALEAM&quot; estão disponíveis no portal oficial da Assembleia Legislativa do Estado do Amazonas.
            Itens &quot;Em elaboração&quot; serão publicados aqui assim que concluídos.
          </p>
        </div>
      </section>
      <section className="bg-obs-navy px-4 md:px-8 py-10 border-t border-white/10">
        <div className="max-w-4xl mx-auto flex flex-wrap gap-3">
          <a href={PORTAL_ALEAM} target="_blank" rel="noopener noreferrer" className="bg-obs-gold text-obs-navy font-bold text-sm px-6 py-3 hover:bg-yellow-500 transition-colors">Portal ALEAM →</a>
          <Link href="/contato" className="border border-white/30 text-white font-semibold text-sm px-6 py-3 hover:border-white/60 transition-colors">Solicitar informação</Link>
        </div>
      </section>
      <Footer />
    </main>
  )
}
