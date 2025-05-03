
import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getPartnerCoupons } from '@/services/admin/partnersManagement';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';

export const PartnerCouponsTable = () => {
  const queryClient = useQueryClient();
  
  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ['partner-coupons'],
    queryFn: getPartnerCoupons,
  });

  const handleToggleCoupon = async (couponId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('partner_coupons')
        .update({ is_active: !currentStatus })
        .eq('id', couponId);

      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ['partner-coupons'] });
      
      toast.success(
        currentStatus ? "Cupom desativado" : "Cupom ativado", 
        { description: `O cupom foi ${currentStatus ? "desativado" : "ativado"} com sucesso.` }
      );
    } catch (error) {
      console.error("Erro ao atualizar status do cupom:", error);
      toast.error("Erro", { description: "Não foi possível atualizar o status do cupom." });
    }
  };

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : coupons.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg text-muted-foreground">
          Não há cupons de parceiros registrados.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 font-medium text-muted-foreground">Código</th>
                <th className="text-left py-3 font-medium text-muted-foreground">Parceiro</th>
                <th className="text-left py-3 font-medium text-muted-foreground">Desconto</th>
                <th className="text-left py-3 font-medium text-muted-foreground">Comissão</th>
                <th className="text-left py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-right py-3 font-medium text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon: any) => (
                <tr key={coupon.id} className="border-b">
                  <td className="py-3 font-mono text-sm">{coupon.code}</td>
                  <td className="py-3">{coupon.partner?.full_name || coupon.partner?.email || coupon.partner_id}</td>
                  <td className="py-3">{coupon.discount_percent}%</td>
                  <td className="py-3">{coupon.commission_percent}%</td>
                  <td className="py-3">
                    {coupon.is_active ? (
                      <Badge variant="outline" className="bg-green-100 text-green-800">Ativo</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-100 text-gray-800">Inativo</Badge>
                    )}
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex justify-end items-center gap-3">
                      <Switch 
                        checked={coupon.is_active}
                        onCheckedChange={() => handleToggleCoupon(coupon.id, coupon.is_active)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
