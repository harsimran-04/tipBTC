import { currentUser } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pencil, Trash2, Plus, Zap, Users, Sparkles } from 'lucide-react';
import type { TippingPage } from '@/types/database';
import { DeletePageButton } from '@/components/DeletePageButton';

async function getDashboardStats(userId: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { persistSession: false }
    }
  );

  // Get all completed tips for user's pages
  const { data: tips } = await supabase
    .from('tips')
    .select(`
      *,
      tipping_pages!inner (
        user_id
      )
    `)
    .eq('tipping_pages.user_id', userId)
    .eq('status', 'completed');

  if (!tips) return { totalTips: 0, totalAmount: 0, totalSupporters: 0 };

  const totalAmount = tips.reduce((sum, tip) => sum + tip.amount, 0);
  const uniqueSupporters = new Set(tips.map(tip => tip.supporter_name)).size;

  return {
    totalTips: tips.length,
    totalAmount,
    totalSupporters: uniqueSupporters
  };
}

// Add this new StatsOverview component
function StatsOverview({ stats }: { 
  stats: { 
    totalTips: number; 
    totalAmount: number; 
    totalSupporters: number; 
    activePages: number; 
  } 
}) {
  return (
    <div className="relative p-8 rounded-2xl bg-gradient-to-br from-orange-500/5 via-pink-500/5 to-primary/5 border backdrop-blur-sm mb-8 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-5s' }} />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:16px_16px]" />
      
      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Total Tips Card */}
        <div className="bg-gradient-to-br from-background/40 to-background/20 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-orange-500/20 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-500/10">
              <Zap className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Total Tips</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-500 bg-clip-text text-transparent">
                  {stats.totalTips.toLocaleString()}
                </h3>
                <span className="text-sm text-orange-500/80">
                  {stats.totalAmount.toLocaleString()} sats
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Total Supporters Card */}
        <div className="bg-gradient-to-br from-background/40 to-background/20 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-orange-500/20 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-500/10">
              <Users className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Total Supporters</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-500 bg-clip-text text-transparent">
                  {stats.totalSupporters.toLocaleString()}
                </h3>
                <span className="text-sm text-orange-500/80">Unique supporters</span>
              </div>
            </div>
          </div>
        </div>

        {/* Active Pages Card */}
        <div className="bg-gradient-to-br from-background/40 to-background/20 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-orange-500/20 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-500/10">
              <Sparkles className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Active Pages</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-500 bg-clip-text text-transparent">
                  {stats.activePages.toLocaleString()}
                </h3>
                <span className="text-sm text-orange-500/80">Total pages</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const user = await currentUser();
  
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Please sign in to view your dashboard</h1>
        <Link href="/">
          <Button>Go Home</Button>
        </Link>
      </div>
    );
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
      }
    }
  );

  const { data: pages, error } = await supabase
    .from('tipping_pages')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching pages:', error);
  }

  const stats = await getDashboardStats(user.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-2s' }} />
      </div>

      <div className="container mx-auto px-4 py-8 relative">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              Your Tipping Pages
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage and track your Bitcoin tipping pages
            </p>
          </div>
          <Link href="/create-page">
            <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 group">
              <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
              Create New Page
            </Button>
          </Link>
        </div>

        {/* Replace the old stats grid with the new StatsOverview component */}
        <StatsOverview 
          stats={{
            totalTips: stats.totalTips,
            totalAmount: stats.totalAmount,
            totalSupporters: stats.totalSupporters,
            activePages: pages?.length || 0
          }}
        />

        {/* Tipping Pages Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(pages as TippingPage[])?.map((page) => (
            <Card key={page.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-background/50 backdrop-blur-sm border">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="truncate">{page.display_name}</span>
                  <div className="flex items-center gap-1">
                    <Link href={`/edit-page/${page.username}`}>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <DeletePageButton pageId={page.id} pageName={page.display_name} />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {page.bio || "No description provided"}
                  </p>
                  <div className="flex items-center justify-between">
                    <Link href={`/${page.username}`}>
                      <Button variant="outline" className="hover:bg-primary/5">
                        View Page
                      </Button>
                    </Link>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Zap className="w-4 h-4" />
                      <span>{page.minimum_tip.toLocaleString()} sats min</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {(!pages || pages.length === 0) && (
            <div className="col-span-full">
              <Card className="border-dashed bg-background/50 backdrop-blur-sm">
                <CardContent className="py-12 text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Plus className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No tipping pages yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first tipping page to start accepting Bitcoin tips
                  </p>
                  <Link href="/create-page">
                    <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                      Create Your First Page
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 