import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from "@/components/ui/toaster" 

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
      <body>
        {children}
        <Toaster />
        </body>
    </html>
  )
}
