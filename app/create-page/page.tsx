'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Zap, User, FileText, Coins } from 'lucide-react';

export default function CreatePage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    displayName: '',
    bio: '',
    profileImage: '',
    minimumTip: '1000'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoaded) return;
    
    if (!user) {
      toast.error('You must be signed in to create a page');
      return;
    }

    if (!formData.username.match(/^[a-z0-9-]+$/)) {
      toast.error('Username can only contain lowercase letters, numbers, and hyphens');
      return;
    }

    setLoading(true);

    try {
      // Check if username is available
      const { data: existingUser, error: checkError } = await supabase
        .from('tipping_pages')
        .select('username')
        .eq('username', formData.username)
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 means no rows returned
        throw checkError;
      }

      if (existingUser) {
        toast.error('Username is already taken');
        setLoading(false);
        return;
      }

      // Create the tipping page
      const { data, error: insertError } = await supabase
        .from('tipping_pages')
        .insert([
          {
            username: formData.username.toLowerCase(),
            display_name: formData.displayName,
            bio: formData.bio || null,
            minimum_tip: parseInt(formData.minimumTip),
            profile_image: formData.profileImage || null,
            user_id: user.id
          }
        ])
        .select()
        .single();

      if (insertError) {
        console.error('Insert error:', insertError);
        throw new Error(insertError.message);
      }

      toast.success('Your tipping page has been created!');
      router.push(`/${formData.username}`);
      router.refresh(); // Refresh the page to update the data
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
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

      <div className="container max-w-2xl mx-auto py-16 px-4 relative">
        <Card className="border-2 shadow-xl bg-card/50 backdrop-blur-sm">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl font-bold gradient-text">Create Your Tipping Page</CardTitle>
            <CardDescription className="text-lg">
              Set up your personalized page to start accepting Bitcoin tips from your supporters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <div className="relative space-y-2 group">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Username
                  </label>
                  <Input 
                    placeholder="your-unique-username"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value.toLowerCase()})}
                    required
                    pattern="^[a-z0-9-]+$"
                    title="Only lowercase letters, numbers, and hyphens are allowed"
                    disabled={loading}
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                  />
                  <div className="absolute -top-2 right-0 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    tipbtc.com/{formData.username || 'username'}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Display Name
                  </label>
                  <Input 
                    placeholder="Your Name"
                    value={formData.displayName}
                    onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                    required
                    disabled={loading}
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Bio
                  </label>
                  <Textarea 
                    placeholder="Tell your supporters about yourself..."
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    rows={4}
                    disabled={loading}
                    className="resize-none transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Coins className="w-4 h-4" />
                    Minimum Tip Amount (sats)
                  </label>
                  <div className="relative">
                    <Input 
                      type="number"
                      value={formData.minimumTip}
                      onChange={(e) => setFormData({...formData, minimumTip: e.target.value})}
                      min="1000"
                      disabled={loading}
                      className="pl-8 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      ⚡
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Minimum recommended: 1000 sats
                  </p>
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
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Create My Page
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 