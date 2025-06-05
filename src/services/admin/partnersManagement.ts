
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

    // Normalize user data to handle potential errors in relationships
    return (data || []).map(application => {
      // Handle potential error in user relation with proper null checking
      const normalizedUser = application.user && 
        typeof application.user === 'object' && 
        !('error' in application.user) && 
        application.user !== null
        ? application.user 
        : null;
      
      return {
        ...application,
        user: normalizedUser
      };
    });
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

export const getPartnerCoupons = async () => {
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
    const normalizedCoupons = (data || []).map(coupon => {
      let partnerData = null;
      
      // Verifica e normaliza os dados do partner
      if (coupon.partner && typeof coupon.partner === 'object' && !('error' in coupon.partner)) {
        if (Array.isArray(coupon.partner) && coupon.partner.length > 0) {
          partnerData = coupon.partner[0];
        } else if (!Array.isArray(coupon.partner)) {
          partnerData = coupon.partner;
        }
      }
      
      return {
        ...coupon,
        partner: partnerData
      };
    });
    
    return normalizedCoupons as PartnerCoupon[];
  } catch (error) {
    console.error("Erro ao buscar cupons de parceiros:", error);
    toast.error("Erro", {
      description: "Não foi possível carregar os cupons de parceiros."
    });
    return [];
  }
};

export const getPartnerCommissions = async () => {
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
    const normalizedCommissions = (data || []).map(commission => {
      const result = { ...commission };
      
      if (result.coupon) {
        const couponData = { ...result.coupon };
        
        // Normalizar o partner dentro do coupon
        if (couponData.partner && typeof couponData.partner === 'object' && !('error' in couponData.partner)) {
          let partnerData = null;
          
          // Verifica e normaliza os dados do partner
          if (Array.isArray(couponData.partner) && couponData.partner.length > 0) {
            partnerData = couponData.partner[0];
          } else if (!Array.isArray(couponData.partner)) {
            partnerData = couponData.partner;
          }
          
          // Atualiza o partner com os dados normalizados
          couponData.partner = partnerData;
        } else {
          couponData.partner = null;
        }
        
        // Atualiza o coupon com os dados normalizados
        result.coupon = couponData;
      }
      
      return result;
    });
    
    // Cast the normalized data to the proper type after ensuring it has the right structure
    return normalizedCommissions as unknown as CouponUse[];
  } catch (error) {
    console.error("Erro ao buscar comissões de parceiros:", error);
    toast.error("Erro", {
      description: "Não foi possível carregar as comissões de parceiros."
    });
    return [];
  }
};
