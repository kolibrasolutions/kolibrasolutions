import React from 'react';

const FeaturedSolutions = () => {
  return (
    <div className="py-12">
      <h2 className="text-3xl font-bold text-center mb-12">Nossas Soluções em Destaque</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <img src="/pencil.png" alt="Branding Profissional" className="w-24 h-24 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Branding Profissional</h3>
          <p className="text-gray-600">Crie uma identidade visual única e memorável que comunica a essência da sua marca.</p>
          <a href="#" className="text-kolibra-orange hover:text-amber-500 mt-4 inline-block">Saiba mais →</a>
        </div>

        <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <img src="/computer.png" alt="Web Design Responsivo" className="w-24 h-24 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Web Design Responsivo</h3>
          <p className="text-gray-600">Sites modernos e funcionais que proporcionam a melhor experiência em qualquer dispositivo.</p>
          <a href="#" className="text-kolibra-orange hover:text-amber-500 mt-4 inline-block">Saiba mais →</a>
        </div>

        <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <img src="/megaphone.png" alt="Marketing Digital" className="w-24 h-24 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Marketing Digital</h3>
          <p className="text-gray-600">Estratégias personalizadas para alcançar seu público-alvo e converter visitantes em clientes.</p>
          <a href="#" className="text-kolibra-orange hover:text-amber-500 mt-4 inline-block">Saiba mais →</a>
        </div>
      </div>
    </div>
  );
};

export default FeaturedSolutions; 