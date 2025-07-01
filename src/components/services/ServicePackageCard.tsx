
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
  <div className="bg-gray-50 rounded-xl shadow-md p-8 flex flex-col h-full transition-all duration-300 ease-out transform hover:scale-105 hover:shadow-2xl hover:-translate-y-2 hover:bg-white group animate-fade-in">
    <div className="flex items-center gap-2 mb-2">
      {icon && (
        <span className="text-3xl transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
          {icon}
        </span>
      )}
      <h3 className="text-xl font-bold text-gray-800 group-hover:text-kolibra-blue transition-colors duration-300">
        {title}
      </h3>
    </div>
    <p className="text-gray-600 mb-4 group-hover:text-gray-700 transition-colors duration-300">
      {description}
    </p>
    <ul className="text-sm text-gray-700 mb-4 list-disc list-inside space-y-1">
      {included.map((item, index) => (
        <li key={item} className="transform transition-all duration-300 hover:translate-x-1 hover:text-kolibra-blue">
          {item}
        </li>
      ))}
    </ul>
    <div className="mt-auto mb-4 font-semibold text-kolibra-blue group-hover:text-kolibra-orange transition-colors duration-300 transform group-hover:scale-105">
      {result}
    </div>
    <Button 
      variant="outline" 
      className="border-kolibra-orange text-kolibra-orange hover:bg-kolibra-orange hover:text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg group-hover:border-kolibra-blue"
    >
      Solicitar Diagnóstico Gratuito
    </Button>
  </div>
);

export default ServicePackageCard;
