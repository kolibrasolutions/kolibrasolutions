
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-100 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-green-700">JardimPró</Link>
        
        <nav>
          <ul className="flex space-x-6">
            <li><Link to="/" className="hover:text-green-600 font-medium">HOME</Link></li>
            <li><Link to="/servicos" className="hover:text-green-600 font-medium">SERVIÇOS</Link></li>
            <li><Link to="/portfolio" className="hover:text-green-600 font-medium">PORTFOLIO</Link></li>
            <li><Link to="/blog" className="hover:text-green-600 font-medium">BLOG</Link></li>
            <li><Link to="/login"><Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white">LOGIN</Button></Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
