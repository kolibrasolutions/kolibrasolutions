
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
// Temporariamente comentando o Sonner para isolar o problema
// import { Toaster as Sonner } from "@/components/ui/sonner";

export const ToastProvider: React.FC = () => {
  return (
    <>
      <Toaster />
      {/* Temporariamente comentado para depuração
      <Sonner /> 
      */}
    </>
  );
};
