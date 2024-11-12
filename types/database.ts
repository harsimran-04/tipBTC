export interface TippingPage {
  id: string;
  username: string;
  display_name: string;
  bio: string | null;
  minimum_tip: number;
  profile_image: string | null;
  user_id: string;
  created_at: string;
}

export interface Cause {
  id: string;
  title: string;
  description: string;
  category: string;
  target_amount: number;
  current_amount: number;
  lightning_address: string;
  image_url?: string;
  created_at: string;
  status: string;
} 