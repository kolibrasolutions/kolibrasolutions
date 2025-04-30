
export type OrderType = {
  id: number;
  created_at: string;
  updated_at: string | null;
  status: string;
  total_price: number;
  user_id: string;
  initial_payment_amount: number | null;
  final_payment_amount: number | null;
  user: {
    email: string;
    full_name: string | null;
    phone: string | null;
  };
  order_items: {
    id: number;
    service: {
      name: string;
      price: number;
    };
    quantity: number;
    price_at_order: number;
  }[];
};
