import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // First check ZBD status
    const zbdResponse = await fetch(`https://api.zebedee.io/v0/charges/${params.id}`, {
      headers: {
        'apikey': process.env.ZBD_API_KEY!,
        'Content-Type': 'application/json'
      }
    });

    const zbdData = await zbdResponse.json();
    console.log('ZBD status response:', zbdData);

    if (zbdData.success && zbdData.data.status === 'completed') {
      // Update our database if ZBD shows completed
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { persistSession: false } }
      );

      const { data: tip, error: updateError } = await supabase
        .from('tips')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('payment_id', params.id)
        .select('*')
        .single();

      if (!updateError && tip) {
        // Update page stats
        await supabase.rpc('increment_page_stats', {
          page_id: tip.page_id,
          tip_amount: tip.amount
        });
      }
    }

    return NextResponse.json({
      status: zbdData.data.status,
      id: params.id
    });
  } catch (error) {
    console.error('Error checking payment status:', error);
    return NextResponse.json(
      { error: 'Failed to check payment status' },
      { status: 500 }
    );
  }
} 