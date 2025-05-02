
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

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

/**
 * Obtém o cupom do parceiro atual
 */
export async function getPartnerCoupon(): Promise<PartnerCoupon | null> {
  try {
    // Get current user session
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;
    
    if (!userId) {
      return null;
    }

    const { data, error } = await supabase
      .from("partner_coupons")
      .select("*")
      .eq("partner_id", userId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Erro ao buscar cupom do parceiro:", error);
    return null;
  }
}

/**
 * Cria um novo cupom para um parceiro
 */
export async function createCoupon(
  partnerId: string, 
  code: string, 
  discountPercent: number = 10, 
  commissionPercent: number = 10
): Promise<boolean> {
  try {
    const { error } = await supabase.from("partner_coupons").insert({
      partner_id: partnerId,
      code,
      discount_percent: discountPercent,
      commission_percent: commissionPercent
    });

    if (error) {
      throw error;
    }

    toast("Cupom criado", {
      description: `O cupom ${code} foi criado com sucesso para o parceiro.`
    });
    
    return true;
  } catch (error) {
    console.error("Erro ao criar cupom:", error);
    toast("Erro", {
      description: "Não foi possível criar o cupom para o parceiro."
    });
    return false;
  }
}

/**
 * Atualiza um cupom existente
 */
export async function updateCoupon(
  id: string,
  isActive: boolean,
  discountPercent?: number,
  commissionPercent?: number
): Promise<boolean> {
  try {
    const updates: any = { is_active: isActive };
    
    if (discountPercent !== undefined) {
      updates.discount_percent = discountPercent;
    }
    
    if (commissionPercent !== undefined) {
      updates.commission_percent = commissionPercent;
    }
    
    const { error } = await supabase
      .from("partner_coupons")
      .update(updates)
      .eq("id", id);

    if (error) {
      throw error;
    }

    toast("Cupom atualizado", {
      description: "O cupom foi atualizado com sucesso."
    });
    
    return true;
  } catch (error) {
    console.error("Erro ao atualizar cupom:", error);
    toast("Erro", {
      description: "Não foi possível atualizar o cupom."
    });
    return false;
  }
}

/**
 * Obtém os usos de um cupom
 */
export async function getCouponUses(couponId: string): Promise<CouponUse[]> {
  try {
    const { data, error } = await supabase
      .from("coupon_uses")
      .select("*")
      .eq("coupon_id", couponId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Erro ao buscar usos de cupom:", error);
    return [];
  }
}

/**
 * Atualiza o status de um uso de cupom
 */
export async function updateCouponUseStatus(
  id: string,
  status: "pendente" | "pago" | "cancelado",
  paymentDate?: string
): Promise<boolean> {
  try {
    const updates: any = { status };
    
    if (paymentDate) {
      updates.payment_date = paymentDate;
    }
    
    const { error } = await supabase
      .from("coupon_uses")
      .update(updates)
      .eq("id", id);

    if (error) {
      throw error;
    }

    toast("Status atualizado", {
      description: `O status da comissão foi alterado para ${status}.`
    });
    
    return true;
  } catch (error) {
    console.error("Erro ao atualizar status do uso de cupom:", error);
    toast("Erro", {
      description: "Não foi possível atualizar o status da comissão."
    });
    return false;
  }
}
