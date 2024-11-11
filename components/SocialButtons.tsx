'use client';

import { Button } from '@/components/ui/button';
import { Twitter, Instagram, Globe } from 'lucide-react';

interface SocialButtonsProps {
  twitterHandle?: string | null;
  instagramHandle?: string | null;
  websiteUrl?: string | null;
}

export function SocialButtons({ twitterHandle, instagramHandle, websiteUrl }: SocialButtonsProps) {
  if (!twitterHandle && !instagramHandle && !websiteUrl) {
    return null;
  }

  return (
    <div className="flex justify-center gap-4">
      {twitterHandle && (
        <a 
          href={`https://twitter.com/${twitterHandle.replace('@', '')}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            variant="outline"
            size="icon"
            className="rounded-full w-10 h-10 hover:scale-110 transition-transform duration-200"
          >
            <Twitter className="w-5 h-5" />
          </Button>
        </a>
      )}
      
      {instagramHandle && (
        <a 
          href={`https://instagram.com/${instagramHandle.replace('@', '')}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            variant="outline"
            size="icon"
            className="rounded-full w-10 h-10 hover:scale-110 transition-transform duration-200"
          >
            <Instagram className="w-5 h-5" />
          </Button>
        </a>
      )}
      
      {websiteUrl && (
        <a 
          href={websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            variant="outline"
            size="icon"
            className="rounded-full w-10 h-10 hover:scale-110 transition-transform duration-200"
          >
            <Globe className="w-5 h-5" />
          </Button>
        </a>
      )}
    </div>
  );
} 