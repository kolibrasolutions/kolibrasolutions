
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

export async function createCoupon(
  partnerId: string,
  code: string,
  discountPercent: number = 10,
  commissionPercent: number = 10
): Promise<string | null> {
  try {
    // Verificar se já existe um cupom com esse código
    const { data: existingCoupon, error: checkError } = await supabase
      .from("partner_coupons")
      .select("*")
      .eq("code", code)
      .maybeSingle();

    if (checkError) {
      console.error("Erro ao verificar código existente:", checkError);
      throw checkError;
    }

    if (existingCoupon) {
      toast("Código já existe", {
        description: "Este código de cupom já está em uso. Por favor, escolha outro."
      });
      return null;
    }

    // Criar o novo cupom
    const { data, error } = await supabase
      .from("partner_coupons")
      .insert({
        partner_id: partnerId,
        code,
        discount_percent: discountPercent,
        commission_percent: commissionPercent
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    toast("Cupom criado", {
      description: "O cupom de parceiro foi criado com sucesso."
    });
    
    return data.id;
  } catch (error) {
    console.error("Erro ao criar cupom:", error);
    toast("Erro", {
      description: "Não foi possível criar o cupom de parceiro.",
      variant: "destructive"
    });
    return null;
  }
}

export async function getPartnerCoupon(partnerId: string): Promise<PartnerCoupon | null> {
  try {
    const { data, error } = await supabase
      .from("partner_coupons")
      .select("*")
      .eq("partner_id", partnerId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Erro ao buscar cupom de parceiro:", error);
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
      throw error;
    }

    toast(isActive ? "Cupom ativado" : "Cupom desativado", {
      description: isActive 
        ? "O cupom está ativo e pode ser utilizado." 
        : "O cupom foi desativado e não pode mais ser utilizado."
    });
    
    return true;
  } catch (error) {
    console.error("Erro ao atualizar status do cupom:", error);
    toast("Erro", {
      description: "Não foi possível atualizar o status do cupom.",
      variant: "destructive"
    });
    return false;
  }
}

export async function validateCoupon(code: string): Promise<{
  valid: boolean;
  couponId?: string;
  discountPercent?: number;
}> {
  try {
    const { data, error } = await supabase.rpc('is_valid_coupon', {
      coupon_code: code
    });

    if (error) {
      throw error;
    }

    if (!data) {
      return { valid: false };
    }

    // Buscar informações adicionais do cupom
    const { data: couponData, error: couponError } = await supabase
      .from("partner_coupons")
      .select("discount_percent")
      .eq("id", data)
      .single();

    if (couponError) {
      throw couponError;
    }

    return { 
      valid: true, 
      couponId: data,
      discountPercent: couponData.discount_percent
    };
  } catch (error) {
    console.error("Erro ao validar cupom:", error);
    return { valid: false };
  }
}

export async function getCouponUses(couponId: string): Promise<CouponUse[]> {
  try {
    const { data, error } = await supabase
      .from("coupon_uses")
      .select(`
        *,
        orders (
          id,
          total_price,
          status,
          created_at
        )
      `)
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

export async function updateCouponUseStatus(
  useId: string, 
  status: 'pendente' | 'pago' | 'cancelado',
  paymentDate?: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("coupon_uses")
      .update({
        status,
        payment_date: status === 'pago' ? paymentDate || new Date().toISOString() : null,
      })
      .eq("id", useId);

    if (error) {
      throw error;
    }

    toast("Status atualizado", {
      description: `O status da comissão foi atualizado para ${status}.`
    });
    
    return true;
  } catch (error) {
    console.error("Erro ao atualizar status do uso de cupom:", error);
    toast("Erro", {
      description: "Não foi possível atualizar o status da comissão.",
      variant: "destructive"
    });
    return false;
  }
}
