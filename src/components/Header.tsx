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
  const {
    cartItems
  } = useCart();
  const location = useLocation();
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  useEffect(() => {
    const checkUser = async () => {
      const {
        data
      } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
    };
    checkUser();
    const {
      data: authListener
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast("Logout realizado com sucesso", {
      description: "Você foi desconectado da sua conta."
    });
  };
  return <header className="shadow-sm py-4 px-6 bg-kolibra-blue">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img src="/lovable-uploads/4d763971-e656-4bc1-9de1-3a0f1ae9f985.png" alt="KOLIBRA SOLUTIONS" className="h-10 object-fill" />
          
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className={`text-gray-800 hover:text-kolibra-blue ${location.pathname === '/' ? 'font-semibold text-kolibra-blue' : ''}`}>HOME</Link>
          <Link to="/servicos" className={`text-gray-800 hover:text-kolibra-blue ${location.pathname === '/servicos' ? 'font-semibold text-kolibra-blue' : ''}`}>SOLUÇÕES</Link>
          <Link to="/portfolio" className={`text-gray-800 hover:text-kolibra-blue ${location.pathname === '/portfolio' ? 'font-semibold text-kolibra-blue' : ''}`}>PORTFOLIO</Link>
          <Link to="/blog" className={`text-gray-800 hover:text-kolibra-blue ${location.pathname === '/blog' ? 'font-semibold text-kolibra-blue' : ''}`}>BLOG</Link>
          
          {user ? <Button variant="ghost" className="text-gray-800 hover:text-kolibra-blue" onClick={handleLogout}>
              SAIR
            </Button> : <Link to="/login" className={`text-gray-800 hover:text-kolibra-blue ${location.pathname === '/login' ? 'font-semibold text-kolibra-blue' : ''}`}>LOGIN</Link>}
          
          {cartItems.length > 0 && <Link to="/servicos" className="relative">
              <ShoppingCart className="text-kolibra-orange h-6 w-6" />
              <span className="absolute -top-2 -right-2 bg-kolibra-orange text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItems.length}
              </span>
            </Link>}
        </nav>
        
        {/* Mobile Navigation Icon */}
        <div className="md:hidden flex items-center">
          {cartItems.length > 0 && <Link to="/servicos" className="relative mr-4">
              <ShoppingCart className="text-kolibra-orange h-6 w-6" />
              <span className="absolute -top-2 -right-2 bg-kolibra-orange text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItems.length}
              </span>
            </Link>}
          <button onClick={toggleMenu} className="text-gray-800">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && <div className="md:hidden absolute top-16 left-0 right-0 bg-white z-50 shadow-md">
          <div className="container mx-auto py-4 space-y-4">
            <Link to="/" onClick={closeMenu} className={`block px-4 py-2 rounded hover:bg-gray-100 ${location.pathname === '/' ? 'bg-gray-100 font-semibold text-kolibra-blue' : ''}`}>HOME</Link>
            <Link to="/servicos" onClick={closeMenu} className={`block px-4 py-2 rounded hover:bg-gray-100 ${location.pathname === '/servicos' ? 'bg-gray-100 font-semibold text-kolibra-blue' : ''}`}>SOLUÇÕES</Link>
            <Link to="/portfolio" onClick={closeMenu} className={`block px-4 py-2 rounded hover:bg-gray-100 ${location.pathname === '/portfolio' ? 'bg-gray-100 font-semibold text-kolibra-blue' : ''}`}>PORTFOLIO</Link>
            <Link to="/blog" onClick={closeMenu} className={`block px-4 py-2 rounded hover:bg-gray-100 ${location.pathname === '/blog' ? 'bg-gray-100 font-semibold text-kolibra-blue' : ''}`}>BLOG</Link>
            
            {user ? <button onClick={() => {
          handleLogout();
          closeMenu();
        }} className="block w-full text-left px-4 py-2 rounded hover:bg-gray-100">
                SAIR
              </button> : <Link to="/login" onClick={closeMenu} className={`block px-4 py-2 rounded hover:bg-gray-100 ${location.pathname === '/login' ? 'bg-gray-100 font-semibold text-kolibra-blue' : ''}`}>LOGIN</Link>}
          </div>
        </div>}
    </header>;
};
export default Header;