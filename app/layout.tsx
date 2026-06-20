import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'AgentHub — Copiloto financeiro preditivo para PMEs',
  description:
    'Veja o futuro do caixa da sua empresa antes que ele aconteça. Projeção de 90 dias, alerta antecipado de risco e simulação da Reforma Tributária.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0B1210',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${fraunces.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
