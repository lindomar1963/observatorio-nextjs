'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { supabaseBrowser } from '@/lib/supabase-browser'
import type { User } from '@supabase/supabase-js'

const MODULOS = [
  {
    titulo: 'Indicadores de Segurança',
    descricao: 'Acesso aos dados brutos de CVLI, roubos e violência doméstica por município.',
    icone: '📊',
    status: 'Em desenvolvimento',
  },
  {
    titulo: 'Relatórios Internos',
    descricao: 'Notas técnicas e relatórios preliminares antes da publicação pública.',
    icone: '📋',
    status: 'Em desenvolvimento',
  },
  {
    titulo: 'Gestão de Conteúdo',
    descricao: 'Publicação de notícias, relatórios e atualizações no portal.',
    icone: '✏️',
    status: 'Em desenvolvimento',
  },
  {
    titulo: 'Usuários e Acessos',
    descricao: 'Gerenciamento de usuários credenciados ao sistema.',
    icone: '👥',
    status: 'Em desenvolvimento',
  },
]

export default function PainelPage() {
  const router = useRouter()
  const [user, setUser]       = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkSession() {
      if (!supabaseBrowser) {
        router.replace('/area-restrita')
        return
      }
      const { data: { session } } = await supabaseBrowser.auth.getSession()
      if (!session) {
        router.replace('/area-restrita')
        return
      }
      setUser(session.user)
      setLoading(false)
    }
    checkSession()

    if (!supabaseBrowser) return
    const { data: { subscription } } = supabaseBrowser.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        router.replace('/area-restrita')
      }
    })
    return () => subscription.unsubscribe()
  }, [router])

  async function handleLogout() {
    if (!supabaseBrowser) return
    await supabaseBrowser.auth.signOut()
    router.replace('/area-restrita')
  }

  if (loading) {
    return (
      <main>
        <Nav />
        <section className="bg-obs-navy min-h-[80vh] flex items-center justify-center">
          <div className="text-center">
            <div className="text-obs-gold text-xs font-bold tracking-widest uppercase mb-4 animate-pulse">
              Verificando credenciais...
            </div>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  return (
    <main>
      <Nav />

      {/* Header do painel */}
      <section className="bg-obs-navy px-4 md:px-8 py-10 border-b border-white/10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-obs-gold text-xs font-bold tracking-widest uppercase mb-2">
              Área Restrita · Painel de Controle
            </p>
            <h1 className="font-display text-2xl font-bold text-white">
              Bem-vindo, {user?.email?.split('@')[0]}
            </h1>
            <p className="text-white/40 text-xs mt-1">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="border border-white/20 text-white/60 text-xs font-bold tracking-widest uppercase px-5 py-2.5 hover:border-red-500/50 hover:text-red-400 transition-colors self-start md:self-center"
          >
            Sair →
          </button>
        </div>
      </section>

      {/* Módulos */}
      <section className="bg-obs-navy px-4 md:px-8 py-12">
        <div className="max-w-5xl mx-auto">
          <p className="text-white/40 text-xs mb-6">
            Os módulos abaixo serão ativados progressivamente conforme o Observatório entra em operação plena.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {MODULOS.map((m) => (
              <div key={m.titulo} className="border border-obs-border bg-obs-card p-6">
                <div className="flex items-start gap-4">
                  <span className="text-2xl flex-shrink-0">{m.icone}</span>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-sm mb-1">{m.titulo}</h3>
                    <p className="text-white/50 text-xs leading-relaxed mb-3">{m.descricao}</p>
                    <span className="text-yellow-400 text-xs font-bold">{m.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Info de acesso */}
      <section className="bg-obs-navy px-4 md:px-8 py-10 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <div className="border border-obs-gold/20 bg-obs-gold/5 p-5">
            <p className="text-obs-gold text-xs font-bold tracking-widest uppercase mb-2">
              Observatório em implantação
            </p>
            <p className="text-white/60 text-sm leading-relaxed">
              O sistema está em fase de implantação. Para reportar problemas de acesso
              ou solicitar funcionalidades, entre em contato com a coordenação:
              <a href="mailto:coordenacao@observatoriodeseguranca.site" className="text-obs-gold ml-1 hover:text-yellow-400 transition-colors">
                coordenacao@observatoriodeseguranca.site
              </a>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}