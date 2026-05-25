import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: 'Observatório de Segurança Pública do Amazonas — ALEAM',
  description: 'Centro de análise, monitoramento e proposição de políticas públicas de segurança pública do Amazonas. Vinculado à Comissão de Segurança Pública da ALEAM.',
  keywords: 'segurança pública, Amazonas, ALEAM, observatório, criminalidade, políticas públicas',
  authors: [{ name: 'Observatório de Segurança Pública do Amazonas — ALEAM' }],
  openGraph: {
    title: 'Observatório de Segurança Pública do Amazonas',
    description: 'Inteligência e dados para a segurança pública do Amazonas.',
    url: 'https://observatoriodeseguranca.com',
    siteName: 'Observatório de Segurança Pública — ALEAM',
    locale: 'pt_BR',
    type: 'website',
  },
  robots: { index: true, follow: true },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#060A14',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable}`}>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
