'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Building2, Target, Mail, Linkedin, Link as LinkIcon, ArrowLeft, FileText } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

const industries = [
  'Technology',
  'Healthcare',
  'Education',
  'Environment',
  'Finance',
  'Social Impact',
  'Entertainment',
  'Other'
];

export default function CreateCampaignPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    fullDescription: '',
    industry: '',
    targetAmount: '1000000',
    lightningAddress: '',
    imageUrl: '',
    linkedinUrl: '',
    email: '',
    websiteUrl: '',
    teamMembers: '',
    risksAndChallenges: '',
    timeline: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoaded || !user) {
      toast.error('You must be signed in to create a campaign');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/campaigns/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create campaign');
      }

      toast.success('Your campaign has been created!');
      router.push('/crowdfunding');
      router.refresh();
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute inset-0 opacity-50">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-2s' }} />
      </div>

      <div className="container max-w-3xl mx-auto py-16 px-4 relative">
        <Link 
          href="/crowdfunding" 
          className="absolute top-8 left-4 md:left-0 inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Campaigns
          </Button>
        </Link>

        <Card className="border-2 shadow-xl bg-card/50 backdrop-blur-sm">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl font-bold gradient-text">Create Crowdfunding Campaign</CardTitle>
            <CardDescription className="text-lg">
              Share your project details to start raising funds with Bitcoin Lightning
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Project Title
                  </label>
                  <Input 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                    placeholder="Enter your project title"
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Industry
                  </label>
                  <select 
                    value={formData.industry}
                    onChange={(e) => setFormData({...formData, industry: e.target.value})}
                    required
                    className="w-full h-10 px-3 rounded-md border bg-background text-sm"
                  >
                    <option value="">Select Industry</option>
                    {industries.map(industry => (
                      <option key={industry} value={industry.toLowerCase()}>
                        {industry}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Short Description</label>
                  <Textarea 
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}
                    required
                    placeholder="Brief overview of your project (max 200 characters)"
                    maxLength={200}
                    className="resize-none transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Description</label>
                  <Textarea 
                    value={formData.fullDescription}
                    onChange={(e) => setFormData({...formData, fullDescription: e.target.value})}
                    required
                    placeholder="Detailed description of your project"
                    rows={6}
                    className="resize-none transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* Funding Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Funding Details</h3>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Funding Goal (sats)
                  </label>
                  <Input 
                    type="number"
                    value={formData.targetAmount}
                    onChange={(e) => setFormData({...formData, targetAmount: e.target.value})}
                    required
                    min="1000000"
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum goal: 1,000,000 sats
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Lightning Address</label>
                  <Input 
                    value={formData.lightningAddress}
                    onChange={(e) => setFormData({...formData, lightningAddress: e.target.value})}
                    required
                    placeholder="you@zbd.gg"
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Contact Information</h3>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </label>
                  <Input 
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    placeholder="contact@example.com"
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Linkedin className="w-4 h-4" />
                    LinkedIn Profile
                  </label>
                  <Input 
                    value={formData.linkedinUrl}
                    onChange={(e) => setFormData({...formData, linkedinUrl: e.target.value})}
                    required
                    placeholder="https://linkedin.com/in/username"
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <LinkIcon className="w-4 h-4" />
                    Website (Optional)
                  </label>
                  <Input 
                    value={formData.websiteUrl}
                    onChange={(e) => setFormData({...formData, websiteUrl: e.target.value})}
                    placeholder="https://your-project.com"
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* Additional Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Additional Details</h3>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Team Members</label>
                  <Textarea 
                    value={formData.teamMembers}
                    onChange={(e) => setFormData({...formData, teamMembers: e.target.value})}
                    required
                    placeholder="List your team members (one per line)"
                    rows={4}
                    className="resize-none transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Project Timeline</label>
                  <Textarea 
                    value={formData.timeline}
                    onChange={(e) => setFormData({...formData, timeline: e.target.value})}
                    required
                    placeholder="List your project milestones (one per line)"
                    rows={4}
                    className="resize-none transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Risks and Challenges</label>
                  <Textarea 
                    value={formData.risksAndChallenges}
                    onChange={(e) => setFormData({...formData, risksAndChallenges: e.target.value})}
                    required
                    placeholder="Describe potential risks and how you plan to address them"
                    rows={4}
                    className="resize-none transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={loading || !isLoaded || !user}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-background border-r-transparent" />
                    Creating...
                  </div>
                ) : (
                  'Launch Campaign'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 