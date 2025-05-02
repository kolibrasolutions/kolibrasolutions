
import { Json } from '@/integrations/supabase/types';

export type PartnerApplication = {
  id: string;
  user_id: string;
  status: string;
  application_date: string;
  review_date: string | null;
  reviewer_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type PartnerCoupon = {
  id: string;
  partner_id: string;
  code: string;
  discount_percent: number;
  commission_percent: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type CouponUse = {
  id: string;
  coupon_id: string;
  order_id: number;
  commission_amount: number;
  status: string;
  payment_date: string | null;
  created_at: string;
  updated_at: string;
};

export type PartnerStats = {
  totalCommission: number;
  paidCommission: number;
  pendingCommission: number;
  totalOrders: number;
  totalCouponUses: number;
};
