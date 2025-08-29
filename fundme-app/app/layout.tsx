import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Header } from "@/components/layout/header"
import { Toaster } from "@/components/ui/toaster"
import { xdcApothem } from '@/config'
import ContextProvider from '@/context'

export const metadata: Metadata = {
  title: "FundMe - Decentralized Crowdfunding",
  description: "Create and support campaigns on the XDC blockchain",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <ContextProvider cookies={null}>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Toaster />
        </ContextProvider>
      </body>
    </html>
  )
}
