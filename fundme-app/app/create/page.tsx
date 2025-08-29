import { CreateCampaignForm } from "@/components/create-campaign-form"

export default function CreateCampaignPage() {
  return (
    <div className="container py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Create a Campaign</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
          Launch your fundraising campaign on the XDC blockchain. Set your goals, tell your story, and start raising
          funds from supporters around the world.
        </p>
      </div>

      <CreateCampaignForm />
    </div>
  )
}
