import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';

export async function POST(request: Request) {
  try {
    const { amount, lightningAddress } = await request.json();

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

    return NextResponse.json(data);
  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
} 