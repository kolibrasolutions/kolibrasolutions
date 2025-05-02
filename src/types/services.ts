
export type Service = {
  id: number;
  title: string;
  description: string;
  price: number;
  image?: string;
  features?: string[];
  category?: string;
  featured?: boolean;
};

export type CartItem = {
  id: number;
  service: Service;
  quantity: number;
};
