"use client"

import { useCampaigns } from "@/hooks/useCampaigns"
import { CampaignCard } from "@/components/campaign-card"
import { CampaignCardSkeleton } from "@/components/campaign-card-skeleton"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export function CampaignsGrid() {
  const { campaigns, isLoading, error, refetch } = useCampaigns()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-48 bg-muted animate-pulse rounded mb-2" />
            <div className="h-5 w-32 bg-muted animate-pulse rounded" />
          </div>
          <div className="h-9 w-20 bg-muted animate-pulse rounded" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <CampaignCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <CardTitle>Error Loading Campaigns</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button onClick={refetch} variant="outline" className="gap-2 bg-transparent">
            🔄 Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (campaigns.length === 0) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="text-4xl mb-4">➕</div>
          <CardTitle>No Campaigns Yet</CardTitle>
          <CardDescription>Be the first to create a campaign and start raising funds for your project!</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button asChild>
            <Link href="/create">Create First Campaign</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">All Campaigns</h2>
          <p className="text-muted-foreground">
            {campaigns.length} campaign{campaigns.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <Button onClick={refetch} variant="outline" size="sm" className="gap-2 bg-transparent">
          🔄 Refresh
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </div>
    </div>
  )
}
