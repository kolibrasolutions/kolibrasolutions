
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
          <img src="/lovable-uploads/a544935d-30bc-4cbe-b588-c420c26cd6fb.png" alt="KOLIBRA SOLUTIONS" className="h-20 object-fill" />
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
