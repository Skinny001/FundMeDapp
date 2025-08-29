"use client"

import { useAccount } from "wagmi"
import { Badge } from "@/components/ui/badge"

export function NetworkStatus() {
  const { isConnected, chainId } = useAccount()
  const isCorrectNetwork = !!chainId && Number(chainId) === 51

  if (!isConnected) {
    return (
      <Badge variant="secondary" className="gap-2 bg-muted text-muted-foreground">
        📶 Not Connected
      </Badge>
    )
  }

  if (!isCorrectNetwork) {
    return (
      <Badge variant="destructive" className="gap-2">
        ⚠️ Wrong Network
      </Badge>
    )
  }

  return (
    <Badge variant="secondary" className="gap-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
      ✅ XDC Apothem
    </Badge>
  )
}
