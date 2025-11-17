import type { Metadata } from "next"
import { Inter } from "next/font/google"

import { QueryProvider } from "@/components/providers/QueryProvider"
import { Auth0ProviderWithConfig } from "@/components/providers/Auth0ProviderWithConfig"

import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Aphilia · Workspace",
  description: "Aphilia-inspired dark SaaS workspace demo",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Auth0ProviderWithConfig>
          <QueryProvider>
            {children}
          </QueryProvider>
        </Auth0ProviderWithConfig>
      </body>
    </html>
  )
}
