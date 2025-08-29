import { MyCampaigns } from "@/components/my-campaigns"

export default function MyCampaignsPage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Campaigns</h1>
        <p className="text-muted-foreground text-pretty">
          Manage your campaigns and withdraw funds when conditions are met.
        </p>
      </div>

      <MyCampaigns />
    </div>
  )
}
