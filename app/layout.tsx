import './globals.css' // <-- ЭТО ОБЯЗАТЕЛЬНО
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gigachad Casino',
  description: 'The most honest casino ever',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}