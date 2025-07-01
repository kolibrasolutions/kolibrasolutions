import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { PartnerCoupon, CouponUse } from "@/types/partners";

export const getPartnerApplications = async () => {
  try {
    // Buscar aplicações de parceria
    const { data: applications, error } = await supabase
      .from("partner_applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    if (!applications || applications.length === 0) {
      return [];
    }

    // Buscar informações dos usuários separadamente
    const userIds = applications.map(app => app.user_id);
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();

    if (usersError) {
      console.warn("Não foi possível buscar dados dos usuários:", usersError);
      return applications.map(app => ({
        ...app,
        user: { email: app.user_id, full_name: null }
      }));
    }

    // Combinar os dados
    return applications.map(app => ({
      ...app,
      user: users.users.find(user => user.id === app.user_id) || { email: app.user_id, full_name: null }
    }));

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
    // Buscar cupons de parceiros
    const { data: coupons, error } = await supabase
      .from("partner_coupons")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    if (!coupons || coupons.length === 0) {
      return [];
    }

    // Buscar informações dos usuários separadamente
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();

    if (usersError) {
      console.warn("Não foi possível buscar dados dos usuários:", usersError);
      return coupons.map(coupon => ({
        ...coupon,
        partner: { email: coupon.partner_id, full_name: null }
      }));
    }

    // Combinar os dados
    return coupons.map(coupon => ({
      ...coupon,
      partner: users.users.find(user => user.id === coupon.partner_id) || { email: coupon.partner_id, full_name: null }
    }));

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
    // Buscar usos de cupons
    const { data: uses, error } = await supabase
      .from("coupon_uses")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    if (!uses || uses.length === 0) {
      return [];
    }

    // Buscar cupons relacionados
    const couponIds = [...new Set(uses.map(use => use.coupon_id))];
    const { data: coupons, error: couponsError } = await supabase
      .from("partner_coupons")
      .select("*")
      .in("id", couponIds);

    // Buscar pedidos relacionados
    const orderIds = [...new Set(uses.map(use => use.order_id))];
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("id, total_price, status")
      .in("id", orderIds);

    // Buscar informações dos usuários
    const { data: userData, error: usersError } = await supabase.auth.admin.listUsers();

    // Combinar todos os dados
    return uses.map(use => {
      const coupon = coupons?.find(c => c.id === use.coupon_id);
      const order = orders?.find(o => o.id === use.order_id);
      let partner = null;

      if (coupon && userData && !usersError) {
        partner = userData.users.find(user => user.id === coupon.partner_id) || null;
      }

      return {
        ...use,
        coupon: coupon ? {
          ...coupon,
          partner: partner ? { email: partner.email, full_name: partner.user_metadata?.full_name || null } : null
        } : null,
        order: order || null
      };
    });

  } catch (error) {
    console.error("Erro ao buscar comissões de parceiros:", error);
    toast.error("Erro", {
      description: "Não foi possível carregar as comissões de parceiros."
    });
    return [];
  }
};
