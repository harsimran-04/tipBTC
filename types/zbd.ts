export interface ZBDPaymentRequest {
  amount: number;
  description: string;
  expiresIn: number;
  internalId?: string;
  callbackUrl?: string;
}

export interface ZBDPaymentResponse {
  data: {
    id: string;
    request: string;  // This is the Lightning invoice
    uri: string;      // Lightning payment URI
    amount: {
      amount: string;
      currency: string;
    };
    status: 'pending' | 'completed' | 'expired';
    created_at: string;
    expires_at: string;
    confirmed_at?: string;
  };
  success: boolean;
  message?: string;
}

export interface ZBDTransaction {
  id: string;
  amount: number;
  status: 'pending' | 'completed' | 'expired';
  createdAt: string;
  completedAt?: string;
  senderId: string;
  receiverId: string;
} 