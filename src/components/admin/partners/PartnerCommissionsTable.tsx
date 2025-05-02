import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getCouponUses, updateCouponUseStatus } from '@/services/partners/couponService';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { CommissionPaymentDialog } from './CommissionPaymentDialog';
import { ptBR } from 'date-fns/locale';

type CommissionsProp = {
  couponId: string;
};

export const PartnerCommissionsTable = ({ couponId }: CommissionsProp) => {
  const queryClient = useQueryClient();
  const [selectedCommission, setSelectedCommission] = useState<any>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  const { data: commissions = [], isLoading } = useQuery({
    queryKey: ['partner-commissions', couponId],
    queryFn: () => getCouponUses(couponId),
    enabled: !!couponId,
  });

  const handlePayCommission = async (commissionId: string) => {
    const success = await updateCouponUseStatus(commissionId, 'pago');
    
    if (success) {
      queryClient.invalidateQueries({ queryKey: ['partner-commissions', couponId] });
      setShowPaymentDialog(false);
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

  return (
    <div>
      <CommissionPaymentDialog
        isOpen={showPaymentDialog}
        commission={selectedCommission}
        onClose={() => {
          setShowPaymentDialog(false);
          setSelectedCommission(null);
        }}
        onPayment={() => {
          if (selectedCommission) {
            handlePayCommission(selectedCommission.id);
          }
        }}
      />

      {isLoading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : commissions.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg text-muted-foreground">
          Nenhuma comissão registrada ainda.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 font-medium text-muted-foreground">Data</th>
                <th className="text-left py-3 font-medium text-muted-foreground">Serviço</th>
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
                  <td className="py-3">{commission.service_id}</td>
                  <td className="py-3">R$ {commission.commission_amount}</td>
                  <td className="py-3">{getStatusBadge(commission.status)}</td>
                  <td className="py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedCommission(commission);
                          setShowPaymentDialog(true);
                        }}
                        disabled={commission.status === 'pago'}
                      >
                        Pagar
                      </Button>
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
