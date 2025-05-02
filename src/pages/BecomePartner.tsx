
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { BecomePartnerForm } from '@/components/partners/BecomePartnerForm';
import { ApplicationStatus } from '@/components/partners/ApplicationStatus';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const BecomePartner = () => {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login?returnUrl=/parceiros');
    }
  }, [user, isLoading, navigate]);

  const handleSuccessfulApplication = () => {
    setHasApplied(true);
  };

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

  if (user?.role === 'partner') {
    return (
      <Layout>
        <div className="container mx-auto py-12 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-6">Você já é um Parceiro Kolibra!</h1>
            <p className="text-lg mb-8">
              Você já é um parceiro aprovado da Kolibra Solutions. Acesse seu painel para gerenciar suas indicações e comissões.
            </p>
            <Button asChild size="lg">
              <Link to="/parceiro/dashboard">Acessar Meu Painel</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-center">Programa de Parceiros Kolibra</h1>
          <p className="text-lg mb-8 text-center text-muted-foreground">
            Indique clientes e ganhe comissões por cada venda realizada
          </p>

          <div className="bg-blue-50 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">Benefícios do Programa</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded shadow-sm">
                <h3 className="font-medium mb-2">Comissão de 10%</h3>
                <p className="text-sm text-gray-600">Receba 10% de comissão sobre o valor total de cada venda gerada por sua indicação</p>
              </div>
              <div className="bg-white p-4 rounded shadow-sm">
                <h3 className="font-medium mb-2">Benefício para seus clientes</h3>
                <p className="text-sm text-gray-600">Seus indicados também recebem 10% de desconto ao usar seu código</p>
              </div>
              <div className="bg-white p-4 rounded shadow-sm">
                <h3 className="font-medium mb-2">Dashboard exclusivo</h3>
                <p className="text-sm text-gray-600">Acompanhe suas indicações, vendas e comissões através de um painel exclusivo</p>
              </div>
              <div className="bg-white p-4 rounded shadow-sm">
                <h3 className="font-medium mb-2">Código personalizado</h3>
                <p className="text-sm text-gray-600">Receba um código de cupom personalizado para facilitar suas indicações</p>
              </div>
            </div>
          </div>

          {hasApplied ? (
            <ApplicationStatus userId={user.id} />
          ) : (
            <BecomePartnerForm onSuccess={handleSuccessfulApplication} />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BecomePartner;
