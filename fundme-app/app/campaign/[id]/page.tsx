"use client"

import { use } from "react"
import { useCampaignDetails } from "@/hooks/useCampaignDetails"
import { CampaignDetails } from "@/components/campaign-details"
import { DonationForm } from "@/components/donation-form"
import { DonationsList } from "@/components/donations-list"
import { WithdrawalButton } from "@/components/withdrawal-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface CampaignPageProps {
  params: { id: string }
}

export default function CampaignPage({ params }: CampaignPageProps) {
  const { id } = params
  const campaignId = Number.parseInt(id)
  const { campaign, donations, isLoading, error, refetch } = useCampaignDetails(campaignId)

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading campaign details...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error || !campaign) {
    return (
      <div className="container py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <CardTitle>Campaign Not Found</CardTitle>
            <CardDescription>{error || "The requested campaign could not be found."}</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Button onClick={refetch} variant="outline">
              Try Again
            </Button>
            <Button asChild>
              <Link href="/explore">Browse Campaigns</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Button variant="ghost" asChild className="gap-2">
          <Link href="/explore">
            <ArrowLeft className="h-4 w-4" />
            Back to Campaigns
          </Link>
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <CampaignDetails campaign={campaign} onRefresh={refetch} />
          <DonationsList donations={donations} isLoading={isLoading} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <WithdrawalButton campaign={campaign} onWithdrawalSuccess={refetch} />
          <DonationForm campaignId={campaignId} onDonationSuccess={refetch} />
        </div>
      </div>
    </div>
  )
}
