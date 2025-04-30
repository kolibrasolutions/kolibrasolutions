
import React from 'react';
import { Button } from '@/components/ui/button';

const FeaturedBanner = () => {
  return (
    <div className="bg-gradient-to-r from-kolibra-blue to-blue-700 text-white p-8 rounded-lg mb-12 shadow-lg">
      <h2 className="text-2xl font-bold mb-2">KOLIBRA FINANCE</h2>
      <p className="mb-4">Soluções financeiras SaaS para gestão completa do seu negócio.</p>
      <Button className="bg-kolibra-orange hover:bg-amber-500 text-white">
        Conhecer Planos
      </Button>
    </div>
  );
};

export default FeaturedBanner;
