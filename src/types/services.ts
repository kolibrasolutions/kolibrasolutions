
export type Service = {
  id: number;
  title: string;
  description: string;
  price: number;
  image?: string;
  features?: string[];
  category?: string;
  featured?: boolean;
  name?: string; // Added for compatibility with API responses
};

export type CartItem = {
  id: number;
  service: Service;
  quantity: number;
  name?: string; // Added for compatibility with existing code
  price?: number; // Added for compatibility with existing code
};
