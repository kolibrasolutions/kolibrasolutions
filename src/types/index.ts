
export interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CartItem extends Service {
  quantity: number;
}
