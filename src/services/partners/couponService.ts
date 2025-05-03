import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

export interface PartnerCoupon {
  id: string;
  partner_id: string;
  code: string;
  discount_percent: number;
  commission_percent: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export async function getPartnerCoupon(partnerId: string) {
  try {
    const { data, error } = await supabase
      .from("partner_coupons")
      .select("*")
      .eq("partner_id", partnerId)
      .single();

    if (error) {
      console.error("Error fetching partner coupon:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Exception fetching partner coupon:", error);
    return null;
  }
}

export async function toggleCouponStatus(couponId: string, isActive: boolean): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("partner_coupons")
      .update({ is_active: isActive })
      .eq("id", couponId);

    if (error) {
      console.error("Error updating coupon status:", error);
      toast.error("Erro ao atualizar status do cupom", {
        description: "Ocorreu um erro ao atualizar o status do cupom."
      });
      return false;
    }

    toast.success(isActive ? "Cupom ativado" : "Cupom desativado", {
      description: `O cupom foi ${isActive ? "ativado" : "desativado"} com sucesso.`
    });
    
    return true;
  } catch (error) {
    console.error("Exception updating coupon status:", error);
    toast.error("Erro ao atualizar status do cupom", {
      description: "Ocorreu um erro ao atualizar o status do cupom."
    });
    return false;
  }
}

export const createCoupon = async (
  partnerId: string,
  discountPercent: number,
  commissionPercent: number
): Promise<PartnerCoupon | null> => {
  try {
    // Gerar código único do cupom
    const code = `PARTNER_${partnerId}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const { data, error } = await supabase
      .from('partner_coupons')
      .insert({
        partner_id: partnerId,
        code,
        discount_percent: discountPercent,
        commission_percent: commissionPercent,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar cupom:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Erro ao criar cupom:', error);
    return null;
  }
};

export const getCouponUses = async (couponId: string) => {
  const { data, error } = await supabase
    .from('coupon_uses')
    .select('*')
    .eq('coupon_id', couponId)
    .order('used_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar usos do cupom:', error);
    return [];
  }

  return data;
};

export const updateCouponUseStatus = async (useId: string, status: string) => {
  const { error } = await supabase
    .from('coupon_uses')
    .update({ commission_status: status })
    .eq('id', useId);

  if (error) {
    console.error('Erro ao atualizar status do uso do cupom:', error);
    return false;
  }

  return true;
};
