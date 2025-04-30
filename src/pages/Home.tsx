
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { ChevronRight } from 'lucide-react';

const Home = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-50 to-blue-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold text-kolibra-blue mb-6">
              Impulsione seu Negócio com Soluções Digitais
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Oferecemos serviços profissionais de branding, web design e marketing digital para transformar sua marca em uma presença digital de destaque.
            </p>
            <Link to="/servicos">
              <Button className="bg-kolibra-orange hover:bg-amber-500 text-white text-lg px-8 py-6">
                Descubra Nossas Soluções <ChevronRight className="ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Nossas Soluções em Destaque</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md">
              <div className="h-48 bg-gradient-to-br from-kolibra-blue to-blue-400"></div>
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2">Branding Profissional</h3>
                <p className="text-gray-700 mb-4">Crie uma identidade visual única e memorável que comunica a essência da sua marca.</p>
                <Link to="/servicos" className="text-kolibra-orange font-medium hover:text-amber-500">
                  Saiba mais →
                </Link>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md">
              <div className="h-48 bg-gradient-to-br from-kolibra-blue to-blue-400"></div>
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2">Web Design Responsivo</h3>
                <p className="text-gray-700 mb-4">Sites modernos e funcionais que proporcionam a melhor experiência em qualquer dispositivo.</p>
                <Link to="/servicos" className="text-kolibra-orange font-medium hover:text-amber-500">
                  Saiba mais →
                </Link>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md">
              <div className="h-48 bg-gradient-to-br from-kolibra-blue to-blue-400"></div>
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2">Marketing Digital</h3>
                <p className="text-gray-700 mb-4">Estratégias personalizadas para alcançar seu público-alvo e converter visitantes em clientes.</p>
                <Link to="/servicos" className="text-kolibra-orange font-medium hover:text-amber-500">
                  Saiba mais →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <div className="rounded-lg bg-gradient-to-br from-kolibra-orange to-amber-300 h-[400px] flex items-center justify-center">
                <img 
                  src="/lovable-uploads/210b6771-d8f7-47af-b4dd-7dbbeddc1f0f.png"
                  alt="KOLIBRA Logo"
                  className="w-1/2"
                />
              </div>
            </div>
            
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-kolibra-blue mb-6">Sobre Nós</h2>
              <p className="text-gray-700 mb-6">
                A KOLIBRA SOLUTIONS nasceu da paixão por criar soluções digitais que impulsionam negócios e transformam marcas. Com anos de experiência no mercado, nossa equipe de designers, desenvolvedores e especialistas em marketing trabalha para oferecer soluções personalizadas que atendem às necessidades específicas de cada cliente.
              </p>
              <p className="text-gray-700 mb-6">
                Nossa missão é transformar a presença digital dos nossos clientes, criando identidades visuais marcantes, websites funcionais e estratégias de marketing eficazes que geram resultados reais e mensuráveis.
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
