"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Donation } from "@/types/campaign"
import { formatXDC } from "@/lib/web3"

interface DonationsListProps {
  donations: Donation[]
  isLoading?: boolean
}

export function DonationsList({ donations, isLoading }: DonationsListProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>👥</span>
            Supporters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg animate-pulse">
                <div className="h-4 bg-muted rounded w-32" />
                <div className="h-4 bg-muted rounded w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>👥</span>
          Supporters ({donations.length})
        </CardTitle>
        <CardDescription>
          {donations.length > 0 ? "Thank you to all our amazing supporters!" : "Be the first to support this campaign!"}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {donations.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">❤️</div>
            <p className="text-muted-foreground">No donations yet</p>
            <p className="text-sm text-muted-foreground">Be the first to support this campaign!</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {donations.map((donation, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span>❤️</span>
                  </div>
                  <span className="font-mono text-sm">
                    {donation.donor.slice(0, 6)}...{donation.donor.slice(-4)}
                  </span>
                </div>
                <Badge variant="secondary" className="font-mono">
                  {formatXDC(donation.amount)}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
