
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { BecomePartnerForm } from '@/components/partners/BecomePartnerForm';
import { ApplicationStatus } from '@/components/partners/ApplicationStatus';
import { useAuth } from '@/hooks/useAuth';

const BecomePartner = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login?returnUrl=/parceiros');
      return;
    }

    if (!isLoading && user?.role === 'partner') {
      navigate('/parceiro/dashboard');
      return;
    }
  }, [user, isLoading, navigate]);

  const handleApplicationSuccess = () => {
    setHasApplied(true);
  };

  if (isLoading) {
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
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-3">Programa de Parceiros Kolibra</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Torne-se um parceiro Kolibra e ganhe comissões por indicar clientes para nossos serviços.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">Como funciona</h2>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="bg-green-100 text-green-700 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Envie sua solicitação</p>
                    <p className="text-gray-600 text-sm">Preencha o formulário com suas informações e experiência.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="bg-green-100 text-green-700 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Receba seu código promocional</p>
                    <p className="text-gray-600 text-sm">Após aprovação, você receberá um código de cupom exclusivo.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="bg-green-100 text-green-700 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Compartilhe com seus contatos</p>
                    <p className="text-gray-600 text-sm">Divulgue seu código para clientes potenciais.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="bg-green-100 text-green-700 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                    4
                  </div>
                  <div>
                    <p className="font-medium">Receba comissões</p>
                    <p className="text-gray-600 text-sm">Ganhe comissões para cada venda realizada com seu código.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Benefícios do programa</h2>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Comissões de 10% sobre o valor total das vendas realizadas
                </li>
                <li className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Dashboard exclusivo para acompanhamento de vendas e comissões
                </li>
                <li className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Seus indicados recebem 10% de desconto em qualquer serviço
                </li>
                <li className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Pagamento mensal das comissões acumuladas
                </li>
              </ul>
            </div>
          </div>

          <div>
            {user?.id && hasApplied ? (
              <ApplicationStatus userId={user.id} />
            ) : (
              <BecomePartnerForm onSuccess={handleApplicationSuccess} />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BecomePartner;
