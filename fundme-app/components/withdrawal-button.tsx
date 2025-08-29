"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useWallet } from "@/hooks/useWallet"
import { useWithdrawal } from "@/hooks/useWithdrawal"
import { canWithdraw } from "@/lib/withdrawal-utils"
import { formatXDC } from "@/lib/web3"
import { Loader2, Wallet, AlertCircle, CheckCircle } from "lucide-react"
import type { Campaign } from "@/types/campaign"
import { useAccount } from "wagmi"

interface WithdrawalButtonProps {
  campaign: Campaign
  onWithdrawalSuccess?: () => void
}

export function WithdrawalButton({ campaign, onWithdrawalSuccess }: WithdrawalButtonProps) {
  const { address, isConnected, chainId } = useAccount()
  const { withdrawFunds, isLoading, isCorrectNetwork } = useWithdrawal()
  const isNetworkOk = !!chainId && Number(chainId) === 51

  const { canWithdraw: canWithdrawFunds, reason } = canWithdraw(campaign, address ?? null)

  const handleWithdraw = async () => {
    const result = await withdrawFunds(campaign.id)
    if (result.success) {
      onWithdrawalSuccess?.()
    }
  }

  // Don't show anything if user is not the campaign owner
  if (!address || campaign.owner.toLowerCase() !== address.toLowerCase()) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          Withdraw Funds
        </CardTitle>
        <CardDescription>As the campaign owner, you can withdraw the collected funds</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Withdrawal Info */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Available to withdraw:</span>
            <span className="font-bold text-lg text-primary">{formatXDC(campaign.amountCollected)}</span>
          </div>
        </div>

        {/* Withdrawal Status */}
        {!isConnected ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">Connect your wallet to withdraw</span>
          </div>
        ) : !isNetworkOk ? (
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">Switch to XDC Apothem network</span>
          </div>
        ) : !canWithdrawFunds ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{reason}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">Ready to withdraw</span>
          </div>
        )}

        {/* Withdrawal Button */}
        <Button
          onClick={handleWithdraw}
          disabled={!isConnected || !isNetworkOk || !canWithdrawFunds || isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing Withdrawal...
            </>
          ) : (
            <>
              <Wallet className="h-4 w-4 mr-2" />
              Withdraw {formatXDC(campaign.amountCollected)}
            </>
          )}
        </Button>

        {canWithdrawFunds && (
          <p className="text-xs text-muted-foreground text-center">
            Funds will be transferred directly to your connected wallet
          </p>
        )}
      </CardContent>
    </Card>
  )
}
