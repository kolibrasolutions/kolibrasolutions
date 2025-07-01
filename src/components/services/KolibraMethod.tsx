
import React from "react";

const methodSteps = [
  {
    title: "Diagnóstico",
    description:
      "Análise profunda do momento do cliente, pontos fortes, fraquezas e oportunidades.",
    icon: "🔎",
  },
  {
    title: "Estratégia",
    description:
      "Plano de ação personalizado com metas claras e soluções sob medida.",
    icon: "🧭",
  },
  {
    title: "Execução",
    description:
      "Implementação prática, com acompanhamento próximo e ajustes constantes.",
    icon: "🚀",
  },
];

const KolibraMethod = () => (
  <section className="py-14 bg-gray-50">
    <div className="container mx-auto px-4 max-w-4xl">
      <h2 className="text-3xl font-bold text-center text-kolibra-blue mb-8">
        Nosso Método: Direto e Poderoso
      </h2>
      <div className="flex flex-col md:flex-row md:justify-between gap-8">
        {methodSteps.map((step, idx) => (
          <div key={step.title} className="bg-white rounded-lg p-8 shadow hover-scale flex-1 text-center">
            <div className="text-4xl mb-3">{step.icon}</div>
            <h3 className="text-xl font-bold mb-2">{step.title}</h3>
            <p className="text-gray-600">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default KolibraMethod;
