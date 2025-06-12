
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { PartnerCoupon, CouponUse } from "@/types/partners";
import { normalizeUserData } from "@/utils/supabaseHelpers";

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
      return {
        ...application,
        user: normalizeUserData(application.user)
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
    console.log("Buscando cupons de parceiros...");
    
    // Usar LEFT JOIN explícito para garantir que o relacionamento funcione
    const { data, error } = await supabase
      .from("partner_coupons")
      .select(`
        *,
        users!partner_coupons_partner_id_fkey(
          email,
          full_name
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro na consulta de cupons:", error);
      throw error;
    }

    console.log("Dados brutos dos cupons:", data);

    // Normaliza os dados para garantir que o `partner` seja um objeto e não um array
    const normalizedCoupons = (data || []).map(coupon => {
      let partnerData = null;
      
      // Verifica e normaliza os dados do partner (agora vem como `users`)
      if (coupon.users) {
        if (Array.isArray(coupon.users) && coupon.users.length > 0) {
          partnerData = normalizeUserData(coupon.users[0]);
        } else if (!Array.isArray(coupon.users)) {
          partnerData = normalizeUserData(coupon.users);
        }
      }
      
      return {
        ...coupon,
        partner: partnerData,
        users: undefined // Remove o campo users para evitar confusão
      };
    });
    
    console.log("Cupons normalizados:", normalizedCoupons);
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
    console.log("Buscando comissões de parceiros...");
    
    const { data, error } = await supabase
      .from("coupon_uses")
      .select(`
        *,
        partner_coupons!coupon_uses_coupon_id_fkey(
          *,
          users!partner_coupons_partner_id_fkey(
            email,
            full_name
          )
        ),
        orders!coupon_uses_order_id_fkey(
          total_price,
          status
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro na consulta de comissões:", error);
      throw error;
    }

    console.log("Dados brutos das comissões:", data);

    // Normaliza os dados para garantir que o `partner` dentro de `coupon` seja um objeto e não um array
    const normalizedCommissions = (data || []).map(commission => {
      const result = { ...commission };
      
      if (result.partner_coupons) {
        const couponData = { ...result.partner_coupons };
        
        // Normalizar o partner dentro do coupon
        if (couponData.users) {
          let partnerData = null;
          
          // Verifica e normaliza os dados do partner
          if (Array.isArray(couponData.users) && couponData.users.length > 0) {
            partnerData = normalizeUserData(couponData.users[0]);
          } else if (!Array.isArray(couponData.users)) {
            partnerData = normalizeUserData(couponData.users);
          }
          
          // Atualiza o partner com os dados normalizados
          couponData.partner = partnerData;
          couponData.users = undefined; // Remove o campo users
        } else {
          couponData.partner = null;
        }
        
        // Atualiza o coupon com os dados normalizados
        result.coupon = couponData;
        result.partner_coupons = undefined; // Remove o campo original
      }
      
      // Normalizar o campo orders para order
      if (result.orders) {
        result.order = result.orders;
        result.orders = undefined;
      }
      
      return result;
    });
    
    console.log("Comissões normalizadas:", normalizedCommissions);
    
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
