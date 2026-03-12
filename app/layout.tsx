import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter, Roboto, Montserrat, Pacifico, Dancing_Script, Lobster, Oswald, Lato, Poppins, Playfair_Display } from 'next/font/google'

import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const roboto = Roboto({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-roboto' })
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' })
const pacifico = Pacifico({ weight: '400', subsets: ['latin'], variable: '--font-pacifico' })
const dancingScript = Dancing_Script({ subsets: ['latin'], variable: '--font-dancing-script' })
const lobster = Lobster({ weight: '400', subsets: ['latin'], variable: '--font-lobster' })
const oswald = Oswald({ subsets: ['latin'], variable: '--font-oswald' })
const lato = Lato({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-lato' })
const poppins = Poppins({ weight: ['400', '600', '700'], subsets: ['latin'], variable: '--font-poppins' })
const playfairDisplay = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: 'Photobooth Studio',
  description: 'Chup anh photobooth truc tuyen - Chon khung, chup anh va tai ve mien phi',
}

export const viewport: Viewport = {
  themeColor: '#1a1a2e',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" className={`dark ${inter.variable} ${roboto.variable} ${montserrat.variable} ${pacifico.variable} ${dancingScript.variable} ${lobster.variable} ${oswald.variable} ${lato.variable} ${poppins.variable} ${playfairDisplay.variable}`}>
      <body className="font-sans antialiased min-h-screen">{children}</body>
    </html>
  )
}
