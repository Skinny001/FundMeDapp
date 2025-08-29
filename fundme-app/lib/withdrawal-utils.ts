import { ethers } from "ethers"

export const canWithdraw = (
  campaign: {
    owner: string
    target: string
    amountCollected: string
    deadline: string
  },
  userAddress: string | null,
) => {
  // Must be campaign owner
  if (!userAddress || campaign.owner.toLowerCase() !== userAddress.toLowerCase()) {
    return { canWithdraw: false, reason: "Only campaign owner can withdraw funds" }
  }

  // Must have collected funds
  const collectedAmount = Number.parseFloat(ethers.formatEther(campaign.amountCollected))
  if (collectedAmount === 0) {
    return { canWithdraw: false, reason: "No funds to withdraw" }
  }

  // Check if campaign ended or goal reached
  const targetAmount = Number.parseFloat(ethers.formatEther(campaign.target))
  const deadlineDate = new Date(Number.parseInt(campaign.deadline) * 1000)
  const now = new Date()

  const isExpired = now > deadlineDate
  const isGoalReached = collectedAmount >= targetAmount

  if (!isExpired && !isGoalReached) {
    return {
      canWithdraw: false,
      reason: "Campaign must end or reach its goal before withdrawal",
    }
  }

  return { canWithdraw: true, reason: "" }
}
