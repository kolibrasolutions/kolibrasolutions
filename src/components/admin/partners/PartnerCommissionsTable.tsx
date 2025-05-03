
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPartnerCommissions } from '@/services/admin/partnersManagement';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CommissionPaymentDialog } from './CommissionPaymentDialog';

interface PartnerCommissionsTableProps {
  couponId?: string;
}

export const PartnerCommissionsTable: React.FC<PartnerCommissionsTableProps> = ({ couponId }) => {
  const [selectedCommission, setSelectedCommission] = useState(null);
  
  const { data: commissions = [], isLoading } = useQuery({
    queryKey: ['partner-commissions', couponId],
    queryFn: getPartnerCommissions,
  });

  // Filtra por couponId se fornecido
  const filteredCommissions = couponId 
    ? commissions.filter(commission => commission.coupon_id === couponId)
    : commissions;

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pendente':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case 'pago':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Pago</Badge>;
      case 'cancelado':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status || 'Desconhecido'}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (filteredCommissions.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg text-muted-foreground">
        {couponId 
          ? "Não há comissões registradas para este cupom." 
          : "Não há comissões registradas."}
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 font-medium text-muted-foreground">Data</th>
              <th className="text-left py-3 font-medium text-muted-foreground">Cupom</th>
              <th className="text-left py-3 font-medium text-muted-foreground">Parceiro</th>
              <th className="text-left py-3 font-medium text-muted-foreground">Comissão</th>
              <th className="text-left py-3 font-medium text-muted-foreground">Status</th>
              <th className="text-right py-3 font-medium text-muted-foreground">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredCommissions.map((commission) => (
              <tr key={commission.id} className="border-b">
                <td className="py-3">
                  {commission.created_at 
                    ? format(new Date(commission.created_at), "dd/MM/yyyy", { locale: ptBR })
                    : "N/A"}
                </td>
                <td className="py-3">{commission.coupon?.code || "N/A"}</td>
                <td className="py-3">{commission.coupon?.partner?.email || "N/A"}</td>
                <td className="py-3">
                  {Number(commission.commission_amount).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </td>
                <td className="py-3">{getStatusBadge(commission.status)}</td>
                <td className="py-3 text-right">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedCommission(commission)}
                    disabled={commission.status.toLowerCase() !== 'pendente'}
                  >
                    Gerenciar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedCommission && (
        <CommissionPaymentDialog
          commission={selectedCommission}
          open={!!selectedCommission}
          onOpenChange={(open) => {
            if (!open) setSelectedCommission(null);
          }}
        />
      )}
    </>
  );
};
