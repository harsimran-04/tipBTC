import { notFound } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { TipButton } from '@/components/TipButton';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { SocialButtons } from '@/components/SocialButtons';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Zap, Trophy } from 'lucide-react';
import { clerkClient } from '@clerk/nextjs';
import { formatDistanceToNow } from 'date-fns';

async function getPageStats(pageId: string) {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: tips } = await supabase
    .from('tips')
    .select('*')
    .eq('page_id', pageId)
    .eq('status', 'completed');

  if (!tips) return { totalTips: 0, totalAmount: 0, supporters: [], topSupporter: null };

  const totalAmount = tips.reduce((sum, tip) => sum + tip.amount, 0);
  const supporters = [...new Set(tips.map(tip => tip.supporter_name))];
  
  // Find top supporter
  const supporterTotals = tips.reduce((acc, tip) => {
    acc[tip.supporter_name] = (acc[tip.supporter_name] || 0) + tip.amount;
    return acc;
  }, {} as Record<string, number>);

  const topSupporter = Object.entries(supporterTotals)
    .sort(([,a], [,b]) => b - a)[0];

  return {
    totalTips: tips.length,
    totalAmount,
    supporters: supporters.length,
    topSupporter: topSupporter ? {
      name: topSupporter[0],
      amount: topSupporter[1]
    } : null,
    recentTips: tips
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 3)
  };
}

async function getRecentTips(pageId: string) {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: tips } = await supabase
    .from('tips')
    .select('*')
    .eq('page_id', pageId)
    .eq('status', 'completed')
    .order('created_at', { ascending: false })
    .limit(5); // Get last 5 tips

  return tips || [];
}

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

  // Fetch user profile from Clerk
  const user = await clerkClient.users.getUser(pageData.user_id);
  const profileImageUrl = user.imageUrl || null;

  const stats = await getPageStats(pageData.id);

  const recentTips = await getRecentTips(pageData.id);

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
                {profileImageUrl ? (
                  <div className="relative w-full h-full rounded-full overflow-hidden animate-glow">
                    <Image
                      src={profileImageUrl}
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
                value={`${stats.totalTips.toLocaleString()}`}
                trend={`${stats.totalAmount.toLocaleString()} sats`}
                trendUp={true}
              />
              <StatsCard
                icon={<Trophy className="w-5 h-5" />}
                title="Top Supporter"
                value={stats.topSupporter?.name || "No tips yet"}
                trend={stats.topSupporter ? `${stats.topSupporter.amount.toLocaleString()} sats` : "-"}
                trendUp={true}
              />
              <StatsCard
                icon={<Sparkles className="w-5 h-5" />}
                title="Total Supporters"
                value={stats.supporters.toString()}
                trend="All time"
                trendUp={true}
              />
            </div>

            {/* Recent Tips */}
            <div className="space-y-3">
              {stats.recentTips.map((tip) => (
                <RecentTip
                  key={tip.id}
                  name={tip.supporter_name}
                  amount={tip.amount}
                  timeAgo={formatDistanceToNow(new Date(tip.created_at), { addSuffix: true })}
                  highlight={tip.supporter_name === stats.topSupporter?.name}
                />
              ))}
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
                      lightningAddress={pageData.lightning_address}
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
                      {recentTips.length > 0 ? (
                        recentTips.map((tip) => (
                          <RecentTip
                            key={tip.id}
                            name={tip.supporter_name}
                            amount={tip.amount}
                            timeAgo={formatDistanceToNow(new Date(tip.created_at), { addSuffix: true })}
                            highlight={tip.supporter_name === stats.topSupporter?.name}
                          />
                        ))
                      ) : (
                        <div className="text-center py-6 text-muted-foreground">
                          <p>No tips yet. Be the first to support!</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Links with enhanced animations */}
            <div className="animate-fade-in" style={{ animationDelay: '600ms' }}>
              <SocialButtons 
                twitterHandle={pageData.twitter_handle}
                instagramHandle={pageData.instagram_handle}
                websiteUrl={pageData.website_url}
              />
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