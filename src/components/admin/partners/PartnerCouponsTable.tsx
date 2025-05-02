
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toggleCouponStatus } from '@/services/partners/couponService';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from '@/components/ui/sonner';

export const PartnerCouponsTable = () => {
  const { data: coupons = [], isLoading, refetch } = useQuery({
    queryKey: ['partner-coupons'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('partner_coupons')
        .select(`
          *,
          partners:users!partner_coupons_partner_id_fkey(
            email,
            full_name
          )
        `)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    },
  });

  const handleToggleActive = async (coupon: any) => {
    await toggleCouponStatus(coupon.id, !coupon.is_active);
    refetch();
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast("Código copiado", {
      description: "O código do cupom foi copiado para a área de transferência."
    });
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Cupons de Parceiros</h2>
      {isLoading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : coupons.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg text-muted-foreground">
          Nenhum cupom de parceiro encontrado.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
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
                  <td className="py-3">
                    <code className="bg-gray-100 px-2 py-1 rounded font-mono">{coupon.code}</code>
                  </td>
                  <td className="py-3">
                    {coupon.partners?.full_name || coupon.partners?.email || coupon.partner_id}
                  </td>
                  <td className="py-3">{coupon.discount_percent}%</td>
                  <td className="py-3">{coupon.commission_percent}%</td>
                  <td className="py-3">
                    {coupon.is_active ? (
                      <Badge variant="outline" className="bg-green-100 text-green-800">Ativo</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-100 text-red-800">Inativo</Badge>
                    )}
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleCopyCode(coupon.code)}
                      >
                        Copiar
                      </Button>
                      <Switch 
                        checked={coupon.is_active} 
                        onCheckedChange={() => handleToggleActive(coupon)}
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
