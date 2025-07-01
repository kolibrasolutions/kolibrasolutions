
import React from 'react';
import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  recommendedServices: string[];
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ recommendedServices }) => {
  const generateWhatsAppMessage = () => {
    let message = 'Olá Kolibra Solutions! Fiz o autodiagnóstico com a Kolibri e identifiquei que preciso de ajuda com: ';
    
    if (recommendedServices.length > 0) {
      message += recommendedServices.join(', ') + '. ';
    } else {
      message += 'minha presença digital. ';
    }
    
    message += 'Gostaria de saber mais sobre como vocês podem me ajudar a voar alto!';
    
    return encodeURIComponent(message);
  };

  const whatsappNumber = '5511999999999'; // Substitua pelo número real
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${generateWhatsAppMessage()}`;
  
  return (
    <div className="text-center py-6">
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center bg-[#25D366] hover:bg-[#20B95C] text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 animate-pulse shadow-lg"
      >
        <MessageCircle className="mr-3 h-6 w-6" />
        Fale Conosco no WhatsApp!
      </a>
    </div>
  );
};

export default WhatsAppButton;
