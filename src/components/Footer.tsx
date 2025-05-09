
import React from 'react';
import { Instagram, Linkedin, MessageSquare, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-kolibra-blue text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">KOLIBRA SOLUTIONS</h3>
            <p>Transformando negócios através de branding, web design e marketing digital.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contato</h3>
            <p className="flex items-center gap-2 mb-2">
              <MessageSquare className="h-5 w-5" /> 
              <a href="mailto:kolibrasolutions@gmail.com" className="hover:text-kolibra-orange">
                kolibrasolutions@gmail.com
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-5 w-5" /> 
              <a href="tel:+5535999796570" className="hover:text-kolibra-orange">
                (35) 99979-6570
              </a>
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Redes Sociais</h3>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/kolibrasolutions/" target="_blank" rel="noopener noreferrer" className="hover:text-kolibra-orange flex items-center gap-1">
                <Instagram className="h-5 w-5" /> Instagram
              </a>
              <a href="https://www.linkedin.com/in/kolibrasolutions/" target="_blank" rel="noopener noreferrer" className="hover:text-kolibra-orange flex items-center gap-1">
                <Linkedin className="h-5 w-5" /> LinkedIn
              </a>
            </div>
            <div className="mt-4 space-x-4">
              <a href="http://wa.me/5535999796570" target="_blank" rel="noopener noreferrer" className="hover:text-kolibra-orange flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-green-400">
                  <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                  <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
                  <path d="M14 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
                  <path d="M9.5 13.5h5" />
                </svg> WhatsApp
              </a>
              <a href="https://www.tiktok.com/@kolibrasolutions" target="_blank" rel="noopener noreferrer" className="hover:text-kolibra-orange flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
                </svg> TikTok
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-blue-700 mt-8 pt-6 text-center">
          <p>&copy; {new Date().getFullYear()} Kolibra Solutions. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
