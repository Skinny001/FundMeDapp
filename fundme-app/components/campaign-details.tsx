"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Calendar, User, Target, Clock, RefreshCw } from "lucide-react"
import type { Campaign } from "@/types/campaign"
import { formatXDC } from "@/lib/web3"
import { getCampaignStatus, getProgressPercentage, formatTimeRemaining } from "@/lib/campaign-utils"

interface CampaignDetailsProps {
  campaign: Campaign
  onRefresh?: () => void
}

export function CampaignDetails({ campaign, onRefresh }: CampaignDetailsProps) {
  const { status, label, color } = getCampaignStatus(campaign.target, campaign.amountCollected, campaign.deadline)
  const progressPercentage = getProgressPercentage(campaign.target, campaign.amountCollected)
  const timeRemaining = formatTimeRemaining(campaign.deadline)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-2xl mb-2 text-balance">{campaign.title}</CardTitle>
            <CardDescription className="text-base text-pretty">{campaign.description}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className={`${color} text-white`}>
              {label}
            </Badge>
            {onRefresh && (
              <Button variant="outline" size="sm" onClick={onRefresh}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Progress Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Funding Progress</span>
            <span className="font-medium">{progressPercentage.toFixed(1)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
          <div className="flex items-center justify-between">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{formatXDC(campaign.amountCollected)}</p>
              <p className="text-sm text-muted-foreground">Raised</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{formatXDC(campaign.target)}</p>
              <p className="text-sm text-muted-foreground">Goal</p>
            </div>
          </div>
        </div>

        {/* Campaign Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">{timeRemaining}</p>
              <p className="text-sm text-muted-foreground">Time remaining</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-mono text-sm">
                {campaign.owner.slice(0, 10)}...{campaign.owner.slice(-8)}
              </p>
              <p className="text-sm text-muted-foreground">Campaign owner</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Target className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">{formatXDC(campaign.target)}</p>
              <p className="text-sm text-muted-foreground">Funding goal</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">{new Date(Number.parseInt(campaign.deadline) * 1000).toLocaleDateString()}</p>
              <p className="text-sm text-muted-foreground">End date</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
