
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

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
