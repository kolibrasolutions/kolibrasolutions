
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import KolibriChat from './KolibriChat';
import { SpringElement } from '@/components/ui/spring-element';

const KolibriWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Botão flutuante usando SpringElement */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <SpringElement>
            <Button
              onClick={() => setIsOpen(true)}
              className="w-16 h-16 rounded-full bg-gradient-to-r from-kolibra-blue to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-2xl p-2"
              size="lg"
            >
              <img 
                src="/lovable-uploads/b6e31161-5091-4d56-afdb-8c69ae390cda.png" 
                alt="Kolibri IA" 
                className="w-full h-full object-contain rounded-full"
              />
            </Button>
          </SpringElement>
          <div className="absolute -top-12 right-0 bg-white rounded-lg shadow-lg p-2 text-sm font-medium text-gray-700 whitespace-nowrap">
            Faça seu autodiagnóstico!
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white"></div>
          </div>
        </div>
      )}

      {/* Modal do chat */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl h-full max-h-[90vh]">
            <KolibriChat isWidget={true} onClose={() => setIsOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default KolibriWidget;

