
import React from 'react';
import { useProjectStats } from '@/hooks/useProjectStats';
import { Award, Package, Star } from 'lucide-react';

const StatsCounter = () => {
  const { stats, loading } = useProjectStats();
  
  const statItems = [
    {
      icon: <Package className="h-8 w-8 text-kolibra-orange" />,
      value: stats.totalProjects,
      label: 'Projetos Entregues',
      isLoading: loading,
      isEmpty: stats.totalProjects === 0
    },
    {
      icon: <Award className="h-8 w-8 text-kolibra-orange" />,
      value: stats.satisfactionRate,
      label: 'Satisfação dos Clientes',
      suffix: '%',
      isLoading: loading,
      isEmpty: !stats.hasRatings
    },
    {
      icon: <Star className="h-8 w-8 text-kolibra-orange" />,
      value: stats.averageRating,
      label: 'Avaliação Média',
      suffix: '/5',
      isLoading: loading,
      isEmpty: !stats.hasRatings
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
      {statItems.map((item, index) => (
        <div key={index} className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-lg">
            {item.icon}
          </div>
          <div>
            <div className="text-2xl font-bold text-white">
              {item.isLoading ? (
                <div className="h-8 w-16 bg-white/20 rounded animate-pulse"></div>
              ) : item.isEmpty ? (
                <span className="text-white/60 text-lg">
                  {index === 0 ? '0' : 'Sem dados'}
                </span>
              ) : (
                <>
                  {item.value}{item.suffix || ''}
                </>
              )}
            </div>
            <div className="text-white/80 text-sm">{item.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCounter;
