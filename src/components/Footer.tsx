
import React from 'react';

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
            <p>Email: contato@kolibrasolutions.com</p>
            <p>Telefone: (11) 99999-9999</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Redes Sociais</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-kolibra-orange">Instagram</a>
              <a href="#" className="hover:text-kolibra-orange">Facebook</a>
              <a href="#" className="hover:text-kolibra-orange">LinkedIn</a>
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
