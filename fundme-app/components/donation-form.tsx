"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAccount } from "wagmi"

import { useWallet } from "@/hooks/useWallet"
import { useDonation } from "@/hooks/useDonation"
import { WalletConnect } from "@/components/wallet-connect"
import { Loader2, Heart, AlertCircle } from "lucide-react"

interface DonationFormProps {
  campaignId: number
  onDonationSuccess?: () => void
}

export function DonationForm({ campaignId, onDonationSuccess }: DonationFormProps) {
  const { isConnected, chainId } = useAccount()
  const { donateToCampaign, isLoading, isCorrectNetwork } = useDonation()
  const isNetworkOk = !!chainId && Number(chainId) === 51
  const [amount, setAmount] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!amount) {
      setError("Please enter a donation amount")
      return
    }

    const result = await donateToCampaign(campaignId, amount)

    if (result.success) {
      setAmount("")
      onDonationSuccess?.()
    }
  }

  const handleAmountChange = (value: string) => {
    setAmount(value)
    if (error) {
      setError("")
    }
  }

  const quickAmounts = ["0.1", "0.5", "1", "5", "10"]

  if (!isConnected) {
    return (
      <Card>
        <CardHeader className="text-center">
          <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <CardTitle className="text-lg">Connect Wallet to Donate</CardTitle>
          <CardDescription>Please connect your wallet to support this campaign</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <WalletConnect />
        </CardContent>
      </Card>
    )
  }

  if (!isNetworkOk) {
    return (
      <Card>
        <CardHeader className="text-center">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
          <CardTitle className="text-lg">Wrong Network</CardTitle>
          <CardDescription>Please switch to the XDC Apothem network to donate</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <WalletConnect />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          Support This Campaign
        </CardTitle>
        <CardDescription>Enter the amount you'd like to donate in XDC</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Donation Amount (XDC)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              className={error ? "border-destructive" : ""}
              min="0.001"
              step="0.001"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          {/* Quick Amount Buttons */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Quick amounts:</Label>
            <div className="flex flex-wrap gap-2">
              {quickAmounts.map((quickAmount) => (
                <Button
                  key={quickAmount}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleAmountChange(quickAmount)}
                  className="text-xs"
                >
                  {quickAmount} XDC
                </Button>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading || !amount}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing Donation...
              </>
            ) : (
              <>
                <Heart className="h-4 w-4 mr-2" />
                Donate {amount ? `${amount} XDC` : ""}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
