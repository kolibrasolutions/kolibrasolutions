
import React from 'react';
import Layout from '@/components/Layout';
import KolibraMethod from '@/components/services/KolibraMethod';
import DigitalPresenceSlices from '@/components/services/DigitalPresenceSlices';

const Metodo = () => (
  <Layout>
    <section className="py-14 bg-white">
      <div className="container mx-auto px-4 max-w-4xl text-center mb-10">
        <h1 className="text-4xl font-bold text-kolibra-blue mb-4">Nosso Método</h1>
        <p className="text-lg text-gray-700 mb-6">
          Descubra como trabalhamos para impulsionar o crescimento digital do seu negócio, do diagnóstico à execução, além das 6 fatias essenciais da presença digital.
        </p>
      </div>
      <KolibraMethod />
      <DigitalPresenceSlices />
    </section>
  </Layout>
);

export default Metodo;
