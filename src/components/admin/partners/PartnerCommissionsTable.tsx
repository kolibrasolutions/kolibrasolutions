
import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CommissionPaymentDialog } from './CommissionPaymentDialog';
import { updateCouponUseStatus } from '@/services/partners/couponService';

export const PartnerCommissionsTable = () => {
  const [selectedCommission, setSelectedCommission] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: commissions = [], isLoading } = useQuery({
    queryKey: ['partner-commissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coupon_uses')
        .select(`
          *,
          coupon:partner_coupons(
            code,
            partner:users!partner_coupons_partner_id_fkey(
              email,
              full_name
            )
          ),
          order:orders(
            id,
            total_price,
            created_at,
            status
          )
        `)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    },
  });

  const handleUpdateStatus = async (commissionId: string, status: 'pendente' | 'pago' | 'cancelado', paymentDate?: string) => {
    const success = await updateCouponUseStatus(commissionId, status, paymentDate);
    
    if (success) {
      queryClient.invalidateQueries({ queryKey: ['partner-commissions'] });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendente':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case 'pago':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Pago</Badge>;
      case 'cancelado':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);
  };

  const pendingCommissions = commissions.filter((c: any) => c.status === 'pendente');
  const paidCancelledCommissions = commissions.filter((c: any) => c.status !== 'pendente');

  return (
    <div className="space-y-6">
      <CommissionPaymentDialog 
        commission={selectedCommission}
        onClose={() => setSelectedCommission(null)}
        onMarkAsPaid={(paymentDate) => {
          if (selectedCommission) {
            handleUpdateStatus(selectedCommission.id, 'pago', paymentDate);
          }
          setSelectedCommission(null);
        }}
        onCancel={() => {
          if (selectedCommission) {
            handleUpdateStatus(selectedCommission.id, 'cancelado');
          }
          setSelectedCommission(null);
        }}
      />

      <div>
        <h2 className="text-xl font-bold mb-4">Comissões Pendentes</h2>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : pendingCommissions.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg text-muted-foreground">
            Não há comissões pendentes.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 font-medium text-muted-foreground">Data</th>
                  <th className="text-left py-3 font-medium text-muted-foreground">Parceiro</th>
                  <th className="text-left py-3 font-medium text-muted-foreground">Código</th>
                  <th className="text-left py-3 font-medium text-muted-foreground">Pedido</th>
                  <th className="text-left py-3 font-medium text-muted-foreground">Valor</th>
                  <th className="text-right py-3 font-medium text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {pendingCommissions.map((commission: any) => (
                  <tr key={commission.id} className="border-b">
                    <td className="py-3">
                      {commission.created_at 
                        ? format(new Date(commission.created_at), "dd/MM/yyyy", { locale: ptBR })
                        : "N/A"}
                    </td>
                    <td className="py-3">
                      {commission.coupon?.partner?.full_name || commission.coupon?.partner?.email || "N/A"}
                    </td>
                    <td className="py-3">
                      <code className="bg-gray-100 px-2 py-1 rounded font-mono">{commission.coupon?.code || "N/A"}</code>
                    </td>
                    <td className="py-3">#{commission.order_id}</td>
                    <td className="py-3">{formatCurrency(commission.commission_amount)}</td>
                    <td className="py-3 text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedCommission(commission)}
                      >
                        Gerenciar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Histórico de Comissões</h2>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : paidCancelledCommissions.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg text-muted-foreground">
            Não há histórico de comissões.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 font-medium text-muted-foreground">Data</th>
                  <th className="text-left py-3 font-medium text-muted-foreground">Pagamento</th>
                  <th className="text-left py-3 font-medium text-muted-foreground">Parceiro</th>
                  <th className="text-left py-3 font-medium text-muted-foreground">Pedido</th>
                  <th className="text-left py-3 font-medium text-muted-foreground">Valor</th>
                  <th className="text-left py-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-right py-3 font-medium text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {paidCancelledCommissions.map((commission: any) => (
                  <tr key={commission.id} className="border-b">
                    <td className="py-3">
                      {commission.created_at 
                        ? format(new Date(commission.created_at), "dd/MM/yyyy", { locale: ptBR })
                        : "N/A"}
                    </td>
                    <td className="py-3">
                      {commission.payment_date 
                        ? format(new Date(commission.payment_date), "dd/MM/yyyy", { locale: ptBR })
                        : "N/A"}
                    </td>
                    <td className="py-3">
                      {commission.coupon?.partner?.full_name || commission.coupon?.partner?.email || "N/A"}
                    </td>
                    <td className="py-3">#{commission.order_id}</td>
                    <td className="py-3">{formatCurrency(commission.commission_amount)}</td>
                    <td className="py-3">{getStatusBadge(commission.status)}</td>
                    <td className="py-3 text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedCommission(commission)}
                      >
                        Detalhes
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
