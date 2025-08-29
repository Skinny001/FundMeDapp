import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CampaignsGrid } from "@/components/campaigns-grid"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="container py-8">
      {/* Hero Section */}
      <section className="text-center py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            Fund Your Dreams on the <span className="text-primary">XDC Blockchain</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-pretty">
            Create campaigns, raise funds, and support projects you believe in. Powered by smart contracts for
            transparency and security.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/create">Start a Campaign</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/explore">Explore Campaigns</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose FundMe?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Built on blockchain technology for maximum transparency and security
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="text-center">
              <div className="text-4xl mb-4">🛡️</div>
              <CardTitle>Secure</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Smart contracts ensure funds are protected and transactions are transparent
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <CardTitle>Goal-Oriented</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Set clear funding targets and deadlines for your campaigns
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="text-4xl mb-4">👥</div>
              <CardTitle>Community-Driven</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Connect with supporters who believe in your vision and goals
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="text-4xl mb-4">❤️</div>
              <CardTitle>Impactful</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Make a real difference by supporting meaningful projects
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Recent Campaigns</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Discover the latest projects looking for support</p>
        </div>

        <CampaignsGrid />
      </section>

      {/* CTA Section */}
      <section className="py-16 text-center">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Ready to Get Started?</CardTitle>
            <CardDescription>Connect your wallet and start exploring campaigns or create your own</CardDescription>
          </CardHeader>
          <CardContent>
            <Button size="lg" asChild>
              <Link href="/explore">Explore Campaigns</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
