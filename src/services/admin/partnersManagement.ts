import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { PartnerCoupon, CouponUse } from "@/types/partners";

export const getPartnerApplications = async () => {
  try {
    const { data, error } = await supabase
      .from("partner_applications")
      .select(`
        *,
        user:users(*)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Erro ao buscar solicitações de parceria:", error);
    toast.error("Erro", {
      description: "Não foi possível carregar as solicitações de parceria."
    });
    return [];
  }
};

export const getPartners = async () => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("role", "partner");

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Erro ao buscar parceiros:", error);
    toast.error("Erro", {
      description: "Não foi possível carregar a lista de parceiros."
    });
    return [];
  }
};

export const getPartnerCoupons = async (): Promise<PartnerCoupon[]> => {
  try {
    const { data, error } = await supabase
      .from("partner_coupons")
      .select(`
        *,
        partner:users(*)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Erro ao buscar cupons de parceiros:", error);
    toast.error("Erro", {
      description: "Não foi possível carregar os cupons de parceiros."
    });
    return [];
  }
};

export const getPartnerCommissions = async (): Promise<CouponUse[]> => {
  try {
    const { data, error } = await supabase
      .from("coupon_uses")
      .select(`
        *,
        coupon:partner_coupons(
          *,
          partner:users(*)
        ),
        order:orders(
          total_price,
          status
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Erro ao buscar comissões de parceiros:", error);
    toast.error("Erro", {
      description: "Não foi possível carregar as comissões de parceiros."
    });
    return [];
  }
};
