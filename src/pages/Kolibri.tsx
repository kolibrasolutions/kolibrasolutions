
import React from 'react';
import Layout from '@/components/Layout';
import KolibriChat from '@/components/kolibri/KolibriChat';

const Kolibri = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-kolibra-blue mb-4">
              Kolibri - Autodiagnóstico Empresarial
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Descubra como sua empresa pode voar ainda mais alto! Nossa IA Kolibri irá guiá-lo através de um autodiagnóstico completo, analisando as 6 Fatias Essenciais do seu negócio digital.
            </p>
          </div>
          
          <div className="flex justify-center">
            <KolibriChat />
          </div>
          
          <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-kolibra-blue mb-6 text-center">
              As 6 Fatias Essenciais que a Kolibri Analisa
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-kolibra-orange rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                  🎨
                </div>
                <h3 className="font-bold text-lg mb-2">Visual</h3>
                <p className="text-gray-600 text-sm">Identidade visual, design e consistência da marca</p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-kolibra-orange rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                  💬
                </div>
                <h3 className="font-bold text-lg mb-2">Comunicação</h3>
                <p className="text-gray-600 text-sm">Mensagem clara e consistente em todos os canais</p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-kolibra-orange rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                  📱
                </div>
                <h3 className="font-bold text-lg mb-2">Canal</h3>
                <p className="text-gray-600 text-sm">Presença digital nos canais certos</p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-kolibra-orange rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                  🎯
                </div>
                <h3 className="font-bold text-lg mb-2">Funil</h3>
                <p className="text-gray-600 text-sm">Estratégia de atração e conversão de clientes</p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-kolibra-orange rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                  📦
                </div>
                <h3 className="font-bold text-lg mb-2">Produto/Serviço</h3>
                <p className="text-gray-600 text-sm">Apresentação clara dos seus diferenciais</p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-kolibra-orange rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                  🤝
                </div>
                <h3 className="font-bold text-lg mb-2">Suporte/Atendimento</h3>
                <p className="text-gray-600 text-sm">Atendimento digital eficiente e humanizado</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Kolibri;
