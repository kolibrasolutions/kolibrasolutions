
import { supabase } from "@/integrations/supabase/client";

export type PartnerStats = {
  totalCommission: number;
  paidCommission: number;
  pendingCommission: number;
  totalOrders: number;
  totalCouponUses: number;
};

export async function getPartnerStats(partnerId: string): Promise<PartnerStats> {
  try {
    // Buscar o cupom do parceiro
    const { data: couponData, error: couponError } = await supabase
      .from("partner_coupons")
      .select("id")
      .eq("partner_id", partnerId)
      .single();

    if (couponError || !couponData) {
      return {
        totalCommission: 0,
        paidCommission: 0,
        pendingCommission: 0,
        totalOrders: 0,
        totalCouponUses: 0
      };
    }

    // Buscar estatísticas de uso do cupom
    const { data: usesData, error: usesError } = await supabase
      .from("coupon_uses")
      .select("*")
      .eq("coupon_id", couponData.id);

    if (usesError) {
      throw usesError;
    }

    const totalCouponUses = usesData?.length || 0;
    const totalOrders = new Set(usesData?.map(use => use.order_id)).size;
    const totalCommission = usesData?.reduce((sum, use) => sum + (parseFloat(String(use.commission_amount)) || 0), 0) || 0;
    const paidCommission = usesData?.filter(use => use.status === 'pago')
      .reduce((sum, use) => sum + (parseFloat(String(use.commission_amount)) || 0), 0) || 0;
    const pendingCommission = usesData?.filter(use => use.status === 'pendente')
      .reduce((sum, use) => sum + (parseFloat(String(use.commission_amount)) || 0), 0) || 0;

    return {
      totalCommission,
      paidCommission,
      pendingCommission,
      totalOrders,
      totalCouponUses
    };
  } catch (error) {
    console.error("Erro ao buscar estatísticas de parceiro:", error);
    return {
      totalCommission: 0,
      paidCommission: 0,
      pendingCommission: 0,
      totalOrders: 0,
      totalCouponUses: 0
    };
  }
}

export async function getMonthlyCommissionStats(partnerId: string): Promise<{
  month: string;
  commission: number;
}[]> {
  try {
    // Buscar o cupom do parceiro
    const { data: couponData, error: couponError } = await supabase
      .from("partner_coupons")
      .select("id")
      .eq("partner_id", partnerId)
      .single();

    if (couponError || !couponData) {
      return [];
    }

    // Buscar usos de cupom
    const { data: usesData, error: usesError } = await supabase
      .from("coupon_uses")
      .select("commission_amount, created_at")
      .eq("coupon_id", couponData.id);

    if (usesError) {
      throw usesError;
    }

    // Processar dados por mês
    const monthlyStats: { [key: string]: number } = {};
    
    usesData?.forEach(use => {
      const date = new Date(use.created_at);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyStats[monthYear]) {
        monthlyStats[monthYear] = 0;
      }
      
      monthlyStats[monthYear] += parseFloat(String(use.commission_amount)) || 0;
    });

    // Converter para o formato de array para retorno
    return Object.entries(monthlyStats).map(([month, commission]) => ({
      month,
      commission
    })).sort((a, b) => a.month.localeCompare(b.month));
  } catch (error) {
    console.error("Erro ao buscar estatísticas mensais de comissão:", error);
    return [];
  }
}
