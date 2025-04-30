
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { cartItems } = useCart();
  const location = useLocation();
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
    };
    
    checkUser();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logout realizado com sucesso",
      description: "Você foi desconectado da sua conta."
    });
  };
  
  return (
    <header className="bg-white shadow-sm py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-green-700">JardimPró</Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className={`text-gray-800 hover:text-green-600 ${location.pathname === '/' ? 'font-semibold' : ''}`}>HOME</Link>
          <Link to="/servicos" className={`text-gray-800 hover:text-green-600 ${location.pathname === '/servicos' ? 'font-semibold' : ''}`}>SERVIÇOS</Link>
          <Link to="/portfolio" className={`text-gray-800 hover:text-green-600 ${location.pathname === '/portfolio' ? 'font-semibold' : ''}`}>PORTFOLIO</Link>
          <Link to="/blog" className={`text-gray-800 hover:text-green-600 ${location.pathname === '/blog' ? 'font-semibold' : ''}`}>BLOG</Link>
          
          {user ? (
            <Button 
              variant="ghost" 
              className="text-gray-800 hover:text-green-600" 
              onClick={handleLogout}
            >
              SAIR
            </Button>
          ) : (
            <Link to="/login" className={`text-gray-800 hover:text-green-600 ${location.pathname === '/login' ? 'font-semibold' : ''}`}>LOGIN</Link>
          )}
          
          {cartItems.length > 0 && (
            <Link to="/servicos" className="relative">
              <ShoppingCart className="text-green-600 h-6 w-6" />
              <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItems.length}
              </span>
            </Link>
          )}
        </nav>
        
        {/* Mobile Navigation Icon */}
        <div className="md:hidden flex items-center">
          {cartItems.length > 0 && (
            <Link to="/servicos" className="relative mr-4">
              <ShoppingCart className="text-green-600 h-6 w-6" />
              <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItems.length}
              </span>
            </Link>
          )}
          <button onClick={toggleMenu} className="text-gray-800">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white z-50 shadow-md">
          <div className="container mx-auto py-4 space-y-4">
            <Link to="/" onClick={closeMenu} className={`block px-4 py-2 rounded hover:bg-gray-100 ${location.pathname === '/' ? 'bg-gray-100 font-semibold' : ''}`}>HOME</Link>
            <Link to="/servicos" onClick={closeMenu} className={`block px-4 py-2 rounded hover:bg-gray-100 ${location.pathname === '/servicos' ? 'bg-gray-100 font-semibold' : ''}`}>SERVIÇOS</Link>
            <Link to="/portfolio" onClick={closeMenu} className={`block px-4 py-2 rounded hover:bg-gray-100 ${location.pathname === '/portfolio' ? 'bg-gray-100 font-semibold' : ''}`}>PORTFOLIO</Link>
            <Link to="/blog" onClick={closeMenu} className={`block px-4 py-2 rounded hover:bg-gray-100 ${location.pathname === '/blog' ? 'bg-gray-100 font-semibold' : ''}`}>BLOG</Link>
            
            {user ? (
              <button 
                onClick={() => {
                  handleLogout();
                  closeMenu();
                }} 
                className="block w-full text-left px-4 py-2 rounded hover:bg-gray-100"
              >
                SAIR
              </button>
            ) : (
              <Link to="/login" onClick={closeMenu} className={`block px-4 py-2 rounded hover:bg-gray-100 ${location.pathname === '/login' ? 'bg-gray-100 font-semibold' : ''}`}>LOGIN</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
