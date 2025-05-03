
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPartnerCoupons } from '@/services/admin/partnersManagement';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface PartnerCouponsTableProps {
  onSelectCoupon?: (couponId: string) => void;
}

export const PartnerCouponsTable: React.FC<PartnerCouponsTableProps> = ({ onSelectCoupon }) => {
  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ['partner-coupons'],
    queryFn: getPartnerCoupons,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (coupons.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg text-muted-foreground">
        Não há cupons de parceiros registrados.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Parceiro</TableHead>
            <TableHead>Desconto</TableHead>
            <TableHead>Comissão</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coupons.map((coupon) => (
            <TableRow key={coupon.id}>
              <TableCell className="font-medium">{coupon.code}</TableCell>
              <TableCell>{coupon.partner?.full_name || coupon.partner?.email || "N/A"}</TableCell>
              <TableCell>{coupon.discount_percent}%</TableCell>
              <TableCell>{coupon.commission_percent}%</TableCell>
              <TableCell>
                {coupon.is_active ? 
                  <Badge variant="outline" className="bg-green-100 text-green-800">Ativo</Badge> : 
                  <Badge variant="outline" className="bg-red-100 text-red-800">Inativo</Badge>
                }
              </TableCell>
              <TableCell className="text-right">
                {onSelectCoupon && (
                  <Button 
                    onClick={() => onSelectCoupon(coupon.id)} 
                    variant="outline" 
                    size="sm"
                  >
                    Ver comissões
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
