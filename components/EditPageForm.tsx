'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { toast } from 'sonner';
import type { TippingPage } from '@/types/database';

interface EditPageFormProps {
  page: TippingPage;
}

export function EditPageForm({ page }: EditPageFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: page.display_name,
    bio: page.bio || '',
    minimumTip: page.minimum_tip.toString(),
    twitterHandle: page.twitter_handle || '',
    instagramHandle: page.instagram_handle || '',
    websiteUrl: page.website_url || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/pages/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pageId: page.id,
          updates: {
            display_name: formData.displayName,
            bio: formData.bio || null,
            minimum_tip: parseInt(formData.minimumTip),
            twitter_handle: formData.twitterHandle || null,
            instagram_handle: formData.instagramHandle || null,
            website_url: formData.websiteUrl || null
          },
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update page');
      }

      toast.success('Your tipping page has been updated!');
      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update page');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="text-2xl">Edit Tipping Page</CardTitle>
        <CardDescription>
          Update your tipping page details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Username</label>
            <Input 
              value={page.username}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Username cannot be changed
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Display Name</label>
            <Input 
              value={formData.displayName}
              onChange={(e) => setFormData({...formData, displayName: e.target.value})}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Bio</label>
            <Textarea 
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              rows={4}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Minimum Tip Amount (sats)</label>
            <Input 
              type="number"
              value={formData.minimumTip}
              onChange={(e) => setFormData({...formData, minimumTip: e.target.value})}
              min="1000"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Twitter Handle</label>
            <Input 
              value={formData.twitterHandle}
              onChange={(e) => setFormData({...formData, twitterHandle: e.target.value})}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Instagram Handle</label>
            <Input 
              value={formData.instagramHandle}
              onChange={(e) => setFormData({...formData, instagramHandle: e.target.value})}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Website URL</label>
            <Input 
              value={formData.websiteUrl}
              onChange={(e) => setFormData({...formData, websiteUrl: e.target.value})}
              disabled={loading}
            />
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 