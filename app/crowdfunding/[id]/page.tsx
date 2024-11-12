import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { TipButton } from '@/components/TipButton';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Mail, Linkedin, Globe, Users, Calendar, AlertTriangle } from 'lucide-react';

export default async function CampaignPage({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: campaign } = await supabase
    .from('crowdfunding_campaigns')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!campaign) {
    notFound();
  }

  const timeline = JSON.parse(campaign.timeline);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute inset-0 opacity-50">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-2s' }} />
      </div>

      <div className="container max-w-5xl mx-auto px-4 py-16 relative">
        {/* Campaign Header */}
        <div className="space-y-8">
          {campaign.image_url && (
            <div className="relative h-[400px] w-full rounded-2xl overflow-hidden">
              <Image
                src={campaign.image_url}
                alt={campaign.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-grow space-y-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="w-5 h-5 text-orange-500" />
                  <span className="text-sm text-muted-foreground capitalize">
                    {campaign.industry}
                  </span>
                </div>
                <h1 className="text-4xl font-bold mb-4">{campaign.title}</h1>
                <p className="text-xl text-muted-foreground">
                  {campaign.short_description}
                </p>
              </div>

              {/* Progress Card */}
              <Card className="border-2">
                <CardContent className="p-6 space-y-6">
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

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {campaign.investor_count || 0} Investors
                      </span>
                    </div>
                    <div className="flex items-center gap-2 justify-end">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {new Date(campaign.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <TipButton
                    creatorId={campaign.id}
                    creatorName={campaign.title}
                    lightningAddress={campaign.lightning_address}
                  />
                </CardContent>
              </Card>

              {/* Full Description */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">About the Project</h2>
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  {campaign.full_description}
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Project Timeline</h2>
                <div className="space-y-4">
                  {timeline.milestones.map((milestone: string, index: number) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-muted-foreground">{milestone}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risks and Challenges */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Risks and Challenges</h2>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-1" />
                      <p className="text-muted-foreground">{campaign.risks_challenges}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Sidebar */}
            <div className="w-full md:w-80 space-y-6">
              <Card>
                <CardContent className="p-6 space-y-6">
                  <h3 className="text-lg font-semibold">Team Members</h3>
                  <div className="space-y-4">
                    {campaign.team_members.map((member: string, index: number) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          {member[0]}
                        </div>
                        <span>{member}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-lg font-semibold">Contact Information</h3>
                  
                  <a 
                    href={`mailto:${campaign.email}`}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    {campaign.email}
                  </a>

                  <a 
                    href={campaign.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn Profile
                  </a>

                  {campaign.website_url && (
                    <a 
                      href={campaign.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Globe className="w-4 h-4" />
                      Website
                    </a>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 