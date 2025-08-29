"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useWallet } from "@/hooks/useWallet"
import { useCreateCampaign } from "@/hooks/useCreateCampaign"
import { WalletConnect } from "@/components/wallet-connect"
import { Loader2, AlertCircle, Calendar, Target, FileText, Type } from "lucide-react"

export function CreateCampaignForm() {
  const router = useRouter()
  const { isConnected, chainId } = useWallet()
  const isCorrectNetwork = chainId === 51 // XDC Apothem
  const { createCampaign, isLoading } = useCreateCampaign()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    target: "",
    deadline: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Campaign title is required"
    } else if (formData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters long"
    } else if (formData.title.length > 100) {
      newErrors.title = "Title must be less than 100 characters"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Campaign description is required"
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters long"
    } else if (formData.description.length > 1000) {
      newErrors.description = "Description must be less than 1000 characters"
    }

    if (!formData.target) {
      newErrors.target = "Funding target is required"
    } else {
      const targetNum = Number.parseFloat(formData.target)
      if (Number.isNaN(targetNum) || targetNum <= 0) {
        newErrors.target = "Target must be a positive number"
      } else if (targetNum > 1000000) {
        newErrors.target = "Target cannot exceed 1,000,000 XDC"
      }
    }

    if (!formData.deadline) {
      newErrors.deadline = "Campaign deadline is required"
    } else {
      const deadlineDate = new Date(formData.deadline)
      const now = new Date()
      const minDate = new Date(now.getTime() + 24 * 60 * 60 * 1000) // 24 hours from now

      if (deadlineDate <= minDate) {
        newErrors.deadline = "Deadline must be at least 24 hours from now"
      }

      const maxDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
      if (deadlineDate > maxDate) {
        newErrors.deadline = "Deadline cannot be more than 1 year from now"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const result = await createCampaign(formData)

    if (result.success) {
      // Reset form
      setFormData({
        title: "",
        description: "",
        target: "",
        deadline: "",
      })

      // Optionally refetch campaigns if a refetch function is provided
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("campaignsUpdated"))
      }

      // Redirect to My Campaigns page after a short delay
      setTimeout(() => {
        router.push("/my-campaigns")
      }, 2000)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  // Get minimum date (24 hours from now)
  const getMinDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split("T")[0]
  }

  // Get maximum date (1 year from now)
  const getMaxDate = () => {
    const nextYear = new Date()
    nextYear.setFullYear(nextYear.getFullYear() + 1)
    return nextYear.toISOString().split("T")[0]
  }

  if (!isConnected) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <CardTitle>Wallet Connection Required</CardTitle>
          <CardDescription>Please connect your wallet to create a campaign</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <WalletConnect />
        </CardContent>
      </Card>
    )
  }

  if (!isCorrectNetwork) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <CardTitle>Wrong Network</CardTitle>
          <CardDescription>Please switch to the XDC Apothem network to create a campaign</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <WalletConnect />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Create New Campaign</CardTitle>
        <CardDescription>
          Fill out the details below to create your fundraising campaign on the XDC blockchain
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campaign Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              Campaign Title
            </Label>
            <Input
              id="title"
              placeholder="Enter a compelling title for your campaign"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className={errors.title ? "border-destructive" : ""}
              maxLength={100}
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
            <p className="text-xs text-muted-foreground">{formData.title.length}/100 characters</p>
          </div>

          {/* Campaign Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Campaign Description
            </Label>
            <Textarea
              id="description"
              placeholder="Describe your campaign, what you're raising funds for, and how the money will be used..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className={`min-h-32 ${errors.description ? "border-destructive" : ""}`}
              maxLength={1000}
            />
            {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
            <p className="text-xs text-muted-foreground">{formData.description.length}/1000 characters</p>
          </div>

          {/* Funding Target */}
          <div className="space-y-2">
            <Label htmlFor="target" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Funding Target (XDC)
            </Label>
            <Input
              id="target"
              type="number"
              placeholder="0.00"
              value={formData.target}
              onChange={(e) => handleInputChange("target", e.target.value)}
              className={errors.target ? "border-destructive" : ""}
              min="0"
              max="1000000"
              step="0.01"
            />
            {errors.target && <p className="text-sm text-destructive">{errors.target}</p>}
            <p className="text-xs text-muted-foreground">Enter the amount of XDC you want to raise</p>
          </div>

          {/* Campaign Deadline */}
          <div className="space-y-2">
            <Label htmlFor="deadline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Campaign Deadline
            </Label>
            <Input
              id="deadline"
              type="date"
              value={formData.deadline}
              onChange={(e) => handleInputChange("deadline", e.target.value)}
              className={errors.deadline ? "border-destructive" : ""}
              min={getMinDate()}
              max={getMaxDate()}
            />
            {errors.deadline && <p className="text-sm text-destructive">{errors.deadline}</p>}
            <p className="text-xs text-muted-foreground">Choose when your campaign should end</p>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating Campaign...
              </>
            ) : (
              "Create Campaign"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
