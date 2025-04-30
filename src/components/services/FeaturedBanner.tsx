
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const FeaturedBanner = () => {
  return (
    <div className="bg-gradient-to-r from-kolibra-blue to-blue-700 text-white p-8 rounded-lg mb-12 shadow-lg">
      <h2 className="text-2xl font-bold mb-2">KOLIBRA FINANCE</h2>
      <p className="mb-4">Soluções financeiras SaaS para gestão completa do seu negócio.</p>
      <p className="mb-4 text-sm bg-white/10 p-2 rounded">
        <strong>Pagamento em 2x:</strong> 20% na aprovação do pedido e 80% na entrega final.
      </p>
      <Link to="/servicos">
        <Button className="bg-kolibra-orange hover:bg-amber-500 text-white">
          Conhecer Planos
        </Button>
      </Link>
    </div>
  );
};

export default FeaturedBanner;
