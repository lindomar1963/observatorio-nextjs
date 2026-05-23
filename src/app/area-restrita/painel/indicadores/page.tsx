'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { supabaseBrowser } from '@/lib/supabase-browser'

interface IndicadorRow {
  id: number
  data: string
  fonte: string
  cvli_12m: number | null
  cvli_variacao: number | null
  roubos_ano: number | null
  roubos_variacao: number | null
  violencia_domestica_ano: number | null
  violencia_domestica_variacao: number | null
  municipios_monitorados: number | null
  municipios_com_plano: number | null
  municipios_em_alerta: number | null
  atualizado_em: string | null
}

const today = new Date().toISOString().split('T')[0]

export default function IndicadoresPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [historico, setHistorico] = useState<IndicadorRow[]>([])

  const [form, setForm] = useState({
    data: today,
    fonte: 'SSP-AM / SINESP',
    cvli_12m: '',
    cvli_variacao: '',
    roubos_ano: '',
    roubos_variacao: '',
    violencia_domestica_ano: '',
    violencia_domestica_variacao: '',
    municipios_monitorados: '62',
    municipios_com_plano: '',
    municipios_em_alerta: '',
  })

  useEffect(() => {
    async function checkSession() {
      if (!supabaseBrowser) { router.replace('/area-restrita'); return }
      const { data: { session } } = await supabaseBrowser.auth.getSession()
      if (!session) { router.replace('/area-restrita'); return }
      setLoading(false)
      fetchHistorico()
    }
    checkSession()
  }, [router])

  async function fetchHistorico() {
    if (!supabaseBrowser) return
    const { data } = await supabaseBrowser
      .from('indicadores_diarios')
      .select('*')
      .order('data', { ascending: false })
      .limit(5)
    setHistorico((data as IndicadorRow[]) ?? [])
  }

  function parseNum(val: string): number | null {
    if (val === '' || val === null || val === undefined) return null
    const n = parseFloat(val)
    return isNaN(n) ? null : n
  }

  function parseIntVal(val: string): number | null {
    if (val === '' || val === null || val === undefined) return null
    const n = window.parseInt(val, 10)
    return isNaN(n) ? null : n
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!supabaseBrowser) return
    setSubmitting(true)
    setMsg(null)

    const payload = {
      data: form.data,
      fonte: form.fonte,
      cvli_12m: parseIntVal(form.cvli_12m),
      cvli_variacao: parseNum(form.cvli_variacao),
      roubos_ano: parseIntVal(form.roubos_ano),
      roubos_variacao: parseNum(form.roubos_variacao),
      violencia_domestica_ano: parseIntVal(form.violencia_domestica_ano),
      violencia_domestica_variacao: parseNum(form.violencia_domestica_variacao),
      municipios_monitorados: parseIntVal(form.municipios_monitorados),
      municipios_com_plano: parseIntVal(form.municipios_com_plano),
      municipios_em_alerta: parseIntVal(form.municipios_em_alerta),
      atualizado_em: new Date().toISOString(),
    }

    const { error } = await supabaseBrowser.from('indicadores_diarios').insert([payload])
    if (error) {
      setMsg({ type: 'error', text: `Erro: ${error.message}` })
    } else {
      setMsg({ type: 'success', text: 'Indicadores inseridos com sucesso!' })
      setForm({
        data: today, fonte: 'SSP-AM / SINESP', cvli_12m: '', cvli_variacao: '',
        roubos_ano: '', roubos_variacao: '', violencia_domestica_ano: '', violencia_domestica_variacao: '',
        municipios_monitorados: '62', municipios_com_plano: '', municipios_em_alerta: '',
      })
      fetchHistorico()
    }
    setSubmitting(false)
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
          <h1 className="font-display text-2xl font-bold text-white mt-3">Indicadores de Segurança</h1>
          <p className="text-white/40 text-xs mt-1">Inserção de novos dados na tabela indicadores_diarios.</p>
        </div>
      </section>

      <section className="bg-gradient-to-b from-obs-navy to-[#0F2A45] px-4 md:px-8 py-10">
        <div className="max-w-4xl mx-auto space-y-10">

          <div className="border border-white/10 bg-white/5 p-6">
            <h2 className="text-white font-semibold text-sm mb-6">Novo registro de indicadores</h2>
            <form onSubmit={handleSubmit} className="space-y-6">

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/60 text-xs mb-1">Data *</label>
                  <input type="date" required value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} className="w-full bg-obs-navy border border-white/20 text-white text-sm px-3 py-2 focus:outline-none focus:border-obs-gold/60" />
                </div>
                <div>
                  <label className="block text-white/60 text-xs mb-1">Fonte</label>
                  <input type="text" value={form.fonte} onChange={(e) => setForm({ ...form, fonte: e.target.value })} className="w-full bg-white/5 border border-white/20 text-white text-sm px-3 py-2 focus:outline-none focus:border-obs-gold/60" />
                </div>
              </div>

              <div>
                <p className="text-obs-gold text-xs font-bold tracking-widest uppercase mb-3">CVLI</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/60 text-xs mb-1">CVLI (12 meses)</label>
                    <input type="number" value={form.cvli_12m} onChange={(e) => setForm({ ...form, cvli_12m: e.target.value })} className="w-full bg-white/5 border border-white/20 text-white text-sm px-3 py-2 focus:outline-none focus:border-obs-gold/60 placeholder:text-white/20" placeholder="Ex: 1847" />
                  </div>
                  <div>
                    <label className="block text-white/60 text-xs mb-1">Variação CVLI (%)</label>
                    <input type="number" step="0.1" value={form.cvli_variacao} onChange={(e) => setForm({ ...form, cvli_variacao: e.target.value })} className="w-full bg-white/5 border border-white/20 text-white text-sm px-3 py-2 focus:outline-none focus:border-obs-gold/60 placeholder:text-white/20" placeholder="Ex: -5.2" />
                  </div>
                </div>
              </div>

              <div>
                <p className="text-obs-gold text-xs font-bold tracking-widest uppercase mb-3">Roubos</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/60 text-xs mb-1">Roubos no ano</label>
                    <input type="number" value={form.roubos_ano} onChange={(e) => setForm({ ...form, roubos_ano: e.target.value })} className="w-full bg-white/5 border border-white/20 text-white text-sm px-3 py-2 focus:outline-none focus:border-obs-gold/60 placeholder:text-white/20" placeholder="Ex: 17243" />
                  </div>
                  <div>
                    <label className="block text-white/60 text-xs mb-1">Variação Roubos (%)</label>
                    <input type="number" step="0.1" value={form.roubos_variacao} onChange={(e) => setForm({ ...form, roubos_variacao: e.target.value })} className="w-full bg-white/5 border border-white/20 text-white text-sm px-3 py-2 focus:outline-none focus:border-obs-gold/60 placeholder:text-white/20" placeholder="Ex: 2.1" />
                  </div>
                </div>
              </div>

              <div>
                <p className="text-obs-gold text-xs font-bold tracking-widest uppercase mb-3">Violência Doméstica</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/60 text-xs mb-1">Ocorrências no ano</label>
                    <input type="number" value={form.violencia_domestica_ano} onChange={(e) => setForm({ ...form, violencia_domestica_ano: e.target.value })} className="w-full bg-white/5 border border-white/20 text-white text-sm px-3 py-2 focus:outline-none focus:border-obs-gold/60 placeholder:text-white/20" placeholder="Ex: 3892" />
                  </div>
                  <div>
                    <label className="block text-white/60 text-xs mb-1">Variação (%)</label>
                    <input type="number" step="0.1" value={form.violencia_domestica_variacao} onChange={(e) => setForm({ ...form, violencia_domestica_variacao: e.target.value })} className="w-full bg-white/5 border border-white/20 text-white text-sm px-3 py-2 focus:outline-none focus:border-obs-gold/60 placeholder:text-white/20" placeholder="Ex: -8.4" />
                  </div>
                </div>
              </div>

              <div>
                <p className="text-obs-gold text-xs font-bold tracking-widest uppercase mb-3">Municípios</p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-white/60 text-xs mb-1">Monitorados</label>
                    <input type="number" value={form.municipios_monitorados} onChange={(e) => setForm({ ...form, municipios_monitorados: e.target.value })} className="w-full bg-white/5 border border-white/20 text-white text-sm px-3 py-2 focus:outline-none focus:border-obs-gold/60" />
                  </div>
                  <div>
                    <label className="block text-white/60 text-xs mb-1">Com plano</label>
                    <input type="number" value={form.municipios_com_plano} onChange={(e) => setForm({ ...form, municipios_com_plano: e.target.value })} className="w-full bg-white/5 border border-white/20 text-white text-sm px-3 py-2 focus:outline-none focus:border-obs-gold/60 placeholder:text-white/20" placeholder="Ex: 38" />
                  </div>
                  <div>
                    <label className="block text-white/60 text-xs mb-1">Em alerta</label>
                    <input type="number" value={form.municipios_em_alerta} onChange={(e) => setForm({ ...form, municipios_em_alerta: e.target.value })} className="w-full bg-white/5 border border-white/20 text-white text-sm px-3 py-2 focus:outline-none focus:border-obs-gold/60 placeholder:text-white/20" placeholder="Ex: 14" />
                  </div>
                </div>
              </div>

              {msg && <div className={`text-xs px-3 py-2 border ${msg.type === 'success' ? 'border-green-500/30 bg-green-500/10 text-green-400' : 'border-red-500/30 bg-red-500/10 text-red-400'}`}>{msg.text}</div>}

              <button type="submit" disabled={submitting} className="border border-obs-gold/40 bg-obs-gold/10 text-obs-gold text-xs font-bold tracking-widest uppercase px-6 py-2.5 hover:bg-obs-gold/20 transition-colors disabled:opacity-50">{submitting ? 'Salvando...' : 'Salvar Indicadores'}</button>
            </form>
          </div>

          <div>
            <h2 className="text-white/50 text-xs font-bold tracking-widest uppercase mb-4">Últimas atualizações</h2>
            {historico.length === 0 ? <p className="text-white/30 text-xs">Nenhum registro encontrado.</p> : (
              <div className="space-y-2">
                {historico.map((item) => (
                  <div key={item.id} className="border border-white/10 bg-white/5 px-4 py-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-obs-gold text-xs font-bold">{new Date(item.data).toLocaleDateString('pt-BR')}</span>
                      <span className="text-white/30 text-xs">{item.fonte}</span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs text-white/60">
                      {item.cvli_12m != null && (
                        <span>CVLI 12m: <span className="text-white">{item.cvli_12m}</span>
                          {item.cvli_variacao != null && <span className={item.cvli_variacao < 0 ? ' text-green-400' : ' text-red-400'}> ({item.cvli_variacao > 0 ? '+' : ''}{item.cvli_variacao}%)</span>}
                        </span>
                      )}
                      {item.roubos_ano != null && <span>Roubos: <span className="text-white">{item.roubos_ano.toLocaleString('pt-BR')}</span></span>}
                      {item.violencia_domestica_ano != null && <span>VD: <span className="text-white">{item.violencia_domestica_ano.toLocaleString('pt-BR')}</span></span>}
                      {item.municipios_monitorados != null && <span>Municípios: <span className="text-white">{item.municipios_monitorados}</span></span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </section>
      <Footer />
    </main>
  )
}