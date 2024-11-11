import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { amount, lightningAddress, pageId, supporterName } = await request.json();

    const response = await fetch('https://api.zebedee.io/v0/ln-address/fetch-charge', {
      method: 'POST',
      headers: {
        'apikey': process.env.ZBD_API_KEY!,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        lnaddress: lightningAddress,
        amount: amount.toString()
      })
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Failed to create charge');
    }

    // Store the tip in Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );

    await supabase.from('tips').insert({
      page_id: pageId,
      amount,
      supporter_name: supporterName,
      status: 'pending'
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
} 