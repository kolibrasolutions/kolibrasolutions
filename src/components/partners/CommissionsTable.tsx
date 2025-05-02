
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCouponUses } from '@/services/partners/couponService';
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';

type CommissionsTableProps = {
  couponId: string | null;
};

export const CommissionsTable = ({ couponId }: CommissionsTableProps) => {
  const [uses, setUses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUses = async () => {
      setLoading(true);
      try {
        if (couponId) {
          const data = await getCouponUses(couponId);
          setUses(data);
        }
      } catch (error) {
        console.error("Erro ao buscar comissões:", error);
      } finally {
        setLoading(false);
      }
    };

    if (couponId) {
      fetchUses();
    } else {
      setLoading(false);
    }
  }, [couponId]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);
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
    <Card>
      <CardHeader>
        <CardTitle>Minhas Comissões</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : uses.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {couponId ? 
              "Você ainda não tem comissões registradas." : 
              "Você precisa de um código de cupom válido para visualizar comissões."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 font-medium text-muted-foreground">Data</th>
                  <th className="text-left py-3 font-medium text-muted-foreground">Pedido</th>
                  <th className="text-left py-3 font-medium text-muted-foreground">Valor Comissão</th>
                  <th className="text-left py-3 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {uses.map((use) => (
                  <tr key={use.id} className="border-b">
                    <td className="py-3">
                      {use.created_at ? format(new Date(use.created_at), "dd/MM/yyyy", { locale: ptBR }) : "N/A"}
                    </td>
                    <td className="py-3">#{use.order_id}</td>
                    <td className="py-3">{formatCurrency(use.commission_amount)}</td>
                    <td className="py-3">{getStatusBadge(use.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
