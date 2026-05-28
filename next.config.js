/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['observatoriodeseguranca.com'],
  },
  async headers() {
    // Permite que apenas o próprio site e o portal da ALEAM exibam o site em <iframe>.
    // Substitui o antigo X-Frame-Options: DENY (que bloqueava qualquer incorporação e
    // não permite liberar domínios específicos nos navegadores modernos).
    const frameAncestors =
      "frame-ancestors 'self' https://aleam.gov.br https://www.aleam.gov.br https://*.aleam.gov.br"
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: frameAncestors },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
        ],
      },
    ]
  },
}
module.exports = nextConfig
