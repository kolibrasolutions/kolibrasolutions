
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { ChevronRight } from 'lucide-react';

const Home = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-50 to-green-100 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold text-green-800 mb-6">
              Transforme seu Jardim em uma Obra de Arte
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Oferecemos serviços profissionais de jardinagem e paisagismo para tornar seu espaço exterior tão especial quanto o interior da sua casa.
            </p>
            <Link to="/servicos">
              <Button className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-6">
                Conheça Nossos Serviços <ChevronRight className="ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Nossos Serviços em Destaque</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* These would be populated from the database */}
            <div className="bg-green-50 rounded-lg overflow-hidden shadow-md">
              <div className="h-48 bg-green-200"></div>
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2">Paisagismo Residencial</h3>
                <p className="text-gray-700 mb-4">Transforme seu jardim em um espaço de relaxamento e beleza natural.</p>
                <Link to="/servicos" className="text-green-600 font-medium hover:text-green-800">
                  Saiba mais →
                </Link>
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg overflow-hidden shadow-md">
              <div className="h-48 bg-green-200"></div>
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2">Manutenção Regular</h3>
                <p className="text-gray-700 mb-4">Mantenha seu jardim sempre em perfeito estado com nossos planos de manutenção.</p>
                <Link to="/servicos" className="text-green-600 font-medium hover:text-green-800">
                  Saiba mais →
                </Link>
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg overflow-hidden shadow-md">
              <div className="h-48 bg-green-200"></div>
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2">Sistemas de Irrigação</h3>
                <p className="text-gray-700 mb-4">Tecnologia e sustentabilidade para manter seu jardim sempre saudável.</p>
                <Link to="/servicos" className="text-green-600 font-medium hover:text-green-800">
                  Saiba mais →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <div className="rounded-lg bg-green-200 h-[400px]"></div>
            </div>
            
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-green-800 mb-6">Sobre Nós</h2>
              <p className="text-gray-700 mb-6">
                A JardimPró nasceu da paixão por criar espaços verdes que inspiram e transformam. Com mais de 10 anos de experiência no mercado, nossa equipe de paisagistas, jardineiros e engenheiros agrónomos trabalha para oferecer soluções personalizadas que atendem às necessidades específicas de cada cliente.
              </p>
              <p className="text-gray-700 mb-6">
                Nossa missão é transformar cada espaço exterior em um ambiente que reflita a personalidade e estilo de vida dos nossos clientes, utilizando técnicas sustentáveis e plantas adaptadas ao clima local.
              </p>
              <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white">
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
