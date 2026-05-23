'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { supabaseBrowser } from '@/lib/supabase-browser'

type CategoriaNoticia = 'Nota técnica' | 'Evento' | 'Publicação' | 'Parceria' | 'Capacitação'
type CategoriaRelatorio = 'Segurança Pública' | 'Acesso à Justiça' | 'Defesa Social' | 'Violência Doméstica' | 'Municípios'

interface NoticiaRow {
  id: number
  titulo: string
  resumo: string
  categoria: CategoriaNoticia
  data_publicacao: string | null
  destaque: boolean
  publicado: boolean
}

interface RelatorioRow {
  id: number
  titulo: string
  categoria: CategoriaRelatorio
  publicado_em: string | null
  paginas: number | null
  arquivo_url: string | null
}

const CATEGORIAS_NOTICIA: CategoriaNoticia[] = ['Nota técnica', 'Evento', 'Publicação', 'Parceria', 'Capacitação']
const CATEGORIAS_RELATORIO: CategoriaRelatorio[] = ['Segurança Pública', 'Acesso à Justiça', 'Defesa Social', 'Violência Doméstica', 'Municípios']

export default function ConteudoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'noticias' | 'relatorios'>('noticias')

  const [noticias, setNoticias] = useState<NoticiaRow[]>([])
  const [noticiaForm, setNoticiaForm] = useState({
    titulo: '', resumo: '', categoria: 'Publicação' as CategoriaNoticia, data_publicacao: '', destaque: false,
  })
  const [noticiaMsg, setNoticiaMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [noticiaLoading, setNoticiaLoading] = useState(false)

  const [relatorios, setRelatorios] = useState<RelatorioRow[]>([])
  const [relatorioForm, setRelatorioForm] = useState({
    titulo: '', categoria: 'Segurança Pública' as CategoriaRelatorio, publicado_em: '', paginas: '', arquivo_url: '',
  })
  const [relatorioMsg, setRelatorioMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [relatorioLoading, setRelatorioLoading] = useState(false)

  useEffect(() => {
    async function checkSession() {
      if (!supabaseBrowser) { router.replace('/area-restrita'); return }
      const { data: { session } } = await supabaseBrowser.auth.getSession()
      if (!session) { router.replace('/area-restrita'); return }
      setLoading(false)
      fetchNoticias()
      fetchRelatorios()
    }
    checkSession()
  }, [router])

  async function fetchNoticias() {
    if (!supabaseBrowser) return
    const { data } = await supabaseBrowser.from('noticias').select('*').order('data_publicacao', { ascending: false })
    setNoticias((data as NoticiaRow[]) ?? [])
  }

  async function fetchRelatorios() {
    if (!supabaseBrowser) return
    const { data } = await supabaseBrowser.from('relatorios').select('*').order('publicado_em', { ascending: false })
    setRelatorios((data as RelatorioRow[]) ?? [])
  }

  async function handleNoticiaSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!supabaseBrowser) return
    setNoticiaLoading(true)
    setNoticiaMsg(null)
    const { error } = await supabaseBrowser.from('noticias').insert([{
      titulo: noticiaForm.titulo, resumo: noticiaForm.resumo, categoria: noticiaForm.categoria,
      data_publicacao: noticiaForm.data_publicacao || null, destaque: noticiaForm.destaque, publicado: true,
    }])
    if (error) {
      setNoticiaMsg({ type: 'error', text: `Erro: ${error.message}` })
    } else {
      setNoticiaMsg({ type: 'success', text: 'Notícia publicada com sucesso!' })
      setNoticiaForm({ titulo: '', resumo: '', categoria: 'Publicação', data_publicacao: '', destaque: false })
      fetchNoticias()
    }
    setNoticiaLoading(false)
  }

  async function handleNoticiaDelete(id: number) {
    if (!supabaseBrowser) return
    if (!confirm('Excluir esta notícia?')) return
    await supabaseBrowser.from('noticias').delete().eq('id', id)
    fetchNoticias()
  }

  async function handleRelatorioSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!supabaseBrowser) return
    setRelatorioLoading(true)
    setRelatorioMsg(null)
    const { error } = await supabaseBrowser.from('relatorios').insert([{
      titulo: relatorioForm.titulo, categoria: relatorioForm.categoria,
      publicado_em: relatorioForm.publicado_em || null,
      paginas: relatorioForm.paginas ? parseInt(relatorioForm.paginas) : null,
      arquivo_url: relatorioForm.arquivo_url || null,
    }])
    if (error) {
      setRelatorioMsg({ type: 'error', text: `Erro: ${error.message}` })
    } else {
      setRelatorioMsg({ type: 'success', text: 'Relatório inserido com sucesso!' })
      setRelatorioForm({ titulo: '', categoria: 'Segurança Pública', publicado_em: '', paginas: '', arquivo_url: '' })
      fetchRelatorios()
    }
    setRelatorioLoading(false)
  }

  async function handleRelatorioDelete(id: number) {
    if (!supabaseBrowser) return
    if (!confirm('Excluir este relatório?')) return
    await supabaseBrowser.from('relatorios').delete().eq('id', id)
    fetchRelatorios()
  }

  if (loading) return (
    <main><Nav />
      <section className="bg-obs-navy min-h-[80vh] flex items-center justify-center">
        <div className="text-obs-gold text-xs font-bold tracking-widest uppercase animate-pulse">Verificando credenciais...</div>
      </section>
      <Footer />
    </main>
  )

  return (
    <main>
      <Nav />
      <section className="bg-obs-navy px-4 md:px-8 py-10 border-b border-white/10">
        <div className="max-w-5xl mx-auto">
          <Link href="/area-restrita/painel" className="text-obs-gold text-xs font-bold tracking-widest uppercase hover:text-yellow-400 transition-colors">← Painel</Link>
          <h1 className="font-display text-2xl font-bold text-white mt-3">Gestão de Conteúdo</h1>
          <p className="text-white/40 text-xs mt-1">Publicação de notícias e relatórios no portal.</p>
        </div>
      </section>

      <section className="bg-obs-navy px-4 md:px-8 border-b border-white/10">
        <div className="max-w-5xl mx-auto flex">
          <button onClick={() => setActiveTab('noticias')} className={`px-6 py-3 text-xs font-bold tracking-widest uppercase transition-colors border-b-2 ${activeTab === 'noticias' ? 'border-obs-gold text-obs-gold' : 'border-transparent text-white/40 hover:text-white/70'}`}>Notícias</button>
          <button onClick={() => setActiveTab('relatorios')} className={`px-6 py-3 text-xs font-bold tracking-widest uppercase transition-colors border-b-2 ${activeTab === 'relatorios' ? 'border-obs-gold text-obs-gold' : 'border-transparent text-white/40 hover:text-white/70'}`}>Relatórios</button>
        </div>
      </section>

      <section className="bg-gradient-to-b from-obs-navy to-[#0F2A45] px-4 md:px-8 py-10 min-h-[60vh]">
        <div className="max-w-5xl mx-auto">

          {activeTab === 'noticias' && (
            <div className="space-y-8">
              <div className="border border-white/10 bg-white/5 p-6">
                <h2 className="text-white font-semibold text-sm mb-5">Nova Notícia</h2>
                <form onSubmit={handleNoticiaSubmit} className="space-y-4">
                  <div>
                    <label className="block text-white/60 text-xs mb-1">Título *</label>
                    <input type="text" required value={noticiaForm.titulo} onChange={(e) => setNoticiaForm({ ...noticiaForm, titulo: e.target.value })} className="w-full bg-white/5 border border-white/20 text-white text-sm px-3 py-2 focus:outline-none focus:border-obs-gold/60 placeholder:text-white/20" placeholder="Título da notícia" />
                  </div>
                  <div>
                    <label className="block text-white/60 text-xs mb-1">Resumo *</label>
                    <textarea required rows={3} value={noticiaForm.resumo} onChange={(e) => setNoticiaForm({ ...noticiaForm, resumo: e.target.value })} className="w-full bg-white/5 border border-white/20 text-white text-sm px-3 py-2 focus:outline-none focus:border-obs-gold/60 placeholder:text-white/20 resize-none" placeholder="Resumo da notícia" />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-white/60 text-xs mb-1">Categoria</label>
                      <select value={noticiaForm.categoria} onChange={(e) => setNoticiaForm({ ...noticiaForm, categoria: e.target.value as CategoriaNoticia })} className="w-full bg-obs-navy border border-white/20 text-white text-sm px-3 py-2 focus:outline-none focus:border-obs-gold/60">
                        {CATEGORIAS_NOTICIA.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-white/60 text-xs mb-1">Data</label>
                      <input type="date" value={noticiaForm.data_publicacao} onChange={(e) => setNoticiaForm({ ...noticiaForm, data_publicacao: e.target.value })} className="w-full bg-obs-navy border border-white/20 text-white text-sm px-3 py-2 focus:outline-none focus:border-obs-gold/60" />
                    </div>
                    <div className="flex items-end pb-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={noticiaForm.destaque} onChange={(e) => setNoticiaForm({ ...noticiaForm, destaque: e.target.checked })} className="accent-obs-gold w-4 h-4" />
                        <span className="text-white/60 text-xs">Destaque ★</span>
                      </label>
                    </div>
                  </div>
                  {noticiaMsg && <div className={`text-xs px-3 py-2 border ${noticiaMsg.type === 'success' ? 'border-green-500/30 bg-green-500/10 text-green-400' : 'border-red-500/30 bg-red-500/10 text-red-400'}`}>{noticiaMsg.text}</div>}
                  <button type="submit" disabled={noticiaLoading} className="border border-obs-gold/40 bg-obs-gold/10 text-obs-gold text-xs font-bold tracking-widest uppercase px-6 py-2.5 hover:bg-obs-gold/20 transition-colors disabled:opacity-50">{noticiaLoading ? 'Publicando...' : 'Publicar Notícia'}</button>
                </form>
              </div>
              <div>
                <h2 className="text-white/50 text-xs font-bold tracking-widest uppercase mb-4">Notícias cadastradas ({noticias.length})</h2>
                {noticias.length === 0 ? <p className="text-white/30 text-xs">Nenhuma notícia cadastrada.</p> : (
                  <div className="space-y-2">
                    {noticias.map((n) => (
                      <div key={n.id} className="border border-white/10 bg-white/5 px-4 py-3 flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-white/70 text-xs font-bold border border-white/20 px-1.5 py-0.5">{n.categoria}</span>
                            {n.data_publicacao && <span className="text-white/30 text-xs">{new Date(n.data_publicacao).toLocaleDateString('pt-BR')}</span>}
                            {n.destaque && <span className="text-obs-gold text-xs">★</span>}
                          </div>
                          <p className="text-white text-sm truncate">{n.titulo}</p>
                        </div>
                        <button onClick={() => handleNoticiaDelete(n.id)} className="flex-shrink-0 text-xs text-red-400/60 hover:text-red-400 border border-red-500/20 hover:border-red-500/40 px-3 py-1.5 transition-colors">Excluir</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'relatorios' && (
            <div className="space-y-8">
              <div className="border border-white/10 bg-white/5 p-6">
                <h2 className="text-white font-semibold text-sm mb-5">Novo Relatório</h2>
                <form onSubmit={handleRelatorioSubmit} className="space-y-4">
                  <div>
                    <label className="block text-white/60 text-xs mb-1">Título *</label>
                    <input type="text" required value={relatorioForm.titulo} onChange={(e) => setRelatorioForm({ ...relatorioForm, titulo: e.target.value })} className="w-full bg-white/5 border border-white/20 text-white text-sm px-3 py-2 focus:outline-none focus:border-obs-gold/60 placeholder:text-white/20" placeholder="Título do relatório" />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-white/60 text-xs mb-1">Categoria</label>
                      <select value={relatorioForm.categoria} onChange={(e) => setRelatorioForm({ ...relatorioForm, categoria: e.target.value as CategoriaRelatorio })} className="w-full bg-obs-navy border border-white/20 text-white text-sm px-3 py-2 focus:outline-none focus:border-obs-gold/60">
                        {CATEGORIAS_RELATORIO.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-white/60 text-xs mb-1">Data</label>
                      <input type="date" value={relatorioForm.publicado_em} onChange={(e) => setRelatorioForm({ ...relatorioForm, publicado_em: e.target.value })} className="w-full bg-obs-navy border border-white/20 text-white text-sm px-3 py-2 focus:outline-none focus:border-obs-gold/60" />
                    </div>
                    <div>
                      <label className="block text-white/60 text-xs mb-1">Páginas</label>
                      <input type="number" min="1" value={relatorioForm.paginas} onChange={(e) => setRelatorioForm({ ...relatorioForm, paginas: e.target.value })} className="w-full bg-white/5 border border-white/20 text-white text-sm px-3 py-2 focus:outline-none focus:border-obs-gold/60 placeholder:text-white/20" placeholder="Ex: 84" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-white/60 text-xs mb-1">URL do arquivo (PDF)</label>
                    <input type="url" value={relatorioForm.arquivo_url} onChange={(e) => setRelatorioForm({ ...relatorioForm, arquivo_url: e.target.value })} className="w-full bg-white/5 border border-white/20 text-white text-sm px-3 py-2 focus:outline-none focus:border-obs-gold/60 placeholder:text-white/20" placeholder="https://..." />
                  </div>
                  {relatorioMsg && <div className={`text-xs px-3 py-2 border ${relatorioMsg.type === 'success' ? 'border-green-500/30 bg-green-500/10 text-green-400' : 'border-red-500/30 bg-red-500/10 text-red-400'}`}>{relatorioMsg.text}</div>}
                  <button type="submit" disabled={relatorioLoading} className="border border-obs-gold/40 bg-obs-gold/10 text-obs-gold text-xs font-bold tracking-widest uppercase px-6 py-2.5 hover:bg-obs-gold/20 transition-colors disabled:opacity-50">{relatorioLoading ? 'Inserindo...' : 'Inserir Relatório'}</button>
                </form>
              </div>
              <div>
                <h2 className="text-white/50 text-xs font-bold tracking-widest uppercase mb-4">Relatórios cadastrados ({relatorios.length})</h2>
                {relatorios.length === 0 ? <p className="text-white/30 text-xs">Nenhum relatório cadastrado.</p> : (
                  <div className="space-y-2">
                    {relatorios.map((r) => (
                      <div key={r.id} className="border border-white/10 bg-white/5 px-4 py-3 flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-white/70 text-xs font-bold border border-white/20 px-1.5 py-0.5">{r.categoria}</span>
                            {r.publicado_em && <span className="text-white/30 text-xs">{new Date(r.publicado_em).toLocaleDateString('pt-BR')}</span>}
                            {r.paginas && <span className="text-white/30 text-xs">{r.paginas} págs.</span>}
                            {r.arquivo_url && <a href={r.arquivo_url} target="_blank" rel="noopener noreferrer" className="text-obs-gold text-xs hover:text-yellow-400 transition-colors">PDF ↗</a>}
                          </div>
                          <p className="text-white text-sm truncate">{r.titulo}</p>
                        </div>
                        <button onClick={() => handleRelatorioDelete(r.id)} className="flex-shrink-0 text-xs text-red-400/60 hover:text-red-400 border border-red-500/20 hover:border-red-500/40 px-3 py-1.5 transition-colors">Excluir</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </section>
      <Footer />
    </main>
  )
}