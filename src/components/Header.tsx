
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/hooks/useAuth';
import DesktopNav from './header/DesktopNav';
import MobileNav from './header/MobileNav';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartItems } = useCart();
  const { user, isAdmin, isLoading, handleLogout } = useAuth();
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  
  return (
    <header className="shadow-sm py-4 px-6 bg-kolibra-blue text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img src="/lovable-uploads/4d763971-e656-4bc1-9de1-3a0f1ae9f985.png" alt="KOLIBRA SOLUTIONS" className="h-14 object-fill" />
        </Link>
        
        {/* Desktop Navigation */}
        <DesktopNav 
          user={user}
          isAdmin={isAdmin}
          isLoading={isLoading}
          cartItems={cartItems}
          handleLogout={handleLogout}
        />
        
        {/* Mobile Navigation */}
        <MobileNav 
          isMenuOpen={isMenuOpen}
          toggleMenu={toggleMenu}
          closeMenu={closeMenu}
          user={user}
          isAdmin={isAdmin}
          isLoading={isLoading}
          cartItems={cartItems}
          handleLogout={handleLogout}
        />
      </div>
    </header>
  );
};

export default Header;
