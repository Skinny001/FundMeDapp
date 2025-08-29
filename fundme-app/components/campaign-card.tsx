"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import type { Campaign } from "@/types/campaign"
import { formatXDC } from "@/lib/web3"
import { getCampaignStatus, getProgressPercentage, formatTimeRemaining } from "@/lib/campaign-utils"

interface CampaignCardProps {
  campaign: Campaign
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const { status, label, color } = getCampaignStatus(campaign.target, campaign.amountCollected, campaign.deadline)
  const progressPercentage = getProgressPercentage(campaign.target, campaign.amountCollected)
  const timeRemaining = formatTimeRemaining(campaign.deadline)

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg line-clamp-2 text-balance">{campaign.title}</CardTitle>
          <Badge variant="secondary" className={`${color} text-white shrink-0`}>
            {label}
          </Badge>
        </div>
        <CardDescription className="line-clamp-3 text-pretty">{campaign.description}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4">
        {/* Progress Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{progressPercentage.toFixed(1)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{formatXDC(campaign.amountCollected)}</span>
            <span className="text-muted-foreground">of {formatXDC(campaign.target)}</span>
          </div>
        </div>

        {/* Campaign Details */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span>📅</span>
            <span>{timeRemaining}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span>👤</span>
            <span className="font-mono">
              {campaign.owner.slice(0, 6)}...{campaign.owner.slice(-4)}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-auto pt-4">
          <Button asChild className="w-full gap-2">
            <Link href={`/campaign/${campaign.id}`}>
              <span>❤️</span>
              View & Support
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
