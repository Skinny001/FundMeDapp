"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { modal } from "@/context"
import { useAccount, useDisconnect } from "wagmi"

export function WalletConnect() {
  const { address, isConnected, chainId } = useAccount()
  const { disconnect } = useDisconnect()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const isCorrectNetwork = !!chainId && Number(chainId) === 51

  if (!isConnected) {
    return (
      <Button className="gap-2" onClick={() => modal.open()}>
        💳 Connect Wallet
      </Button>
    )
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        className="font-mono text-xs"
        onClick={() => setDropdownOpen((open) => !open)}
      >
        {address?.slice(0, 6)}...{address?.slice(-4)} ▼
      </Button>
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 border rounded shadow-lg z-50 p-4 flex flex-col gap-2">
          <div className="text-xs font-semibold mb-2">Wallet Info</div>
          <div className="text-xs">
            Network:{" "}
            {isCorrectNetwork
              ? "XDC Apothem"
              : chainId
              ? `Wrong Network (chainId: ${chainId})`
              : "Detecting network..."}
          </div>
          <div className="text-xs">Address: {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "-"}</div>
          {/* You can add balance here if you fetch it in useWallet */}
          <Button
            size="sm"
            variant="outline"
            className="mt-2"
            onClick={() => {
              disconnect()
              setDropdownOpen(false)
            }}
          >
            Disconnect
          </Button>
        </div>
      )}
    </div>
  )
}
