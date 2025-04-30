
export interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  is_active: boolean;
  stripe_product_id: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CartItem extends Service {
  quantity: number;
}
