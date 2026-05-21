import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Política de Privacidade — Observatório de Segurança Pública do Amazonas',
}

const SECOES = [
  {
    titulo: '1. Dados coletados',
    texto: 'Este portal coleta dados de navegação anonimizados (como páginas acessadas e tempo de sessão) para fins estatísticos, sem identificação pessoal dos visitantes. Não coletamos nome, e-mail ou qualquer dado pessoal sem o consentimento expresso do usuário.',
  },
  {
    titulo: '2. Finalidade do tratamento',
    texto: 'Os dados de navegação são utilizados exclusivamente para análise de uso do portal, melhoria de conteúdo e relatórios de acesso institucional. Não são comercializados, transferidos ou utilizados para fins de marketing.',
  },
  {
    titulo: '3. Cookies',
    texto: 'Utilizamos cookies técnicos essenciais para o funcionamento do portal. Não utilizamos cookies de rastreamento ou publicidade de terceiros.',
  },
  {
    titulo: '4. Compartilhamento',
    texto: 'Dados de navegação agregados podem ser compartilhados com a ALEAM para fins de prestação de contas institucional. Nenhum dado individual é compartilhado com terceiros.',
  },
  {
    titulo: '5. Seus direitos (LGPD)',
    texto: 'Conforme a Lei nº 13.709/2018 (LGPD), você tem direito de acesso, correção, exclusão e portabilidade de seus dados, além do direito de revogar consentimento. Para exercer esses direitos, entre em contato pelo e-mail institucional.',
  },
  {
    titulo: '6. Contato do Encarregado (DPO)',
    texto: 'O encarregado de proteção de dados do Observatório pode ser contactado por meio da assessoria jurídica da ALEAM: coordenacao@observatoriodeseguranca.site.',
  },
]

export default function PrivacidadePage() {
  return (
    <main>
      <Nav />
      <section className="bg-obs-navy px-4 md:px-8 py-16">
        <div className="max-w-3xl mx-auto">
          <p className="text-obs-gold text-xs font-bold tracking-widest uppercase mb-4">Proteção de dados</p>
          <h1 className="font-display text-3xl font-bold text-white mb-4">Política de Privacidade</h1>
          <p className="text-white/40 text-xs">Última atualização: maio de 2026 · Em conformidade com a Lei nº 13.709/2018 (LGPD)</p>
        </div>
      </section>
      <section className="bg-gradient-to-b from-obs-navy to-[#0F2A45] px-4 md:px-8 py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          {SECOES.map((s, i) => (
            <div key={i}>
              <h2 className="text-white font-semibold text-base mb-2">{s.titulo}</h2>
              <p className="text-white/60 text-sm leading-relaxed">{s.texto}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  )
}
