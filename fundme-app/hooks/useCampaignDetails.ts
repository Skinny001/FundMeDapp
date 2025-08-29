"use client"

import { useState, useEffect } from "react"
import { getFundMeContract } from "@/lib/web3"
import type { Campaign, Donation } from "@/types/campaign"

export const useCampaignDetails = (campaignId: number) => {
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [donations, setDonations] = useState<Donation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCampaignDetails = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const contract = await getFundMeContract()

      // Fetch campaign details
      const campaignData = await contract.getCampaign(campaignId)

      const formattedCampaign: Campaign = {
        id: campaignId,
        owner: campaignData.owner,
        title: campaignData.title,
        description: campaignData.description,
        target: campaignData.target.toString(),
        deadline: campaignData.deadline.toString(),
        amountCollected: campaignData.amountCollected.toString(),
        image: campaignData.image || "",
      }

      setCampaign(formattedCampaign)

      // Fetch donators
      const [donators, amounts] = await contract.getDonators(campaignId)

      const formattedDonations: Donation[] = donators.map((donor: string, index: number) => ({
        donor,
        amount: amounts[index].toString(),
      }))

      setDonations(formattedDonations)
    } catch (err) {
      console.error("Error fetching campaign details:", err)
      setError("Failed to fetch campaign details. Please make sure you're connected to the XDC Apothem network.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (campaignId >= 0) {
      fetchCampaignDetails()
    }
  }, [campaignId])

  return {
    campaign,
    donations,
    isLoading,
    error,
    refetch: fetchCampaignDetails,
  }
}
