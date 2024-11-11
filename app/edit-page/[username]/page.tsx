import { currentUser } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { notFound, redirect } from 'next/navigation';
import { EditPageForm } from '@/components/EditPageForm';
import type { TippingPage } from '@/types/database';

export default async function EditPage({
  params
}: {
  params: { username: string }
}) {
  const user = await currentUser();
  if (!user) redirect('/');

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
      }
    }
  );

  const { data: page, error } = await supabase
    .from('tipping_pages')
    .select('*')
    .eq('username', params.username)
    .eq('user_id', user.id)
    .single();

  if (error || !page) {
    notFound();
  }

  return (
    <div className="container max-w-2xl mx-auto py-16 px-4">
      <EditPageForm page={page as TippingPage} />
    </div>
  );
} 