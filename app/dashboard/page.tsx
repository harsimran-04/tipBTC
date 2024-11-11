import { currentUser } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pencil, Trash2 } from 'lucide-react';
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

  // Create Supabase client with service role key for server component
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Tipping Pages</h1>
        <Link href="/create-page">
          <Button>Create New Page</Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {(pages as TippingPage[])?.map((page) => (
          <Card key={page.id}>
            <CardHeader>
              <CardTitle>{page.display_name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{page.bio}</p>
              <div className="flex justify-between items-center">
                <Link href={`/${page.username}`}>
                  <Button variant="outline">View Page</Button>
                </Link>
                <p className="text-sm text-muted-foreground">
                  Min tip: {page.minimum_tip} sats
                </p>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Link href={`/edit-page/${page.username}`}>
                  <Button variant="ghost" size="sm">
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </Link>
                <DeletePageButton pageId={page.id} pageName={page.display_name} />
              </div>
            </CardContent>
          </Card>
        ))}

        {(!pages || pages.length === 0) && (
          <div className="col-span-full text-center py-12">
            <h3 className="text-lg font-medium mb-2">No tipping pages yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first tipping page to start accepting Bitcoin tips
            </p>
            <Link href="/create-page">
              <Button>Create Your First Page</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 