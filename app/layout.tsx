import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Excel',
  description: 'An Excel clone built with React',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
