
import React from "react";

const slices = [
  {
    name: "Visual",
    description: "Identidade visual, logo, cores e apelo estético.",
    icon: "🎨"
  },
  {
    name: "Comunicação",
    description: "Tom de voz, clareza de mensagem e posicionamento verbal.",
    icon: "🗣️"
  },
  {
    name: "Canal",
    description: "Presença em Google, redes sociais e site.",
    icon: "🌐"
  },
  {
    name: "Funil",
    description: "Atração, engajamento e conversão de clientes.",
    icon: "🔄"
  },
  {
    name: "Produto/Serviço",
    description: "Clareza e diferenciação na apresentação da oferta.",
    icon: "📦"
  },
  {
    name: "Suporte/Atendimento",
    description: "Qualidade do suporte e relacionamento digital.",
    icon: "🤝"
  },
];

const DigitalPresenceSlices = () => (
  <section className="py-14">
    <div className="container mx-auto px-4 max-w-5xl">
      <h2 className="text-3xl font-bold text-center mb-8 text-kolibra-blue">As 6 Fatias Essenciais da Presença Digital</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7">
        {slices.map((slice) => (
          <div key={slice.name} className="bg-white rounded-lg shadow p-6 text-center hover-scale transition">
            <div className="text-3xl mb-2">{slice.icon}</div>
            <h3 className="text-lg font-semibold mb-1">{slice.name}</h3>
            <p className="text-gray-600">{slice.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default DigitalPresenceSlices;
