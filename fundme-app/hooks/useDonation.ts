"use client"

import { useAccount } from "wagmi"
import { getFundMeContract, parseXDC } from "@/lib/web3"
import { showTransactionToast } from "@/lib/enhanced-toast"
import { useState } from "react"

export const useDonation = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { isConnected, chainId } = useAccount()
  const isCorrectNetwork = !!chainId && Number(chainId) === 51

  const donateToCampaign = async (campaignId: number, amount: string) => {
    try {
      if (!isConnected) {
        throw new Error("Please connect your wallet first")
      }

      if (!isCorrectNetwork) {
        throw new Error("Please switch to XDC Apothem network")
      }

      setIsLoading(true)

      // Validate amount
      const amountNum = Number.parseFloat(amount)
      if (Number.isNaN(amountNum) || amountNum <= 0) {
        throw new Error("Please enter a valid donation amount")
      }

      if (amountNum < 0.001) {
        throw new Error("Minimum donation amount is 0.001 XDC")
      }

      // Get contract instance
      const contract = await getFundMeContract()

      // Create donation transaction
      const tx = await contract.donateToCampaign(campaignId, parseXDC(amount))

      showTransactionToast({
        title: "Transaction Submitted",
        description: "Your donation is being processed. Please wait for confirmation.",
      })

      // Wait for transaction confirmation
      const receipt = await tx.wait()

      showTransactionToast({
        title: "Donation Successful!",
        description: `Thank you for your ${amount} XDC donation!`,
        transactionHash: receipt.hash,
      })

      return { success: true, transactionHash: receipt.hash }
    } catch (error: any) {
      console.error("Error donating to campaign:", error)

      let errorMessage = "Failed to process donation. Please try again."

      if (error.message.includes("user rejected")) {
        errorMessage = "Transaction was cancelled by user."
      } else if (error.message.includes("insufficient funds")) {
        errorMessage = "Insufficient funds for this donation."
      } else if (error.message.includes("Please enter a valid donation amount")) {
        errorMessage = error.message
      } else if (error.message.includes("Minimum donation amount")) {
        errorMessage = error.message
      } else if (error.message.includes("Please connect your wallet")) {
        errorMessage = error.message
      } else if (error.message.includes("Please switch to XDC")) {
        errorMessage = error.message
      }

      showTransactionToast({
        title: "Donation Failed",
        description: errorMessage,
        variant: "destructive",
      })

      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    donateToCampaign,
    isLoading,
    isConnected,
    isCorrectNetwork,
  }
}
