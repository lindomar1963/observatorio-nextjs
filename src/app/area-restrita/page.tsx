'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { supabaseBrowser } from '@/lib/supabase-browser'

export default function AreaRestritaPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [senha, setSenha]       = useState('')
  const [erro, setErro]         = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setErro('')

    if (!supabaseBrowser) {
      setErro('Sistema de autenticação não configurado. Contate o administrador.')
      return
    }

    setLoading(true)
    const { error } = await supabaseBrowser.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: senha,
    })
    setLoading(false)

    if (error) {
      if (error.message.includes('Invalid login')) {
        setErro('E-mail ou senha incorretos. Verifique os dados e tente novamente.')
      } else if (error.message.includes('Email not confirmed')) {
        setErro('E-mail ainda não confirmado. Verifique sua caixa de entrada.')
      } else {
        setErro('Erro ao autenticar. Tente novamente em alguns instantes.')
      }
      return
    }

    router.push('/area-restrita/painel')
  }

  return (
    <main>
      <Nav />
      <section className="bg-obs-navy min-h-[80vh] px-4 md:px-8 py-16 flex items-center">
        <div className="max-w-md mx-auto w-full">
          <p className="text-obs-gold text-xs font-bold tracking-widest uppercase mb-4">Acesso restrito</p>
          <h1 className="font-display text-3xl font-bold text-white mb-4">Área Restrita</h1>
          <p className="text-white/55 text-sm mb-8">
            Acesso exclusivo para a equipe técnica, parlamentares credenciados e parceiros
            institucionais do Observatório.
          </p>

          <form onSubmit={handleLogin} noValidate>
            <div className="border border-white/10 bg-white/5 p-6 mb-6 space-y-5">
              <div>
                <label htmlFor="email" className="text-white/50 text-xs font-bold tracking-widest uppercase block mb-2">
                  E-mail institucional
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full border border-white/20 bg-white/5 px-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-obs-gold/60 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="senha" className="text-white/50 text-xs font-bold tracking-widest uppercase block mb-2">
                  Senha
                </label>
                <input
                  id="senha"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-white/20 bg-white/5 px-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-obs-gold/60 transition-colors"
                />
              </div>

              {erro && (
                <div className="bg-red-500/15 border border-red-500/30 p-3 text-red-400 text-xs leading-relaxed">
                  {erro}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !email || !senha}
                className="w-full bg-obs-gold text-obs-navy font-bold text-sm py-3 hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Autenticando...' : 'Entrar'}
              </button>
            </div>
          </form>

          <div className="flex flex-wrap gap-3">
            <a href="/" className="border border-white/20 text-white/60 font-semibold text-sm px-5 py-2.5 hover:border-white/40 transition-colors text-xs">
              ← Voltar ao início
            </a>
            <a href="/contato" className="border border-white/20 text-white/60 font-semibold text-sm px-5 py-2.5 hover:border-white/40 transition-colors text-xs">
              Solicitar acesso
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}