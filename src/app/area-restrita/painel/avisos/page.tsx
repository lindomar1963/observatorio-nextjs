'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { supabaseBrowser } from '@/lib/supabase-browser'

interface AvisoRow {
  id: number
  texto: string
  link: string | null
  data_expira: string | null
  ativo: boolean
  ordem: number
  created_at?: string
}

export default function AvisosPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [lista, setLista] = useState<AvisoRow[]>([])

  const [form, setForm] = useState({
    texto: '',
    link: '',
    data_expira: '',
    ordem: '0',
  })

  useEffect(() => {
    async function checkSession() {
      if (!supabaseBrowser) { router.replace('/area-restrita'); return }
      const { data: { session } } = await supabaseBrowser.auth.getSession()
      if (!session) { router.replace('/area-restrita'); return }
      setLoading(false)
      fetchLista()
    }
    checkSession()
  }, [router])

  async function fetchLista() {
    if (!supabaseBrowser) return
    const { data } = await supabaseBrowser
      .from('avisos_ticker')
      .select('*')
      .order('ordem', { ascending: true })
      .order('created_at', { ascending: false })
    setLista((data as AvisoRow[]) ?? [])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!supabaseBrowser) return
    setSubmitting(true)
    setMsg(null)

    const payload = {
      texto: form.texto.trim(),
      link: form.link.trim() || null,
      data_expira: form.data_expira || null,
      ordem: window.parseInt(form.ordem, 10) || 0,
      ativo: true,
    }

    const { error } = await supabaseBrowser.from('avisos_ticker').insert([payload])
    if (error) {
      setMsg({ type: 'error', text: `Erro: ${error.message}` })
    } else {
      setMsg({ type: 'success', text: 'Aviso publicado no ticker!' })
      setForm({ texto: '', link: '', data_expira: '', ordem: '0' })
      fetchLista()
    }
    setSubmitting(false)
  }

  async function toggleAtivo(item: AvisoRow) {
    if (!supabaseBrowser) return
    await supabaseBrowser.from('avisos_ticker').update({ ativo: !item.ativo }).eq('id', item.id)
    fetchLista()
  }

  async function remover(id: number) {
    if (!supabaseBrowser) return
    await supabaseBrowser.from('avisos_ticker').delete().eq('id', id)
    fetchLista()
  }

  const hoje = new Date().toISOString().split('T')[0]
  function estaVencido(item: AvisoRow): boolean {
    return item.data_expira != null && item.data_expira < hoje
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
        <div className="max-w-4xl mx-auto">
          <Link href="/area-restrita/painel" className="text-obs-gold text-xs font-bold tracking-widest uppercase hover:text-yellow-400 transition-colors">← Painel</Link>
          <h1 className="font-display text-2xl font-bold text-white mt-3">Avisos do Ticker</h1>
          <p className="text-white/40 text-xs mt-1">
            Mensagens exibidas na faixa azul de &quot;Atualização&quot; no topo do site. Avisos com data de
            expiração somem automaticamente após a data informada.
          </p>
        </div>
      </section>

      <section className="bg-obs-navy px-4 md:px-8 py-10">
        <div className="max-w-4xl mx-auto space-y-10">

          <div className="border border-obs-border bg-obs-card p-6">
            <h2 className="text-white font-semibold text-sm mb-6">Novo aviso</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-white/60 text-xs mb-1">Texto do aviso *</label>
                <input type="text" required value={form.texto} onChange={(e) => setForm({ ...form, texto: e.target.value })} className="w-full bg-white/5 border border-white/20 text-white text-sm px-3 py-2 focus:outline-none focus:border-obs-gold/60 placeholder:text-white/20" placeholder="Ex: Seminário: Violência e Território Amazônico · Auditório ALEAM" />
              </div>
              <div>
                <label className="block text-white/60 text-xs mb-1">Link (opcional)</label>
                <input type="url" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} className="w-full bg-white/5 border border-white/20 text-white text-sm px-3 py-2 focus:outline-none focus:border-obs-gold/60 placeholder:text-white/20" placeholder="https://..." />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/60 text-xs mb-1">Expira em (opcional)</label>
                  <input type="date" value={form.data_expira} onChange={(e) => setForm({ ...form, data_expira: e.target.value })} className="w-full bg-obs-navy border border-white/20 text-white text-sm px-3 py-2 focus:outline-none focus:border-obs-gold/60" />
                  <p className="text-white/25 text-[10px] mt-1">Deixe em branco para um aviso permanente.</p>
                </div>
                <div>
                  <label className="block text-white/60 text-xs mb-1">Ordem</label>
                  <input type="number" value={form.ordem} onChange={(e) => setForm({ ...form, ordem: e.target.value })} className="w-full bg-white/5 border border-white/20 text-white text-sm px-3 py-2 focus:outline-none focus:border-obs-gold/60" />
                  <p className="text-white/25 text-[10px] mt-1">Menor = aparece primeiro.</p>
                </div>
              </div>

              {msg && <div className={`text-xs px-3 py-2 border ${msg.type === 'success' ? 'border-green-500/30 bg-green-500/10 text-green-400' : 'border-red-500/30 bg-red-500/10 text-red-400'}`}>{msg.text}</div>}

              <button type="submit" disabled={submitting} className="border border-obs-gold/40 bg-obs-gold/10 text-obs-gold text-xs font-bold tracking-widest uppercase px-6 py-2.5 hover:bg-obs-gold/20 transition-colors disabled:opacity-50">{submitting ? 'Salvando...' : 'Publicar Aviso'}</button>
            </form>
          </div>

          <div>
            <h2 className="text-white/50 text-xs font-bold tracking-widest uppercase mb-4">Avisos cadastrados</h2>
            {lista.length === 0 ? <p className="text-white/30 text-xs">Nenhum aviso cadastrado. Os avisos padrão de fallback serão exibidos.</p> : (
              <div className="space-y-2">
                {lista.map((item) => {
                  const vencido = estaVencido(item)
                  return (
                    <div key={item.id} className={`border bg-obs-card px-4 py-3 ${vencido || !item.ativo ? 'border-white/10 opacity-50' : 'border-obs-border'}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-white/85 text-sm">{item.texto}</p>
                          <div className="flex flex-wrap gap-3 mt-1 text-[10px]">
                            <span className="text-white/30">ordem {item.ordem}</span>
                            {item.data_expira && (
                              <span className={vencido ? 'text-red-400' : 'text-white/40'}>
                                {vencido ? 'vencido em ' : 'expira em '}{new Date(item.data_expira + 'T00:00:00').toLocaleDateString('pt-BR')}
                              </span>
                            )}
                            {!item.data_expira && <span className="text-white/30">permanente</span>}
                            {item.link && <span className="text-obs-cyan/60">com link</span>}
                            {!item.ativo && <span className="text-yellow-400">inativo</span>}
                          </div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <button onClick={() => toggleAtivo(item)} className="text-[10px] font-bold tracking-wider uppercase border border-white/20 text-white/50 px-2 py-1 hover:border-white/40 hover:text-white/80 transition-colors">
                            {item.ativo ? 'Desativar' : 'Ativar'}
                          </button>
                          <button onClick={() => remover(item.id)} className="text-[10px] font-bold tracking-wider uppercase border border-red-500/30 text-red-400/70 px-2 py-1 hover:border-red-500/60 hover:text-red-400 transition-colors">
                            Excluir
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

        </div>
      </section>
      <Footer />
    </main>
  )
}
