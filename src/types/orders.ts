
export type OrderItem = {
  id: number;
  service: {
    name: string;
    price: number;
    description: string | null;
  };
  quantity: number;
  price_at_order: number;
};

export type Order = {
  id: number;
  created_at: string;
  updated_at: string | null;
  status: string;
  total_price: number;
  initial_payment_amount: number | null;
  final_payment_amount: number | null;
  order_items: OrderItem[];
};
