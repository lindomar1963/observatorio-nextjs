import type { Config } from 'tailwindcss'
const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        /* ── Fundos ─────────────────────────────────────── */
        'obs-navy':    '#060A14',   // fundo profundo
        'obs-panel':   '#0C1322',   // painel elevado
        'obs-card':    '#121C30',   // card / glass
        'obs-border':  '#1E2B45',   // bordas sutis
        /* ── Acentos neon ───────────────────────────────── */
        'obs-cyan':    '#22D3EE',   // ciano elétrico — primário
        'obs-blue':    '#3B82F6',   // azul vibrante
        'obs-violet':  '#8B5CF6',   // violeta
        'obs-magenta': '#EC4899',   // magenta / energia
        'obs-lime':    '#A3E635',   // verde LIMÃO (único verde)
        'obs-gold':    '#FBBF24',   // dourado / marigold
        /* ── Texto ──────────────────────────────────────── */
        'obs-gray':    '#94A3B8',   // texto de suporte
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
    },
  },
  plugins: [],
}
export default config
