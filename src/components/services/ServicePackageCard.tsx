
import React from "react";
import { Button } from "@/components/ui/button";

type ServicePackageCardProps = {
  title: string;
  description: string;
  included: string[];
  result: string;
  icon?: React.ReactNode;
};

const ServicePackageCard = ({ title, description, included, result, icon }: ServicePackageCardProps) => (
  <div className="bg-gray-50 rounded-xl shadow p-8 flex flex-col h-full transition hover:shadow-xl hover-scale">
    <div className="flex items-center gap-2 mb-2">
      {icon && <span className="text-3xl">{icon}</span>}
      <h3 className="text-xl font-bold">{title}</h3>
    </div>
    <p className="text-gray-600 mb-4">{description}</p>
    <ul className="text-sm text-gray-700 mb-4 list-disc list-inside">
      {included.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
    <div className="mt-auto mb-2 font-semibold text-kolibra-blue">{result}</div>
    <Button 
      variant="outline" 
      className="border-kolibra-orange text-kolibra-orange hover:bg-kolibra-orange hover:text-white transition"
    >
      Solicitar Diagnóstico Gratuito
    </Button>
  </div>
);

export default ServicePackageCard;
