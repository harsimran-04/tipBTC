import { NextResponse } from 'next/server';
import { checkPaymentStatus } from '@/lib/zbd';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const response = await checkPaymentStatus(params.id);
    console.log('Status check response:', response);

    return NextResponse.json({
      status: response.data.status,
      id: response.data.id,
      request: response.data.request,
      amount: response.data.amount
    });
  } catch (error: any) {
    console.error('Error checking payment status:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to check payment status' },
      { status: 500 }
    );
  }
} 