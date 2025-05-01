import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { ChevronRight } from 'lucide-react';
import StatsCounter from '@/components/home/StatsCounter';

const Home = () => {
  return (
    <Layout>
      {/* Hero Section with Stats */}
      <section className="bg-gradient-to-r from-kolibra-blue to-blue-700 py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Transforme seu Negócio com Soluções Digitais Acessíveis
            </h1>
            <p className="text-xl mb-6 text-white/90">
              Oferecemos serviços profissionais de branding, web design e marketing digital para transformar sua marca em uma presença digital de destaque.
            </p>
            <p className="text-2xl font-bold mb-8 text-kolibra-orange">
              A SOLUÇÃO CERTA PARA CRESCER
            </p>
            <Link to="/servicos">
              <Button className="bg-kolibra-orange hover:bg-amber-500 text-white text-lg px-8 py-6">
                Descubra Nossas Soluções <ChevronRight className="ml-1" />
              </Button>
            </Link>
          </div>
          
          {/* Stats Counter */}
          <StatsCounter />
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Nossas Soluções em Destaque</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg p-8">
              <img src="/pencil.png" alt="Branding Profissional" className="w-full h-48 object-cover object-center mb-6" />
              <h3 className="text-xl font-bold mb-2">Branding Profissional</h3>
              <p className="text-gray-600 mb-4">Crie uma identidade visual única e memorável que comunica a essência da sua marca.</p>
              <Link to="/servicos" className="text-kolibra-orange hover:text-amber-500">
                Saiba mais →
              </Link>
            </div>

            <div className="bg-gray-50 rounded-lg p-8">
              <img src="/computer.png" alt="Web Design Responsivo" className="w-full h-48 object-cover object-center mb-6" />
              <h3 className="text-xl font-bold mb-2">Web Design Responsivo</h3>
              <p className="text-gray-600 mb-4">Sites modernos e funcionais que proporcionam a melhor experiência em qualquer dispositivo.</p>
              <Link to="/servicos" className="text-kolibra-orange hover:text-amber-500">
                Saiba mais →
              </Link>
            </div>

            <div className="bg-gray-50 rounded-lg p-8">
              <img src="/megaphone.png" alt="Marketing Digital" className="w-full h-48 object-cover object-center mb-6" />
              <h3 className="text-xl font-bold mb-2">Marketing Digital</h3>
              <p className="text-gray-600 mb-4">Estratégias personalizadas para alcançar seu público-alvo e converter visitantes em clientes.</p>
              <Link to="/servicos" className="text-kolibra-orange hover:text-amber-500">
                Saiba mais →
              </Link>
            </div>
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
              <Button variant="outline" className="border-kolibra-orange text-kolibra-orange hover:bg-kolibra-orange hover:text-white">
                Conheça Nossa História
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
