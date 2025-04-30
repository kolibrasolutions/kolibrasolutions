
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-green-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">JardimPró</h3>
            <p>Transformando espaços verdes em verdadeiras obras de arte.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contato</h3>
            <p>Email: contato@jardimpro.com</p>
            <p>Telefone: (11) 99999-9999</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Redes Sociais</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-green-300">Instagram</a>
              <a href="#" className="hover:text-green-300">Facebook</a>
              <a href="#" className="hover:text-green-300">LinkedIn</a>
            </div>
          </div>
        </div>
        <div className="border-t border-green-700 mt-8 pt-6 text-center">
          <p>&copy; {new Date().getFullYear()} JardimPró. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
