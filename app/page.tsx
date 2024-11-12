import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap, ArrowRight, Globe, Shield, Sparkles, Heart, Rocket } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top-left blob */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-full blur-3xl animate-float" />
        
        {/* Top-right blob */}
        <div className="absolute top-1/4 -right-24 w-96 h-96 bg-gradient-to-bl from-primary/20 to-secondary/20 rounded-full blur-3xl animate-float" 
          style={{ animationDelay: '-2s' }} 
        />
        
        {/* Center blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-orange-500/10 via-pink-500/10 to-primary/10 rounded-full blur-3xl animate-float" 
          style={{ animationDelay: '-4s' }} 
        />
        
        {/* Bottom-left blob */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-tr from-secondary/20 to-primary/20 rounded-full blur-3xl animate-float" 
          style={{ animationDelay: '-6s' }} 
        />
        
        {/* Bottom-right blob */}
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-gradient-to-tl from-pink-500/20 to-orange-500/20 rounded-full blur-3xl animate-float" 
          style={{ animationDelay: '-8s' }} 
        />

        {/* Small floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-24 h-24 bg-orange-500/30 rounded-full blur-2xl animate-float" 
          style={{ animationDelay: '-1s' }} 
        />
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-pink-500/30 rounded-full blur-2xl animate-float" 
          style={{ animationDelay: '-3s' }} 
        />
        <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-primary/30 rounded-full blur-2xl animate-float" 
          style={{ animationDelay: '-5s' }} 
        />
      </div>

      {/* Content */}
      <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px]" />
      
      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16 relative">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-background/50 backdrop-blur-sm mb-8">
            <Heart className="w-4 h-4 text-orange-500" />
            <span className="text-sm">Support creators and important causes</span>
          </div>
          
          <div className="space-y-8">
            <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
              <span className="bg-gradient-to-r from-orange-500 via-primary to-pink-500 bg-clip-text text-transparent">
                Bitcoin Tips
              </span>
              <br />
              Made Simple
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Create your personalized tipping page or support verified causes with Bitcoin Lightning payments. Making a difference has never been easier.
            </p>
          </div>
          
          <div className="flex gap-6 justify-center mt-12 flex-col sm:flex-row items-center">
            <Link href="/create-page">
              <Button size="lg" className="text-lg px-8 py-6 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                Create Your Page
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/causes">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-full hover:bg-background/50 backdrop-blur-sm">
                <Heart className="w-5 h-5 mr-2" />
                Support Causes
              </Button>
            </Link>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-20">
            <StatCard icon={<Zap />} number="10k+" label="Active Creators" />
            <StatCard icon={<Globe />} number="$1M+" label="Tips Processed" />
            <StatCard icon={<Shield />} number="100k+" label="Happy Supporters" />
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-32 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <FeatureCard 
            title="Lightning-Fast Payments"
            description="Receive Bitcoin tips instantly with zero fees using the Lightning Network"
            icon={<Zap className="w-6 h-6 text-orange-500" />}
          />
          <FeatureCard 
            title="Support Causes"
            description="Contribute to verified causes and make a real impact with your Bitcoin"
            icon={<Heart className="w-6 h-6 text-orange-500" />}
          />
          <FeatureCard 
            title="Fund Projects"
            description="Support innovative projects and startups through crowdfunding"
            icon={<Rocket className="w-6 h-6 text-orange-500" />}
          />
        </div>

        {/* How It Works Section */}
        <div id="how-it-works" className="mt-32 text-center scroll-mt-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-background/50 backdrop-blur-sm mb-8">
            <ArrowRight className="w-4 h-4 text-orange-500" />
            <span className="text-sm">Simple Process</span>
          </div>
          <h2 className="text-3xl font-bold mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard 
              step="1"
              title="Choose Your Path"
              description="Create a tipping page or browse verified causes to support"
            />
            <StepCard 
              step="2"
              title="Make an Impact"
              description="Send Bitcoin tips instantly using Lightning Network"
            />
            <StepCard 
              step="3"
              title="Track Progress"
              description="See your contributions and the impact they make"
            />
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-32 text-center">
          <div className="max-w-3xl mx-auto p-8 rounded-2xl bg-gradient-to-r from-orange-500/10 to-pink-500/10 border backdrop-blur-sm">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-8">
              Create your page, support causes, or fund innovative projects with Bitcoin
            </p>
            <div className="flex gap-4 justify-center flex-col sm:flex-row">
              <Link href="/create-page">
                <Button size="lg" className="text-lg px-8 py-6 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                  Create Your Page
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/crowdfunding">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-full hover:bg-background/50 backdrop-blur-sm">
                  <Rocket className="w-5 h-5 mr-2" />
                  Browse Projects
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, number, label }: { icon: React.ReactNode; number: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 p-6 rounded-xl bg-background/50 backdrop-blur-sm border hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="p-3 rounded-full bg-orange-500/10">
        {icon}
      </div>
      <div className="text-3xl font-bold text-primary">{number}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

function FeatureCard({ title, description, icon }: { 
  title: string; 
  description: string; 
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-background/50 backdrop-blur-sm p-8 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="mb-6 inline-flex p-4 rounded-full bg-orange-500/10">
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
    <div className="relative p-6 rounded-xl border bg-background/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
        {step}
      </div>
      <div className="mt-4">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
