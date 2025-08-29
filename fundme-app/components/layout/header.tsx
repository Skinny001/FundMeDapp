"use client"

import Link from "next/link"
import { WalletConnect } from "@/components/wallet-connect"
import { NetworkStatus } from "@/components/network-status"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: "/", label: "Home", icon: "🏠" },
    { href: "/explore", label: "Explore", icon: "🔍" },
    { href: "/create", label: "Create Campaign", icon: "➕" },
    { href: "/my-campaigns", label: "My Campaigns", icon: "👤" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">❤️</span>
            <span className="text-xl font-bold">FundMe</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            {navItems.map((item) => (
              <Button key={item.href} variant="ghost" size="sm" asChild>
                <Link href={item.href} className="gap-2">
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              </Button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <NetworkStatus />
          <div className="flex flex-col items-end gap-1">
            <WalletConnect />
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                ☰
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <Button
                    key={item.href}
                    variant="ghost"
                    asChild
                    className="justify-start gap-3"
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href={item.href}>
                      <span>{item.icon}</span>
                      {item.label}
                    </Link>
                  </Button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
