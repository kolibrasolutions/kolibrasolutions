import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { ServiceRequestDialog, ServiceRequestData } from '@/components/services/ServiceRequestDialog';
import { submitServiceRequest } from '@/services/serviceRequestService';
import { ServicePackage } from '@/types/orders';

const servicePackages: ServicePackage[] = [
  {
    id: 1,
    name: "Kolibra Visível – Presença Local",
    description: "Aumente sua visibilidade no Google, redes sociais e canais locais.",
    category: "Presença Digital",
    is_package: true,
    package_items: [
      "Google Meu Negócio otimizado",
      "Perfil no Instagram e WhatsApp",
      "Link integrado de catálogo e contatos"
    ],
    estimated_delivery_days: 10,
    is_active: true,
    price: null
  },
  {
    id: 2,
    name: "Kolibra Rebrand – Identidade",
    description: "Criação ou reformulação completa da identidade da marca.",
    category: "Identidade Visual",
    is_package: true,
    package_items: [
      "Logo e identidade visual",
      "Manual da marca e tom de voz",
      "Templates redes sociais",
      "Manifesto e essência"
    ],
    estimated_delivery_days: 15,
    is_active: true,
    price: null
  },
  {
    id: 3,
    name: "Kolibra Express Site – Site/Loja Virtual",
    description: "Sites institucionais ou lojas prontas com plataforma amigável.",
    category: "Sites e E-commerce",
    is_package: true,
    package_items: [
      "Site ou loja NuvemShop",
      "Integração redes sociais e pagamentos",
      "Layout exclusivo",
      "Domínio & treinamento"
    ],
    estimated_delivery_days: 20,
    is_active: true,
    price: null
  },
  {
    id: 4,
    name: "Kolibra Conteúdo – Estratégia",
    description: "Conteúdo profissional e estratégico para redes sociais.",
    category: "Marketing de Conteúdo",
    is_package: true,
    package_items: [
      "Posts feed e stories",
      "Roteiro para reels/carrosséis",
      "Planejamento mensal de conteúdo"
    ],
    estimated_delivery_days: 7,
    is_active: true,
    price: null
  },
  {
    id: 5,
    name: "Kolibra Reels Studio / Foto",
    description: "Produção audiovisual profissional (vídeo e foto).",
    category: "Produção Audiovisual",
    is_package: true,
    package_items: [
      "Gravação e edição de reels",
      "Sessão de fotos profissional",
      "Tratamento de imagens"
    ],
    estimated_delivery_days: 5,
    is_active: true,
    price: null
  },
  {
    id: 6,
    name: "Kolibra Social Sales – Tráfego e Vendas",
    description: "Estratégias para vendas diretas em redes sociais.",
    category: "Vendas e Conversão",
    is_package: true,
    package_items: [
      "Catálogo de produtos integrado",
      "Estratégias de funil digital",
      "Otimização de rotas de compra/bio"
    ],
    estimated_delivery_days: 12,
    is_active: true,
    price: null
  }
];

const Services = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<ServicePackage | null>(null);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);

  const handleServiceRequest = (service: ServicePackage) => {
    if (!user) {
      navigate('/login?returnUrl=/servicos');
      return;
    }
    
    setSelectedService(service);
    setRequestDialogOpen(true);
  };

  const handleSubmitRequest = async (requestData: ServiceRequestData) => {
    if (!user) return;
    
    const success = await submitServiceRequest(requestData, user.id);
    if (success) {
      setRequestDialogOpen(false);
      setSelectedService(null);
    }
  };

  return (
    <Layout>
      <section className="relative bg-gradient-to-br from-kolibra-blue/70 to-blue-100/60 py-14">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-4xl font-bold text-white mb-5">Serviços Kolibra Solutions</h1>
          <p className="text-xl text-white/90 mb-6">
            Soluções digitais estratégicas para impulsionar negócios de verdade. Conheça nossos pacotes criados para gerar resultados, clareza de marca e crescimento digital sustentável.
          </p>
          <div className="flex flex-col items-center gap-4 mt-6">
            <a href="/metodo" className="inline-block text-kolibra-orange underline font-semibold hover:text-white transition">
              Veja nosso método
            </a>
            <a href="/sobre" className="inline-block text-kolibra-orange underline font-semibold hover:text-white transition">
              Sobre a Kolibra
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Nossos Pacotes Estratégicos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicePackages.map((pkg) => (
              <div key={pkg.id} className="bg-gray-50 rounded-xl shadow-md p-8 flex flex-col h-full transition-all duration-300 ease-out transform hover:scale-105 hover:shadow-2xl hover:-translate-y-2 hover:bg-white group animate-fade-in">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-kolibra-blue transition-colors duration-300">
                    {pkg.name}
                  </h3>
                </div>
                <p className="text-gray-600 mb-4 group-hover:text-gray-700 transition-colors duration-300">
                  {pkg.description}
                </p>
                <ul className="text-sm text-gray-700 mb-4 list-disc list-inside space-y-1">
                  {pkg.package_items?.map((item, index) => (
                    <li key={index} className="transform transition-all duration-300 hover:translate-x-1 hover:text-kolibra-blue">
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto mb-4 font-semibold text-kolibra-blue group-hover:text-kolibra-orange transition-colors duration-300 transform group-hover:scale-105">
                  {pkg.estimated_delivery_days && `Prazo estimado: ${pkg.estimated_delivery_days} dias`}
                </div>
                <button 
                  onClick={() => handleServiceRequest(pkg)}
                  disabled={!user}
                  className={`w-full px-4 py-2 rounded-md font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg
                    ${!user 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'border-2 border-kolibra-orange text-kolibra-orange hover:bg-kolibra-orange hover:text-white'
                    }`}
                >
                  {user ? 'Solicitar Orçamento' : 'Faça Login para Solicitar'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Request Dialog */}
      <ServiceRequestDialog
        service={selectedService}
        open={requestDialogOpen}
        onOpenChange={setRequestDialogOpen}
        onSubmit={handleSubmitRequest}
      />
    </Layout>
  );
};

export default Services;
