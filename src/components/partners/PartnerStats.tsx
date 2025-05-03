
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { getPartnerStats, getMonthlyCommissionStats, PartnerStats as PartnerStatsType } from '@/services/partners/dashboardService';
import { Skeleton } from '@/components/ui/skeleton';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  }).format(value);
};

type PartnerStatsProps = {
  partnerId: string;
};

export const PartnerStats = ({ partnerId }: PartnerStatsProps) => {
  const [stats, setStats] = useState<PartnerStatsType | null>(null);
  const [monthlyData, setMonthlyData] = useState<{ month: string; commission: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const statsData = await getPartnerStats(partnerId);
        const monthlyStats = await getMonthlyCommissionStats(partnerId);
        
        setStats(statsData);
        setMonthlyData(monthlyStats);
      } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
      } finally {
        setLoading(false);
      }
    };

    if (partnerId) {
      fetchData();
    }
  }, [partnerId]);

  const formatMonthName = (monthYear: string) => {
    const [year, month] = monthYear.split('-');
    
    const monthNames = [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ];
    
    return `${monthNames[parseInt(month) - 1]}/${year.substring(2)}`;
  };
  
  const formattedMonthlyData = monthlyData.map(item => ({
    ...item,
    name: formatMonthName(item.month)
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-lg border border-indigo-100">
                  <div className="text-sm text-gray-500 mb-1">Total em Comissões</div>
                  <div className="text-2xl font-bold text-indigo-600">{formatCurrency(stats?.totalCommission || 0)}</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100">
                  <div className="text-sm text-gray-500 mb-1">Comissões Pagas</div>
                  <div className="text-2xl font-bold text-green-600">{formatCurrency(stats?.paidCommission || 0)}</div>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-4 rounded-lg border border-amber-100">
                  <div className="text-sm text-gray-500 mb-1">Comissões Pendentes</div>
                  <div className="text-2xl font-bold text-amber-600">{formatCurrency(stats?.pendingCommission || 0)}</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 p-4 rounded-lg border border-purple-100">
                  <div className="text-sm text-gray-500 mb-1">Total de Vendas</div>
                  <div className="text-2xl font-bold text-purple-600">{stats?.totalOrders || 0}</div>
                </div>
              </div>
              
              {monthlyData.length > 0 && (
                <div className="mt-8 pt-4 border-t">
                  <h3 className="text-lg font-medium mb-4">Comissões por Mês</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={formattedMonthlyData}
                        margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis 
                          tickFormatter={(value) => `R$${value}`}
                        />
                        <Tooltip 
                          formatter={(value) => formatCurrency(Number(value))}
                        />
                        <Legend />
                        <Bar dataKey="commission" name="Comissão" fill="#4f46e5" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
