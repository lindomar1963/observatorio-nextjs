import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { getRelatorios } from '@/lib/queries'
import type { Relatorio } from '@/lib/types'

export const revalidate = 3600

export const metadata = {
  title: 'Relatórios — Observatório de Segurança Pública do Amazonas',
  description: 'Relatórios técnicos, diagnósticos e estudos sobre segurança pública no Amazonas.',
}

const CATEGORIAS = [
  { nome: 'Segurança Pública', cor: 'bg-obs-gold/20 text-obs-gold border-obs-gold/30' },
  { nome: 'Acesso à Justiça', cor: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { nome: 'Defesa Social', cor: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  { nome: 'Violência Doméstica', cor: 'bg-red-500/20 text-red-400 border-red-500/30' },
  { nome: 'Municipios', cor: 'bg-green-500/20 text-green-400 border-green-500/30' },
]

function catColor(cat: string) {
  const found = CATEGORIAS.find((c) => c.nome === cat)
  return found?.cor ?? 'bg-white/10 text-white/60 border-white/20'
}

export default async function RelatoriosPage() {
  const relatorios = await getRelatorios(20)

  return (
    <main>
      <Nav />

      <section className="bg-obs-navy px-4 md:px-8 py-16">
        <div className="max-w-5xl mx-auto">
          <p className="text-obs-gold text-xs font-bold tracking-widest uppercase mb-4">Produção técnica</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">Relatórios</h1>
          <p className="text-white/60 text-sm max-w-xl">
            Relatórios técnicos, diagnósticos, notas de pesquisa e estudos temáticos produzidos pelo
            Observatório de Segurança Pública do Amazonas.
          </p>
        </div>
      </section>

      <section className="bg-gradient-to-b from-obs-navy to-[#0F2A45] px-4 md:px-8 py-4">
        <div className="max-w-5xl mx-auto flex flex-wrap gap-2">
          <span className="text-white/40 text-xs font-semibold tracking-wider uppercase self-center mr-2">Filtrar por:</span>
          {CATEGORIAS.map((c) => (
            <span key={c.nome} className={`text-xs font-bold px-3 py-1 border ${c.cor} cursor-default`}>
              {c.nome}
            </span>
          ))}
        </div>
      </section>

      <section className="bg-[#0F2A45] px-4 md:px-8 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="space-y-4">
            {relatorios.map((r: Relatorio) => (
              <div key={r.id} className="border border-white/10 bg-white/5 p-5 hover:border-obs-gold/30 transition-colors">
                <div className="flex flex-wrap items-start gap-3 mb-3">
                  <span className={`text-xs font-bold px-2 py-0.5 border ${catColor(r.categoria)}`}>
                    {r.categoria}
                  </span>
                  <span className="text-white/30 text-xs">{r.publicado_em ? new Date(r.publicado_em).toLocaleDateString('pt-BR') : '—'}</span>
                  {r.paginas && <span className="text-white/30 text-xs">{r.paginas} páginas</span>}
                  {r.acessos && <span className="text-white/30 text-xs">{r.acessos.toLocaleString('pt-BR')} acessos</span>}
                </div>
                <h3 className="text-white font-semibold text-base leading-snug mb-3">{r.titulo}</h3>
                <div className="flex gap-3">
                  {r.arquivo_url ? (
                    <a
                      href={r.arquivo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-obs-gold text-obs-navy text-xs font-bold px-4 py-2 hover:bg-yellow-500 transition-colors"
                    >
                      Acessar →
                    </a>
                  ) : (
                    <span className="border border-white/20 text-white/40 text-xs font-bold px-4 py-2 cursor-default">
                      Em breve
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-obs-navy px-4 md:px-8 py-12 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-xl font-bold text-white mb-4">Séries e publicações periódicas</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { titulo: 'Relatório Anual de Segurança Pública', descricao: 'Publicado anualmente com o panorama geral da segurança pública no estado.' },
              { titulo: 'Boletim Trimestral de Indicadores', descricao: 'Atualização trimestral dos principais indicadores de criminalidade por região.' },
              { titulo: 'Nota Técnica Temática', descricao: 'Publicações pontuais sobre temas específicos, como feminicídio, tráfico ou crimes no interior.' },
            ].map((s) => (
              <div key={s.titulo} className="border border-white/10 p-5">
                <h3 className="text-obs-gold text-xs font-bold tracking-wider uppercase mb-2">{s.titulo}</h3>
                <p className="text-white/55 text-xs leading-relaxed">{s.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
