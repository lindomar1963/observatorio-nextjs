import { Rajdhani, Exo_2, Share_Tech_Mono } from 'next/font/google'

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-rajdhani',
  display: 'swap',
})

const exo2 = Exo_2({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  variable: '--font-exo2',
  display: 'swap',
})

const shareTechMono = Share_Tech_Mono({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-stm',
  display: 'swap',
})

export default function SeminarioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${rajdhani.variable} ${exo2.variable} ${shareTechMono.variable}`}>
      {children}
    </div>
  )
}
