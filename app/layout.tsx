import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gigachad Casino',
  description: 'The most rigged casino in the world',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}