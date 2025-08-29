import { CampaignsGrid } from "@/components/campaigns-grid"

export default function ExplorePage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Explore Campaigns</h1>
        <p className="text-muted-foreground text-pretty">
          Discover amazing projects and support causes you care about on the XDC blockchain.
        </p>
      </div>

      <CampaignsGrid />
    </div>
  )
}
