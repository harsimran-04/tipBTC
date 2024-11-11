import { notFound } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { TipButton } from '@/components/TipButton';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { SocialButtons } from '@/components/SocialButtons';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Zap, Trophy } from 'lucide-react';

export default async function TippingPage({ params }: { params: { username: string } }) {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: pageData } = await supabase
    .from('tipping_pages')
    .select('*')
    .eq('username', params.username.toLowerCase())
    .single();

  if (!pageData) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute inset-0 opacity-50">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-2s' }} />
      </div>

      <div className="relative">
        {/* Hero Background with gradient overlay */}
        <div className="absolute inset-0 h-[500px] bg-gradient-to-b from-primary/10 via-primary/5 to-transparent" />

        <div className="container max-w-4xl mx-auto px-4 pt-24 pb-16 relative">
          <div className="space-y-12">
            {/* Profile Header with enhanced animations */}
            <div className="text-center space-y-6 animate-fade-in">
              <div className="relative w-40 h-40 mx-auto group">
                {pageData.profile_image ? (
                  <div className="relative w-full h-full rounded-full overflow-hidden animate-glow">
                    <Image
                      src={pageData.profile_image}
                      alt={pageData.display_name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20 flex items-center justify-center text-5xl font-bold animate-glow transition-all duration-300 group-hover:bg-primary/30">
                    {pageData.display_name[0]}
                  </div>
                )}
                <div className="absolute -bottom-2 right-2 transform transition-transform duration-300 group-hover:scale-110">
                  <Badge variant="default" className="gap-1 px-3 py-1.5 text-sm shadow-lg glass-effect">
                    <Sparkles className="w-4 h-4" />
                    Top Creator
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl font-bold tracking-tight gradient-text">
                  {pageData.display_name}
                </h1>
                {pageData.bio && (
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    {pageData.bio}
                  </p>
                )}
              </div>
            </div>

            {/* Stats Cards with hover effects */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatsCard
                icon={<Zap className="w-5 h-5" />}
                title="Total Tips"
                value="1,234"
                trend="+12% this week"
                trendUp={true}
                delay={0}
              />
              <StatsCard
                icon={<Trophy className="w-5 h-5" />}
                title="Top Supporter"
                value="Satoshi"
                trend="50,000 sats"
                trendUp={true}
                delay={200}
              />
              <StatsCard
                icon={<Sparkles className="w-5 h-5" />}
                title="Streak"
                value="12 days"
                trend="Personal best!"
                trendUp={true}
                delay={400}
              />
            </div>

            {/* Main Tipping Card with glass effect */}
            <Card className="border-2 shadow-xl glass-effect hover-card">
              <CardContent className="pt-6">
                <div className="space-y-8">
                  {/* Tip Button */}
                  <div className="space-y-3">
                    <TipButton 
                      creatorId={pageData.id} 
                      creatorName={pageData.display_name}
                    />
                    <p className="text-sm text-center text-muted-foreground">
                      Minimum tip: {pageData.minimum_tip.toLocaleString()} sats
                    </p>
                  </div>

                  {/* Recent Activity */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      Recent Supporters
                    </h3>
                    <div className="space-y-3">
                      <RecentTip name="Satoshi" amount={50000} timeAgo="2 minutes ago" highlight />
                      <RecentTip name="Alice" amount={10000} timeAgo="1 hour ago" />
                      <RecentTip name="Bob" amount={2000} timeAgo="3 hours ago" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Links with enhanced animations */}
            <div className="animate-fade-in" style={{ animationDelay: '600ms' }}>
              <SocialButtons username={pageData.username} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ icon, title, value, trend, trendUp, delay = 0 }: { 
  icon: React.ReactNode;
  title: string;
  value: string;
  trend: string;
  trendUp: boolean;
  delay?: number;
}) {
  return (
    <Card 
      className="hover-card glass-effect animate-fade-in" 
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          {icon}
          <span className="text-sm font-medium">{title}</span>
        </div>
        <div className="text-2xl font-bold gradient-text">{value}</div>
        <div className={`text-sm mt-1 ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
          {trend}
        </div>
      </CardContent>
    </Card>
  );
}

function RecentTip({ name, amount, timeAgo, highlight = false }: { 
  name: string; 
  amount: number; 
  timeAgo: string;
  highlight?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300
      ${highlight 
        ? 'glass-effect hover:bg-primary/15' 
        : 'hover:bg-secondary/10'
      }`}>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300
          ${highlight 
            ? 'bg-primary/20 text-primary animate-glow' 
            : 'bg-secondary/20'
          }`}>
          {name[0]}
        </div>
        <div>
          <div className="font-medium">{name}</div>
          <div className="text-xs text-muted-foreground">{timeAgo}</div>
        </div>
      </div>
      <div className="font-medium">{amount.toLocaleString()} sats</div>
    </div>
  );
}