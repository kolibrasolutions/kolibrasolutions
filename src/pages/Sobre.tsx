
import React from 'react';
import Layout from '@/components/Layout';
import BrandManifesto from '@/components/services/BrandManifesto';
import { Button } from '@/components/ui/button';

const Sobre = () => (
  <Layout>
    <section className="py-14 bg-white">
      <div className="container mx-auto px-4 max-w-4xl text-center mb-14">
        <h1 className="text-4xl font-bold text-kolibra-blue mb-4">Sobre Nós</h1>
        <p className="text-lg text-gray-700 mb-6">
          Conheça a história, o manifesto e os valores da Kolibra Solutions.
        </p>
      </div>
      <div className="container mx-auto px-4 max-w-4xl mb-14">
        <h2 className="text-2xl font-bold mb-4 text-kolibra-blue">Nossa História</h2>
        <p className="text-gray-700 mb-4">
          O fundador da KOLIBRA SOLUTIONS desenhou seu primeiro logotipo em 2009, mas esbarrou na escassez de recursos tecnológicos da época. Ao longo dos anos, acumulou know-how em design e gestão de negócios — e percebeu que muitos empreendedores enfrentam o mesmo impasse: ideias promissoras ficam estagnadas por falta de ferramentas adequadas.
        </p>
        <p className="text-gray-700 mb-4">
          Com a missão de transformar essa realidade, nasceu a KOLIBRA SOLUTIONS: uma ponte entre a criatividade de pequenos e médios negócios e as soluções digitais de ponta que eles merecem. Aqui, ninguém mais precisa frear seu crescimento por falta de branding ou tecnologia. Proporcionamos identidade visual profissional, sites, e-commerce e automação sob medida, de forma acessível e humanizada, para que cada empreendedor possa levar sua ideia do papel para o mercado sem obstáculos.
        </p>
        <p className="text-gray-700 font-semibold">
          Somos a KOLIBRA SOLUTIONS — A solução certa para crescer
        </p>
      </div>
      <div className="container mx-auto px-4 max-w-4xl">
        <BrandManifesto />
      </div>
    </section>
  </Layout>
);

export default Sobre;
