import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { ChevronRight } from 'lucide-react';
import StatsCounter from '@/components/home/StatsCounter';
import TestimonialsSlider from '@/components/home/TestimonialsSlider';
import KolibriWidget from '@/components/kolibri/KolibriWidget';
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import BrandManifesto from '@/components/services/BrandManifesto';
import KolibraMethod from '@/components/services/KolibraMethod';
import ServicePackageCard from '@/components/services/ServicePackageCard';

const Home = () => {
  return (
    <>
      <Layout>
        {/* Hero Section com novo manifesto */}
        <section className="relative py-0">
          <BackgroundGradientAnimation>
            <div className="relative z-10 container mx-auto px-4 min-h-screen flex flex-col justify-center">
              <div className="flex flex-col md:flex-row items-center md:items-start md:justify-between w-full min-h-screen">
                <div className="max-w-3xl mb-10 pt-16 md:pt-24 flex-1 flex flex-col justify-center md:mb-0 md:pt-20">
                  <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-lg">
                    Eleve o seu negócio no digital <br className="hidden md:inline"/> com a Kolibra Solutions
                  </h1>
                  <p className="text-xl mb-6 text-white/90 drop-shadow">
                    Simplificamos a jornada digital de pequenos negócios, autônomos e marcas locais com estratégia, design e tecnologia – tudo sob medida.
                  </p>
                  <p className="text-2xl font-bold mb-8 text-kolibra-orange drop-shadow">
                    Toda empresa merece voar alto.
                  </p>
                  <Link to="/servicos">
                    <Button className="bg-kolibra-orange hover:bg-amber-500 text-white text-lg px-8 py-6 shadow-xl">
                      Vamos voar alto juntos <ChevronRight className="ml-1" />
                    </Button>
                  </Link>
                </div>
                {/* StatsCounter em coluna ao lado (desktop) ou abaixo (mobile) */}
                <div className="flex-1 w-full md:w-2/5 flex flex-col items-center md:items-end justify-end md:justify-center md:pl-8 mt-10 md:mt-0">
                  <StatsCounter />
                </div>
              </div>
            </div>
          </BackgroundGradientAnimation>
        </section>

        {/* Nova seção de destaque para pacotes principais */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-kolibra-blue">Soluções Sob Medida Para Sua Jornada</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Cards dos principais pacotes */}
              <ServicePackageCard
                title="Kolibra Rebrand"
                icon="🎨"
                description="Reposicione sua marca com identidade visual, branding, manual e templates prontos."
                included={[
                  "Logo & identidade visual",
                  "Manual da marca & tom de voz",
                  "Templates para redes sociais",
                  "Manifesto e essência"
                ]}
                result="Uma marca memorável e profissional."
              />
              <ServicePackageCard
                title="Kolibra Express Site"
                icon="🌐"
                description="Site institucional ou loja virtual pronta para você vender e ser encontrado."
                included={[
                  "Site ou loja NuvemShop",
                  "Integração redes sociais e pagamentos",
                  "Layout exclusivo",
                  "Domínio & treinamento"
                ]}
                result="Presença digital autônoma e funcional."
              />
              <ServicePackageCard
                title="Kolibra Social Sales"
                icon="📱"
                description="Transforme suas redes sociais em um verdadeiro canal de vendas automatizado."
                included={[
                  "Catálogo de produtos integrado",
                  "Funil digital: atração → conversão",
                  "Bio e rotas de compra otimizadas"
                ]}
                result="Mais vendas diretamente do Instagram & Facebook."
              />
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                <img 
                  src="/lovable-uploads/210b6771-d8f7-47af-b4dd-7dbbeddc1f0f.png"
                  alt="KOLIBRA Beija-flor"
                  className="rounded-lg shadow-md w-full h-auto object-contain"
                />
              </div>
              
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold text-kolibra-blue mb-6">Sobre Nós</h2>
                <p className="text-gray-700 mb-6">
                  O fundador da KOLIBRA SOLUTIONS desenhou seu primeiro logotipo em 2009, mas esbarrou na escassez de recursos tecnológicos da época. Ao longo dos anos, acumulou know-how em design e gestão de negócios — e percebeu que muitos empreendedores enfrentam o mesmo impasse: ideias promissoras ficam estagnadas por falta de ferramentas adequadas.
                </p>
                <p className="text-gray-700 mb-6">
                  Com a missão de transformar essa realidade, nasceu a KOLIBRA SOLUTIONS: uma ponte entre a criatividade de pequenos e médios negócios e as soluções digitais de ponta que eles merecem. Aqui, ninguém mais precisa frear seu crescimento por falta de branding ou tecnologia. Proporcionamos identidade visual profissional, sites, e-commerce e automação sob medida, de forma acessível e humanizada, para que cada empreendedor possa levar sua ideia do papel para o mercado sem obstáculos.
                </p>
                <p className="text-gray-700 mb-6 font-semibold">
                  Somos a KOLIBRA SOLUTIONS — A solução certa para crescer
                </p>
                <Button variant="outline" className="border-kolibra-orange text-kolibra-orange hover:bg-kolibra-orange hover:text-white mb-10">
                  Conheça Nossa História
                </Button>
              </div>
            </div>
            
            {/* Testimonials Slider - Moved here so it appears right after "Conheça Nossa História" */}
            <TestimonialsSlider />
          </div>
        </section>
      </Layout>
      <KolibriWidget />
    </>
  );
};

export default Home;
