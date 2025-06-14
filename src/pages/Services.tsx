
import React from 'react';
import Layout from '@/components/Layout';
import BrandManifesto from '@/components/services/BrandManifesto';
import KolibraMethod from '@/components/services/KolibraMethod';
import DigitalPresenceSlices from '@/components/services/DigitalPresenceSlices';
import ServicePackageCard from '@/components/services/ServicePackageCard';

const servicePackages = [
  {
    title: "Kolibra Visível – Presença Local",
    icon: "📍",
    description: "Aumente sua visibilidade no Google, redes sociais e canais locais.",
    included: [
      "Google Meu Negócio otimizado",
      "Perfil no Instagram e WhatsApp",
      "Link integrado de catálogo e contatos"
    ],
    result: "Mais visibilidade e clientes."
  },
  {
    title: "Kolibra Rebrand – Identidade",
    icon: "🎨",
    description: "Criação ou reformulação completa da identidade da marca.",
    included: [
      "Logo e identidade visual",
      "Manual da marca e tom de voz",
      "Templates redes sociais",
      "Manifesto e essência"
    ],
    result: "Marca memorável e profissional."
  },
  {
    title: "Kolibra Express Site – Site/Loja Virtual",
    icon: "🌐",
    description: "Sites institucionais ou lojas prontas com plataforma amigável.",
    included: [
      "Site ou loja NuvemShop",
      "Integração redes sociais e pagamentos",
      "Layout exclusivo",
      "Domínio & treinamento"
    ],
    result: "Presença digital autônoma e funcional."
  },
  {
    title: "Kolibra Conteúdo – Estratégia",
    icon: "📝",
    description: "Conteúdo profissional e estratégico para redes sociais.",
    included: [
      "Posts feed e stories",
      "Roteiro para reels/carrosséis",
      "Planejamento mensal de conteúdo"
    ],
    result: "Crescimento orgânico e visibilidade constante."
  },
  {
    title: "Kolibra Reels Studio / Foto",
    icon: "🎬",
    description: "Produção audiovisual profissional (vídeo e foto).",
    included: [
      "Gravação e edição de reels",
      "Sessão de fotos profissional",
      "Tratamento de imagens"
    ],
    result: "Vídeos e imagens que conectam e convertem."
  },
  {
    title: "Kolibra Social Sales – Tráfego e Vendas",
    icon: "📱",
    description: "Estratégias para vendas diretas em redes sociais.",
    included: [
      "Catálogo de produtos integrado",
      "Estratégias de funil digital",
      "Otimização de rotas de compra/bio"
    ],
    result: "Mais vendas e funil eficiente Instagram/Facebook."
  }
];

const Services = () => {
  return (
    <Layout>
      <section className="relative bg-gradient-to-br from-kolibra-blue/70 to-blue-100/60 py-14">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-4xl font-bold text-white mb-5">Serviços Kolibra Solutions</h1>
          <p className="text-xl text-white/90 mb-6">
            Soluções digitais estratégicas para impulsionar negócios de verdade. Conheça nossos pacotes criados para gerar resultados, clareza de marca e crescimento digital sustentável.
          </p>
        </div>
      </section>

      <BrandManifesto />
      <KolibraMethod />
      <DigitalPresenceSlices />

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Nossos Pacotes Estratégicos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicePackages.map((pkg) => (
              <ServicePackageCard
                key={pkg.title}
                title={pkg.title}
                icon={pkg.icon}
                description={pkg.description}
                included={pkg.included}
                result={pkg.result}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA contato/conversar será implementado na próxima etapa */}
    </Layout>
  );
};

export default Services;
