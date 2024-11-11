'use client';

import { Button } from '@/components/ui/button';
import { Twitter, Instagram, Globe, Share2 } from 'lucide-react';
import { toast } from 'sonner';

export function SocialButtons() {
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  return (
    <div className="flex justify-center gap-4">
      <SocialButton icon={<Twitter className="w-5 h-5" />} />
      <SocialButton icon={<Instagram className="w-5 h-5" />} />
      <SocialButton icon={<Globe className="w-5 h-5" />} />
      <SocialButton 
        icon={<Share2 className="w-5 h-5" />} 
        onClick={handleShare}
      />
    </div>
  );
}

function SocialButton({ 
  icon, 
  onClick 
}: { 
  icon: React.ReactNode; 
  onClick?: () => void;
}) {
  return (
    <Button
      variant="outline"
      size="icon"
      className="rounded-full w-10 h-10"
      onClick={onClick}
    >
      {icon}
    </Button>
  );
} 