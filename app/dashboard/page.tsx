import { currentUser } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pencil, Trash2, Plus, Zap, Users, Sparkles } from 'lucide-react';
import type { TippingPage } from '@/types/database';
import { DeletePageButton } from '@/components/DeletePageButton';

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

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={<Zap className="w-5 h-5" />}
            title="Total Tips"
            value="123,456"
            trend="+12.5%"
            trendUp={true}
          />
          <StatCard
            icon={<Users className="w-5 h-5" />}
            title="Total Supporters"
            value="1,234"
            trend="+5.2%"
            trendUp={true}
          />
          <StatCard
            icon={<Sparkles className="w-5 h-5" />}
            title="Active Pages"
            value={pages?.length.toString() || "0"}
            trend="All time"
            trendUp={true}
          />
        </div>

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

function StatCard({ icon, title, value, trend, trendUp }: {
  icon: React.ReactNode;
  title: string;
  value: string;
  trend: string;
  trendUp: boolean;
}) {
  return (
    <Card className="bg-background/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            {icon}
          </div>
          <span className={`text-sm ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
            {trend}
          </span>
        </div>
        <div className="space-y-1">
          <h3 className="text-2xl font-bold">{value}</h3>
          <p className="text-sm text-muted-foreground">{title}</p>
        </div>
      </CardContent>
    </Card>
  );
} 