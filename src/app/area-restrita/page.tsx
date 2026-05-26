'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { supabaseBrowser } from '@/lib/supabase-browser'

export default function AreaRestritaPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [senha, setSenha]       = useState('')
  const [erro, setErro]         = useState('')
  const [carregando, setCarregando] = useState(true)
  const [entrando, setEntrando] = useState(false)

  // Se já estiver autenticado, redireciona direto ao painel
  useEffect(() => {
    if (!supabaseBrowser) {
      setCarregando(false)
      return
    }
    supabaseBrowser.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace('/area-restrita/painel')
      } else {
        setCarregando(false)
      }
    })
  }, [router])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!supabaseBrowser) {
      setErro('Configuração de autenticação indisponível. Verifique as variáveis de ambiente.')
      return
    }
    setEntrando(true)
    setErro('')
    const { error } = await supabaseBrowser.auth.signInWithPassword({ email, password: senha })
    if (error) {
      setErro('E-mail ou senha incorretos.')
      setEntrando(false)
    } else {
      router.replace('/area-restrita/painel')
    }
  }

  if (carregando) {
    return (
      <main>
        <Nav />
        <section className="bg-obs-navy min-h-[80vh] flex items-center justify-center">
          <div className="text-obs-gold text-xs font-bold tracking-widest uppercase animate-pulse">
            Verificando credenciais...
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  return (
    <main>
      <Nav />

      <section className="bg-obs-navy min-h-[80vh] px-4 py-16 flex items-center justify-center">
        <div className="w-full max-w-sm">
          <p className="text-obs-gold text-[10px] font-bold tracking-widest uppercase mb-2 text-center">
            Observatório de Segurança Pública · ALEAM
          </p>
          <h1 className="font-display text-2xl font-bold text-white text-center mb-8">
            Área Restrita
          </h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-white/50 text-xs font-bold tracking-wider uppercase mb-1.5">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full bg-obs-panel border border-obs-border text-white text-sm px-4 py-3 focus:outline-none focus:border-obs-cyan/60 placeholder-white/20"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="block text-white/50 text-xs font-bold tracking-wider uppercase mb-1.5">
                Senha
              </label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full bg-obs-panel border border-obs-border text-white text-sm px-4 py-3 focus:outline-none focus:border-obs-cyan/60 placeholder-white/20"
                placeholder="••••••••"
              />
            </div>

            {erro && (
              <p className="text-red-400 text-xs border border-red-500/30 bg-red-500/10 px-3 py-2">
                {erro}
              </p>
            )}

            <button
              type="submit"
              disabled={entrando}
              className="w-full bg-obs-gold text-obs-navy text-xs font-bold tracking-widest uppercase py-3 hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {entrando ? 'Entrando...' : 'Entrar →'}
            </button>
          </form>

          <p className="text-white/25 text-[10px] text-center mt-8">
            Acesso restrito a usuários credenciados pelo Observatório.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  )
}
