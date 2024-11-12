import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    console.log('ZBD Webhook payload:', payload);

    // Only process completed payments
    if (payload.status !== 'completed') {
      return NextResponse.json({ success: true });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );

    // Update tip status in database
    const { data: tip, error: updateError } = await supabase
      .from('tips')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('payment_id', payload.data.id)
      .select('*')
      .single();

    if (updateError) {
      console.error('Error updating tip:', updateError);
      throw updateError;
    }

    console.log('Updated tip:', tip);

    if (tip) {
      // Update page stats using the increment_page_stats function
      const { error: statsError } = await supabase.rpc('increment_page_stats', {
        page_id: tip.page_id,
        tip_amount: tip.amount
      });

      if (statsError) {
        console.error('Error updating stats:', statsError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
} 