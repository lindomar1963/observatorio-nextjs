import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import Ticker from '@/components/Ticker'
import StatsGrid from '@/components/StatsGrid'
import DashboardPreview from '@/components/DashboardPreview'
import RelatoriosRecentes from '@/components/RelatoriosRecentes'
import Parceiros from '@/components/Parceiros'
import Footer from '@/components/Footer'

import { getDadosDiarios } from '@/lib/queries'

export const revalidate = 3600

export default async function HomePage() {
  const dados = await getDadosDiarios()
  return (
    <main id="main-content">
      <a href="#main-content" className="skip-link">Ir para o conteúdo principal</a>
      <Nav />
      <Ticker atualizado_em={dados.indicadores.atualizado_em} />
      <Hero indicadores={dados.indicadores} />
      <StatsGrid indicadores={dados.indicadores} />
      <DashboardPreview />
      <RelatoriosRecentes relatorios={dados.relatorios} />
      <Parceiros />
      <Footer />
    </main>
  )
}
