import axios from 'axios';
import type { ZBDPaymentRequest, ZBDPaymentResponse } from '@/types/zbd';

const zbdApi = axios.create({
  baseURL: 'https://api.zebedee.io/v0',
  headers: {
    'Content-Type': 'application/json',
    'apikey': process.env.ZBD_API_KEY,
  },
});

export async function createPaymentRequest(data: ZBDPaymentRequest): Promise<ZBDPaymentResponse> {
  try {
    const response = await zbdApi.post('/charges', {
      amount: data.amount.toString(),
      description: data.description,
      expiresIn: data.expiresIn,
      internalId: data.internalId,
    });

    console.log('ZBD Create Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('ZBD API Error:', error);
    throw error;
  }
}

export async function checkPaymentStatus(id: string): Promise<ZBDPaymentResponse> {
  try {
    const response = await zbdApi.get(`/charges/${id}`);
    console.log('ZBD Status Response:', response.data);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to check payment status');
    }
    
    return response.data;
  } catch (error) {
    console.error('ZBD Status Check Error:', error);
    throw error;
  }
}

export async function getWalletBalance(): Promise<number> {
  const response = await zbdApi.get('/wallet');
  return response.data.balance;
} 