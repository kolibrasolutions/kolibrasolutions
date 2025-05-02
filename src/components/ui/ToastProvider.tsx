
import React from 'react';
console.log('React@ToastProvider:', React.version, React);

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

export const ToastProvider: React.FC = () => {
  return (
    <>
      <Toaster />
      <Sonner />
    </>
  );
};
