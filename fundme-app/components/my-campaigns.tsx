"use client"

import { useCampaigns } from "@/hooks/useCampaigns"
import { useWallet } from "@/hooks/useWallet"
import { CampaignCard } from "@/components/campaign-card"
import { WithdrawalButton } from "@/components/withdrawal-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Plus, User } from "lucide-react"
import Link from "next/link"

export function MyCampaigns() {
  const { address } = useWallet()
  const { campaigns, isLoading, error, refetch } = useCampaigns()

  const myCampaigns = campaigns.filter((campaign) => address && campaign.owner.toLowerCase() === address.toLowerCase())

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading your campaigns...</span>
        </div>
      </div>
    )
  }

  if (myCampaigns.length === 0) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <CardTitle>No Campaigns Yet</CardTitle>
          <CardDescription>
            You haven't created any campaigns yet. Start your first fundraising campaign!
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button asChild>
            <Link href="/create">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Campaign
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Campaigns</h2>
          <p className="text-muted-foreground">
            {myCampaigns.length} campaign{myCampaigns.length !== 1 ? "s" : ""} created
          </p>
        </div>
        <Button asChild>
          <Link href="/create">
            <Plus className="h-4 w-4 mr-2" />
            Create New
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {myCampaigns.map((campaign) => (
          <div key={campaign.id} className="space-y-4">
            <CampaignCard campaign={campaign} />
            <WithdrawalButton campaign={campaign} onWithdrawalSuccess={refetch} />
          </div>
        ))}
      </div>
    </div>
  )
}
