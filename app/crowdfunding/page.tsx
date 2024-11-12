import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Rocket, Users, Target, Plus, ExternalLink } from 'lucide-react';

export default async function CrowdfundingPage() {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: campaigns } = await supabase
    .from('crowdfunding_campaigns')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute inset-0 opacity-50">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-2s' }} />
      </div>

      <div className="container mx-auto px-4 py-16 relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-16">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent mb-4">
              Crowdfunding Campaigns
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Support innovative projects and startups with Bitcoin Lightning Network
            </p>
          </div>
          <Link href="/crowdfunding/create">
            <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 group">
              <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
              Start Campaign
            </Button>
          </Link>
        </div>

        {/* Campaigns Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {campaigns?.map((campaign) => (
            <Card key={campaign.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              {campaign.image_url && (
                <div className="relative h-48 w-full">
                  <Image
                    src={campaign.image_url}
                    alt={campaign.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-muted-foreground capitalize">
                    {campaign.industry}
                  </span>
                </div>
                <CardTitle className="line-clamp-2">{campaign.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground line-clamp-3">
                    {campaign.short_description}
                  </p>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-orange-500 to-pink-500 transition-all duration-300"
                        style={{ 
                          width: `${Math.min((campaign.current_amount / campaign.target_amount) * 100, 100)}%` 
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {campaign.current_amount.toLocaleString()} sats raised
                      </span>
                      <span className="font-medium">
                        {campaign.target_amount.toLocaleString()} sats goal
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 py-4 border-t">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {campaign.investor_count} Investors
                      </span>
                    </div>
                    <div className="flex items-center gap-2 justify-end">
                      <Target className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {Math.round((campaign.current_amount / campaign.target_amount) * 100)}% Funded
                      </span>
                    </div>
                  </div>

                  <Link href={`/crowdfunding/${campaign.id}`}>
                    <Button className="w-full">
                      View Details
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {(!campaigns || campaigns.length === 0) && (
          <div className="text-center py-16">
            <Rocket className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">No campaigns yet</h3>
            <p className="text-muted-foreground mb-8">
              Be the first to start a crowdfunding campaign
            </p>
            <Link href="/crowdfunding/create">
              <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                Start Your Campaign
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 