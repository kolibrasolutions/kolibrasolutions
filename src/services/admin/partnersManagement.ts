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
        user:users(*)
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
<<<<<<< HEAD
        partner:users(*)
=======
        users!partner_coupons_partner_id_fkey(
          email,
          full_name
        )
>>>>>>> 4203c1fc7c2fbb716de962f68dac62d2ea98383b
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro na consulta de cupons:", error);
      throw error;
    }

<<<<<<< HEAD
    return data || [];
=======
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
      
      // Criar novo objeto sem a propriedade users e com partner
      const { users, ...couponWithoutUsers } = coupon;
      
      return {
        ...couponWithoutUsers,
        partner: partnerData
      };
    });
    
    console.log("Cupons normalizados:", normalizedCoupons);
    return normalizedCoupons as PartnerCoupon[];
>>>>>>> 4203c1fc7c2fbb716de962f68dac62d2ea98383b
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
<<<<<<< HEAD
          partner:users(*)
=======
          users!partner_coupons_partner_id_fkey(
            email,
            full_name
          )
>>>>>>> 4203c1fc7c2fbb716de962f68dac62d2ea98383b
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

<<<<<<< HEAD
    return data || [];
=======
    console.log("Dados brutos das comissões:", data);

    // Normaliza os dados para garantir que o `partner` dentro de `coupon` seja um objeto e não um array
    const normalizedCommissions = (data || []).map(commission => {
      // Destruturar as propriedades originais
      const { partner_coupons, orders, ...baseCommission } = commission;
      
      let normalizedCoupon = null;
      let normalizedOrder = null;
      
      // Normalizar o coupon se existir
      if (partner_coupons) {
        const { users, ...couponWithoutUsers } = partner_coupons;
        
        let partnerData = null;
        
        // Verifica e normaliza os dados do partner
        if (users) {
          if (Array.isArray(users) && users.length > 0) {
            partnerData = normalizeUserData(users[0]);
          } else if (!Array.isArray(users)) {
            partnerData = normalizeUserData(users);
          }
        }
        
        normalizedCoupon = {
          ...couponWithoutUsers,
          partner: partnerData
        };
      }
      
      // Normalizar o order se existir
      if (orders) {
        normalizedOrder = orders;
      }
      
      return {
        ...baseCommission,
        coupon: normalizedCoupon,
        order: normalizedOrder
      };
    });
    
    console.log("Comissões normalizadas:", normalizedCommissions);
    
    // Cast the normalized data to the proper type after ensuring it has the right structure
    return normalizedCommissions as unknown as CouponUse[];
>>>>>>> 4203c1fc7c2fbb716de962f68dac62d2ea98383b
  } catch (error) {
    console.error("Erro ao buscar comissões de parceiros:", error);
    toast.error("Erro", {
      description: "Não foi possível carregar as comissões de parceiros."
    });
    return [];
  }
};
