import type React from "react"
import { Inter } from "next/font/google"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import AuthProvider from "@/components/providers/session-provider"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata = {
  title: "Behavioral Economics Association at Berkeley",
  description: "Shaping the future of business, one decision at a time",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        <AuthProvider>
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}

import "./globals.css"



import './globals.css'