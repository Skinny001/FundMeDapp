"use client"

import { useAccount } from "wagmi"
import { getFundMeContract } from "@/lib/web3"
import { showTransactionToast } from "@/lib/enhanced-toast"
import { useState } from "react"

export const useWithdrawal = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { isConnected, chainId } = useAccount()
  const isCorrectNetwork = !!chainId && Number(chainId) === 51

  const withdrawFunds = async (campaignId: number) => {
    try {
      if (!isConnected) {
        throw new Error("Please connect your wallet first")
      }
      if (!isCorrectNetwork) {
        throw new Error("Please switch to XDC Apothem network")
      }
      setIsLoading(true)
      const contract = await getFundMeContract()
      const tx = await contract.withdraw(campaignId)
      showTransactionToast({
        title: "Withdrawal Submitted",
        description: "Your withdrawal request is being processed. Please wait for confirmation.",
      })
      const receipt = await tx.wait()
      showTransactionToast({
        title: "Withdrawal Successful!",
        description: "Funds have been successfully withdrawn to your wallet.",
        transactionHash: receipt.hash,
      })
      return { success: true, transactionHash: receipt.hash }
    } catch (error: any) {
      showTransactionToast({
        title: "Withdrawal Failed",
        description: error.message || "Failed to withdraw funds.",
        variant: "destructive",
      })
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    withdrawFunds,
    isLoading,
    isConnected,
    isCorrectNetwork,
  }
}
