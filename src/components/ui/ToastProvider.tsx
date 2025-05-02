
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
// We'll uncomment Sonner later after we confirm the main toast system works
// import { Toaster as Sonner } from "@/components/ui/sonner";

export const ToastProvider: React.FC = () => {
  return (
    <>
      <Toaster />
      {/* We'll add Sonner back once we confirm the basic setup works */}
      {/* <Sonner /> */}
    </>
  );
};
