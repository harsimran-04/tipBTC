import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TipButton } from '@/components/TipButton';
import Image from 'next/image';
import { Heart, TreePine, Droplets, Utensils } from 'lucide-react';
import type { Cause } from '@/types/database';

const categories = {
  'hunger': { icon: Utensils, color: 'text-orange-500' },
  'drought': { icon: Droplets, color: 'text-blue-500' },
  'environment': { icon: TreePine, color: 'text-green-500' },
  'other': { icon: Heart, color: 'text-pink-500' }
} as const;

type Category = keyof typeof categories;

export default async function CausesPage() {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: causes } = await supabase
    .from('causes')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  const causesList = causes as Cause[] || [];

  const CategoryIcon = ({ category }: { category: Category }) => {
    const Icon = categories[category].icon;
    return <Icon className={`w-5 h-5 ${categories[category].color}`} />;
  };

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
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent mb-4">
            Support Important Causes
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Make a difference by supporting verified causes and charities with Bitcoin Lightning donations
          </p>
        </div>

        {/* Causes Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {causesList.map((cause) => (
            <Card key={cause.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              {cause.image_url && (
                <div className="relative h-48 w-full">
                  <Image
                    src={cause.image_url}
                    alt={cause.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <CategoryIcon category={cause.category as Category} />
                  <span className="text-sm text-muted-foreground capitalize">
                    {cause.category}
                  </span>
                </div>
                <CardTitle>{cause.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    {cause.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-orange-500 to-pink-500 transition-all duration-300"
                        style={{ 
                          width: `${Math.min((cause.current_amount / cause.target_amount) * 100, 100)}%` 
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {cause.current_amount.toLocaleString()} sats raised
                      </span>
                      <span className="font-medium">
                        {cause.target_amount.toLocaleString()} sats goal
                      </span>
                    </div>
                  </div>

                  <TipButton
                    creatorId={cause.id}
                    creatorName={cause.title}
                    lightningAddress={cause.lightning_address}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}