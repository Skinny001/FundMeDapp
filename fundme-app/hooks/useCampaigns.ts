"use client"

import { useState, useEffect } from "react"
import { getFundMeContract } from "@/lib/web3"
import type { Campaign } from "@/types/campaign"

export const useCampaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCampaigns = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const contract = await getFundMeContract()

      const campaignsData = await contract.getAllCampaigns()

      const [owners, titles, descriptions, targets, deadlines, amountsCollected] = campaignsData

      const formattedCampaigns: Campaign[] = owners.map((owner: string, index: number) => ({
        id: index,
        owner: owner,
        title: titles[index],
        description: descriptions[index],
        target: targets[index].toString(),
        deadline: deadlines[index].toString(),
        amountCollected: amountsCollected[index].toString(),
        image: "", // Real contract doesn't have image field
      }))

      setCampaigns(formattedCampaigns)
    } catch (err) {
      console.error("Error fetching campaigns:", err)
      setError("Failed to fetch campaigns. Please make sure you're connected to the XDC Apothem network.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCampaigns()
    // Listen for campaign updates
    if (typeof window !== "undefined") {
      const handler = () => fetchCampaigns()
      window.addEventListener("campaignsUpdated", handler)
      return () => window.removeEventListener("campaignsUpdated", handler)
    }
  }, [])

  return {
    campaigns,
    isLoading,
    error,
    refetch: fetchCampaigns,
  }
}
