
export type PartnerApplication = {
  id: string;
  user_id: string;
  status: string;
  application_date: string | null;
  review_date: string | null;
  review_notes: string | null;
  notes: string;
  created_at: string | null;
  updated_at: string | null;
  user?: {
    email: string;
    full_name: string | null;
  } | null;
};

export type PartnerCoupon = {
  id: string;
  partner_id: string;
  code: string;
  discount_percent: number;
  commission_percent: number;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
  partner?: {
    email: string;
    full_name: string | null;
  } | null;
};

export type CouponUse = {
  id: string;
  coupon_id: string;
  order_id: number;
  commission_amount: number;
  status: string;
  payment_date: string | null;
  created_at: string | null;
  updated_at: string | null;
  coupon?: PartnerCoupon;
  order?: {
    total_price: number;
    status: string;
  };
};

export type PartnerStats = {
  totalCommission: number;
  paidCommission: number;
  pendingCommission: number;
  totalOrders: number;
  totalCouponUses: number;
};
