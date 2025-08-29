"use client"

import { useState, useEffect } from "react"
import { useAccount, usePublicClient } from "wagmi"

export const useAppKitWallet = () => {
  const { address, isConnected, chainId } = useAccount()
  const publicClient = usePublicClient()
  const [balance, setBalance] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchBalance = async () => {
      if (!address || !publicClient) {
        setBalance(null)
        return
      }
      setIsLoading(true)
      try {
        const bal = await publicClient.getBalance({ address })
        setBalance((Number(bal) / 1e18).toFixed(4))
      } catch (e) {
        setBalance(null)
      } finally {
        setIsLoading(false)
      }
    }
    fetchBalance()
  }, [address, publicClient])

  return {
    address,
    balance,
    isConnected,
    chainId,
    isLoading,
  }
}
