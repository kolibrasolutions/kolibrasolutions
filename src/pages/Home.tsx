
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { ChevronRight } from 'lucide-react';
import StatsCounter from '@/components/home/StatsCounter';
import TestimonialsSlider from '@/components/home/TestimonialsSlider';
import KolibriWidget from '@/components/kolibri/KolibriWidget';
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";

const Home = () => {
  return (
    <>
      <Layout>
        {/* Hero Section with Stats and Gradient Animation */}
        <section className="relative py-0">
          <BackgroundGradientAnimation>
            {/* Alteração principal: novo container grid para separar lado-a-lado no desktop */}
            <div className="relative z-10 container mx-auto px-4 min-h-screen flex flex-col justify-center">
              <div className="flex flex-col md:flex-row items-center md:items-start md:justify-between w-full min-h-screen">
                {/* Conteúdo principal */}
                <div className="max-w-3xl mb-10 pt-16 md:pt-24 flex-1 flex flex-col justify-center md:mb-0 md:pt-20">
                  <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg">
                    Transforme seu Negócio com Soluções Digitais Acessíveis
                  </h1>
                  <p className="text-xl mb-6 text-white/90 drop-shadow">
                    Oferecemos serviços profissionais de branding, web design e marketing digital para transformar sua marca em uma presença digital de destaque.
                  </p>
                  <p className="text-2xl font-bold mb-8 text-kolibra-orange drop-shadow">
                    A SOLUÇÃO CERTA PARA CRESCER
                  </p>
                  <Link to="/servicos">
                    <Button className="bg-kolibra-orange hover:bg-amber-500 text-white text-lg px-8 py-6 shadow-xl">
                      Descubra Nossas Soluções <ChevronRight className="ml-1" />
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
        
        {/* Featured Services Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Nossas Soluções em Destaque</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 rounded-lg p-8">
                <img src="/pencil.png" alt="Branding Profissional" className="w-full h-48 object-cover object-center mb-6 rounded-lg" />
                <h3 className="text-xl font-bold mb-2">Branding Profissional</h3>
                <p className="text-gray-600 mb-4">Crie uma identidade visual única e memorável que comunica a essência da sua marca.</p>
                <Link to="/servicos" className="text-kolibra-orange hover:text-amber-500">
                  Saiba mais →
                </Link>
              </div>

              <div className="bg-gray-50 rounded-lg p-8">
                <img src="/computer.png" alt="Web Design Responsivo" className="w-full h-48 object-cover object-center mb-6 rounded-lg" />
                <h3 className="text-xl font-bold mb-2">Web Design Responsivo</h3>
                <p className="text-gray-600 mb-4">Sites modernos e funcionais que proporcionam a melhor experiência em qualquer dispositivo.</p>
                <Link to="/servicos" className="text-kolibra-orange hover:text-amber-500">
                  Saiba mais →
                </Link>
              </div>

              <div className="bg-gray-50 rounded-lg p-8">
                <img src="/megaphone.png" alt="Marketing Digital" className="w-full h-48 object-cover object-center mb-6 rounded-lg" />
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
