
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { getPartnerCoupon } from '@/services/partners/couponService';
import { PartnerCouponCard } from '@/components/partners/PartnerCouponCard';
import { PartnerStats } from '@/components/partners/PartnerStats';
import { CommissionsTable } from '@/components/partners/CommissionsTable';

const PartnerDashboard = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [couponId, setCouponId] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login?returnUrl=/parceiro/dashboard');
      return;
    }

    if (!isLoading && user && user.role !== 'partner') {
      navigate('/parceiros');
      return;
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    const fetchCouponId = async () => {
      if (user?.id) {
        try {
          const coupon = await getPartnerCoupon(user.id);
          if (coupon) {
            setCouponId(coupon.id);
          }
        } catch (error) {
          console.error("Erro ao buscar cupom:", error);
        }
      }
    };

    if (user?.id) {
      fetchCouponId();
    }
  }, [user]);

  if (isLoading || !user) {
    return (
      <Layout>
        <div className="container mx-auto py-12 px-4">
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Painel do Parceiro</h1>

        <div className="space-y-8">
          <PartnerStats partnerId={user.id} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PartnerCouponCard partnerId={user.id} />
            
            <div className="flex flex-col space-y-6">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-6 text-white">
                <h2 className="text-xl font-bold mb-2">Como funciona o programa</h2>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Compartilhe seu código exclusivo com clientes potenciais</li>
                  <li>Quando eles realizarem uma compra usando seu código, receberão 10% de desconto</li>
                  <li>Você receberá 10% de comissão sobre o valor total da compra</li>
                  <li>As comissões serão pagas mensalmente para compras já finalizadas</li>
                </ol>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <h2 className="text-lg font-medium flex items-center gap-2 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                  Importante
                </h2>
                <p className="text-sm text-amber-800">As comissões são processadas apenas para pedidos que foram concluídos e pagos integralmente. Em caso de cancelamento ou reembolso, a comissão será cancelada automaticamente.</p>
              </div>
            </div>
          </div>

          <CommissionsTable couponId={couponId} />
        </div>
      </div>
    </Layout>
  );
};

export default PartnerDashboard;
