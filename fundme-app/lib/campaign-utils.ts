import { ethers } from "ethers"

export const getCampaignStatus = (target: string, amountCollected: string, deadline: string) => {
  const targetAmount = Number.parseFloat(ethers.formatEther(target))
  const collectedAmount = Number.parseFloat(ethers.formatEther(amountCollected))
  const deadlineDate = new Date(Number.parseInt(deadline) * 1000)
  const now = new Date()

  const isExpired = now > deadlineDate
  const isGoalReached = collectedAmount >= targetAmount

  if (isGoalReached) {
    return { status: "goal-reached", label: "Goal Reached", color: "bg-green-500" }
  }

  if (isExpired) {
    return { status: "ended", label: "Ended", color: "bg-red-500" }
  }

  return { status: "active", label: "Active", color: "bg-blue-500" }
}

export const getProgressPercentage = (target: string, amountCollected: string) => {
  const targetAmount = Number.parseFloat(ethers.formatEther(target))
  const collectedAmount = Number.parseFloat(ethers.formatEther(amountCollected))

  if (targetAmount === 0) return 0
  return Math.min((collectedAmount / targetAmount) * 100, 100)
}

export const formatTimeRemaining = (deadline: string) => {
  const deadlineDate = new Date(Number.parseInt(deadline) * 1000)
  const now = new Date()
  const timeDiff = deadlineDate.getTime() - now.getTime()

  if (timeDiff <= 0) {
    return "Expired"
  }

  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} left`
  }

  if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} left`
  }

  return "Less than 1 hour left"
}
