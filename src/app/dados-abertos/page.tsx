import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'Dados Abertos — Observatório de Segurança Pública do Amazonas',
}

const DATASETS = [
  { nome: 'Indicadores de CVLI por Município — 2019–2025', formato: 'CSV / XLSX', frequencia: 'Anual', status: 'Em breve' },
  { nome: 'Registros de Violência Doméstica por Município', formato: 'CSV', frequencia: 'Trimestral', status: 'Em breve' },
  { nome: 'Taxa de Roubos por 100 mil habitantes — Amazonas', formato: 'CSV / JSON', frequencia: 'Trimestral', status: 'Em breve' },
  { nome: 'Municípios em Alerta — série histórica', formato: 'CSV', frequencia: 'Mensal', status: 'Em breve' },
  { nome: 'Feminicídios no Amazonas 2015–2025', formato: 'CSV / XLSX', frequencia: 'Anual', status: 'Em breve' },
  { nome: 'Dados de Unidades Prisionais — DEPEN/AM', formato: 'CSV', frequencia: 'Semestral', status: 'Em breve' },
]

export default function DadosAbertosPage() {
  return (
    <main>
      <Nav />
      <section className="bg-obs-navy px-4 md:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <p className="text-obs-gold text-xs font-bold tracking-widest uppercase mb-4">Open data</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">Dados Abertos</h1>
          <p className="text-white/60 text-sm max-w-xl">
            Bases de dados públicas sobre segurança pública no Amazonas disponíveis para download,
            reutilização e pesquisa, em conformidade com os princípios da Lei de Acesso à Informação.
          </p>
        </div>
      </section>
      <section className="bg-gradient-to-b from-obs-navy to-[#0F2A45] px-4 md:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-3">
            {DATASETS.map((d, i) => (
              <div key={i} className="border border-white/10 bg-white/5 p-4">
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <div className="flex-1">
                    <p className="text-white/85 text-sm font-medium mb-1">{d.nome}</p>
                    <div className="flex gap-3">
                      <span className="text-obs-gold/70 text-xs font-semibold">{d.formato}</span>
                      <span className="text-white/35 text-xs">Atualização: {d.frequencia}</span>
                    </div>
                  </div>
                  <span className="text-yellow-400 text-xs font-bold flex-shrink-0">{d.status}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 border border-obs-gold/20 bg-obs-gold/5 p-5">
            <p className="text-obs-gold text-xs font-bold tracking-widest uppercase mb-2">API pública</p>
            <p className="text-white/60 text-sm leading-relaxed">
              O Observatório está desenvolvendo uma API RESTful pública para acesso programático
              aos indicadores de segurança pública. Previsão de lançamento: 2º semestre de 2026.
            </p>
          </div>
        </div>
      </section>
      <section className="bg-obs-navy px-4 md:px-8 py-10 border-t border-white/10">
        <div className="max-w-4xl mx-auto flex flex-wrap gap-3">
          <Link href="/contato" className="bg-obs-gold text-obs-navy font-bold text-sm px-6 py-3 hover:bg-yellow-500 transition-colors">Solicitar dataset</Link>
          <Link href="/transparencia" className="border border-white/30 text-white font-semibold text-sm px-6 py-3 hover:border-white/60 transition-colors">Transparência</Link>
        </div>
      </section>
      <Footer />
    </main>
  )
}
