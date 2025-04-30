
import { Json } from '@/integrations/supabase/types';

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

export type PortfolioProject = {
  id: string;
  title: string;
  description: string;
  images: string[];  // We'll ensure this is always a string[] in our conversion functions
  published: boolean;
  created_at: string;
  updated_at: string;
};

// Helper function to ensure images from Supabase are properly converted to string arrays
export const convertPortfolioProjectImages = (images: Json): string[] => {
  if (!images) return [];
  if (Array.isArray(images)) {
    // Filter out non-string values and ensure all entries are strings
    return images.filter(item => typeof item === 'string').map(item => String(item));
  }
  // If it's a single string, return it as an array
  if (typeof images === 'string') {
    return [images];
  }
  return [];
};
