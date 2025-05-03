
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { PartnerCoupon, CouponUse } from "@/types/partners";

export const getPartnerApplications = async () => {
  try {
    const { data, error } = await supabase
      .from("partner_applications")
      .select(`
        *,
        user:users(
          email,
          full_name
        )
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
        partner:users(
          email,
          full_name
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    // Normaliza os dados para garantir que o `partner` seja um objeto e não um array
    return (data || []).map(coupon => {
      let partnerData = coupon.partner;
      
      // Garante que partner seja um objeto e não um array
      if (Array.isArray(partnerData)) {
        partnerData = partnerData[0] || null;
      }
      
      return {
        ...coupon,
        partner: partnerData
      };
    });
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
          partner:users(
            email,
            full_name
          )
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

    // Normaliza os dados para garantir que o `partner` dentro de `coupon` seja um objeto e não um array
    return (data || []).map(commission => {
      if (commission.coupon && commission.coupon.partner) {
        let partnerData = commission.coupon.partner;
        
        // Garante que partner seja um objeto e não um array
        if (Array.isArray(partnerData)) {
          partnerData = partnerData[0] || null;
        }
        
        commission.coupon.partner = partnerData;
      }
      
      return commission;
    });
  } catch (error) {
    console.error("Erro ao buscar comissões de parceiros:", error);
    toast.error("Erro", {
      description: "Não foi possível carregar as comissões de parceiros."
    });
    return [];
  }
};
