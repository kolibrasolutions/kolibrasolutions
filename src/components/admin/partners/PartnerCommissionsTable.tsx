
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPartnerCommissions } from '@/services/admin/partnersManagement';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CommissionPaymentDialog } from './CommissionPaymentDialog';

export const PartnerCommissionsTable = () => {
  const [selectedCommission, setSelectedCommission] = useState<any | null>(null);
  
  const { data: commissions = [], isLoading, refetch } = useQuery({
    queryKey: ['partner-commissions'],
    queryFn: getPartnerCommissions,
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);
  };

  const handlePaymentComplete = () => {
    refetch();
    setSelectedCommission(null);
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

  return (
    <div className="space-y-4">
      {selectedCommission && (
        <CommissionPaymentDialog
          commission={selectedCommission}
          open={!!selectedCommission}
          onOpenChange={(open) => {
            if (!open) setSelectedCommission(null);
          }}
          onPaymentComplete={handlePaymentComplete}
        />
      )}

      {isLoading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : commissions.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg text-muted-foreground">
          Não há comissões de parceiros registradas.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 font-medium text-muted-foreground">Data</th>
                <th className="text-left py-3 font-medium text-muted-foreground">Parceiro</th>
                <th className="text-left py-3 font-medium text-muted-foreground">Código</th>
                <th className="text-left py-3 font-medium text-muted-foreground">Pedido</th>
                <th className="text-left py-3 font-medium text-muted-foreground">Valor</th>
                <th className="text-left py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-right py-3 font-medium text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {commissions.map((commission: any) => (
                <tr key={commission.id} className="border-b">
                  <td className="py-3">
                    {commission.created_at 
                      ? format(new Date(commission.created_at), "dd/MM/yyyy", { locale: ptBR })
                      : "N/A"}
                  </td>
                  <td className="py-3">{commission.coupon?.partner?.full_name || commission.coupon?.partner?.email || 'N/A'}</td>
                  <td className="py-3 font-mono text-sm">{commission.coupon?.code || 'N/A'}</td>
                  <td className="py-3">#{commission.order_id}</td>
                  <td className="py-3">{formatCurrency(commission.commission_amount)}</td>
                  <td className="py-3">{getStatusBadge(commission.status)}</td>
                  <td className="py-3 text-right">
                    <div className="flex justify-end gap-2">
                      {commission.status === 'pendente' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedCommission(commission)}
                        >
                          Processar
                        </Button>
                      )}
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
