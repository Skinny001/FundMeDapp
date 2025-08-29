"use client"

import { useState } from "react"
import { getFundMeContract, parseXDC } from "@/lib/web3"
import { showTransactionToast } from "@/lib/enhanced-toast"
import { useAppKitWallet } from "@/hooks/useAppKitWallet"

interface CreateCampaignData {
  title: string
  description: string
  target: string
  deadline: string
}

export const useCreateCampaign = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { isConnected, chainId } = useAppKitWallet()

  const createCampaign = async (data: CreateCampaignData) => {
    try {
      if (!isConnected) {
        throw new Error("Please connect your wallet first")
      }

      // Replace 51 with the correct chainId for XDC Apothem if different
      if (chainId !== 51) {
        throw new Error("Please switch to XDC Apothem network")
      }

      setIsLoading(true)

      // Validate deadline is in the future
      const deadlineDate = new Date(data.deadline)
      const now = new Date()
      if (deadlineDate <= now) {
        throw new Error("Deadline must be in the future")
      }

      // Convert deadline to Unix timestamp
      const deadlineTimestamp = Math.floor(deadlineDate.getTime() / 1000)

      // Get contract instance
      const contract = await getFundMeContract()

      // Create campaign transaction
      const tx = await contract.createCampaign(data.title, data.description, parseXDC(data.target), deadlineTimestamp.toString())

      showTransactionToast({
        title: "Transaction Submitted",
        description: "Your campaign is being created. Please wait for confirmation.",
      })

      // Wait for transaction confirmation
      const receipt = await tx.wait()

      showTransactionToast({
        title: "Campaign Created Successfully!",
        description: "Your campaign is now live and accepting donations.",
        transactionHash: receipt.hash,
      })

      return { success: true, transactionHash: receipt.hash }
    } catch (error: any) {
      console.error("Error creating campaign:", error)

      let errorMessage = "Failed to create campaign. Please try again."

      if (error.message.includes("user rejected")) {
        errorMessage = "Transaction was cancelled by user."
      } else if (error.message.includes("insufficient funds")) {
        errorMessage = "Insufficient funds to create campaign."
      } else if (error.message.includes("Deadline must be in the future")) {
        errorMessage = error.message
      } else if (error.message.includes("Please connect your wallet")) {
        errorMessage = error.message
      } else if (error.message.includes("Please switch to XDC")) {
        errorMessage = error.message
      }

      showTransactionToast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })

      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    createCampaign,
    isLoading,
  }
}
