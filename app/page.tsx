import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tight sm:text-7xl bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
              Bitcoin Tips Made Simple
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Create your personalized tipping page in seconds and start accepting Bitcoin payments from your supporters worldwide.
            </p>
          </div>
          
          <div className="flex gap-4 justify-center mt-12 flex-col sm:flex-row items-center">
            <Link href="/create-page">
              <Button size="lg" variant="default" className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                Create Your Tipping Page →
              </Button>
            </Link>
            <Link href="/explore">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-full">
                Explore Creators
              </Button>
            </Link>
          </div>

          {/* Stats Section */}
          <div className="flex justify-center gap-8 mt-16 flex-wrap">
            <StatCard number="10k+" label="Active Creators" />
            <StatCard number="$1M+" label="Tips Processed" />
            <StatCard number="100k+" label="Happy Supporters" />
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-32 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <FeatureCard 
            title="Lightning-Fast Payments"
            description="Receive Bitcoin tips instantly with zero fees using the Lightning Network"
            icon="⚡"
          />
          <FeatureCard 
            title="Custom Integration"
            description="Embed your tipping widget anywhere - website, Twitter, or blog"
            icon="🔌"
          />
          <FeatureCard 
            title="Real-time Dashboard"
            description="Track your earnings and engage with supporters in real-time"
            icon="📊"
          />
        </div>

        {/* How It Works Section */}
        <div className="mt-32 text-center">
          <h2 className="text-3xl font-bold mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard 
              step="1"
              title="Create Your Page"
              description="Sign up and customize your tipping page in minutes"
            />
            <StepCard 
              step="2"
              title="Share Your Link"
              description="Share your unique tipping link with your audience"
            />
            <StepCard 
              step="3"
              title="Receive Tips"
              description="Get Bitcoin tips directly to your wallet instantly"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-primary">{number}</div>
      <div className="text-sm text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function FeatureCard({ title, description, icon }: { 
  title: string; 
  description: string; 
  icon: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-8 text-center hover:shadow-lg transition-all duration-200 hover:scale-105">
      <div className="text-4xl mb-4 bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
        {icon}
      </div>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

function StepCard({ step, title, description }: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <div className="relative p-6">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
        {step}
      </div>
      <h3 className="text-xl font-semibold mt-8 mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
