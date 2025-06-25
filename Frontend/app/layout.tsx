import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Auth Service',
  description: 'Created with Nilesh Gorade',
  generator: 'Nilesh Gorade',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
