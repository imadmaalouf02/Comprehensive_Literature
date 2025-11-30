import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Literature Review Generator",
  description: "Generate comprehensive research landscapes powered by AI",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon.jpg",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon.jpg",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/iconphd.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/icon.jpg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
