
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { getPartnerStats, PartnerStats as StatsType } from '@/services/partners/dashboardService';
import { Wallet, Package, Tag, ArrowUpRight } from 'lucide-react';

type PartnerStatsProps = {
  partnerId: string;
};

export const PartnerStats = ({ partnerId }: PartnerStatsProps) => {
  const [stats, setStats] = useState<StatsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const data = await getPartnerStats(partnerId);
        setStats(data);
      } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
      } finally {
        setLoading(false);
      }
    };

    if (partnerId) {
      fetchStats();
    }
  }, [partnerId]);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-4 text-muted-foreground">
            Não foi possível carregar as estatísticas.
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Wallet size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Comissão Pendente</p>
              <h3 className="text-2xl font-semibold">{formatCurrency(stats.pendingCommission)}</h3>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <ArrowUpRight size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Comissão Paga</p>
              <h3 className="text-2xl font-semibold">{formatCurrency(stats.paidCommission)}</h3>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Package size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total de Pedidos</p>
              <h3 className="text-2xl font-semibold">{stats.totalOrders}</h3>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Tag size={24} className="text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Usos do Cupom</p>
              <h3 className="text-2xl font-semibold">{stats.totalCouponUses}</h3>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
