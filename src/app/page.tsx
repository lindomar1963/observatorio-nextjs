import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import Ticker from '@/components/Ticker'
import StatsGrid from '@/components/StatsGrid'
import DashboardPreview from '@/components/DashboardPreview'
import RelatoriosRecentes from '@/components/RelatoriosRecentes'
import Parceiros from '@/components/Parceiros'
import Footer from '@/components/Footer'

export const revalidate = 86400 // ISR: revalida a cada 24h

export default function HomePage() {
  return (
    <main id="main-content">
      <a href="#main-content" className="skip-link">Ir para o conteúdo principal</a>
      <Nav />
      <Ticker />
      <Hero />
      <StatsGrid />
      <DashboardPreview />
      <RelatoriosRecentes />
      <Parceiros />
      <Footer />
    </main>
  )
}
