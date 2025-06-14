
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

interface MobileNavProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
  user: any;
  isAdmin: boolean;
  isLoading: boolean;
  cartItems: any[];
  handleLogout: () => Promise<void>;
}

const MobileNav: React.FC<MobileNavProps> = ({
  isMenuOpen,
  toggleMenu,
  closeMenu,
  user,
  isAdmin,
  isLoading,
  cartItems,
  handleLogout
}) => {
  const location = useLocation();
  
  return (
    <>
      {/* Mobile Navigation Icon */}
      <div className="md:hidden flex items-center">
        {cartItems.length > 0 && (
          <Link to="/servicos" className="relative mr-4">
            <ShoppingCart className="text-kolibra-orange h-6 w-6" />
            <span className="absolute -top-2 -right-2 bg-kolibra-orange text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartItems.length}
            </span>
          </Link>
        )}
        <button onClick={toggleMenu} className="text-white">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white z-50 shadow-md">
          <div className="container mx-auto py-4 space-y-4">
            <Link to="/" onClick={closeMenu} className={`block px-4 py-2 rounded hover:bg-gray-100 ${location.pathname === '/' ? 'bg-gray-100 font-semibold text-kolibra-orange' : 'text-gray-800'}`}>HOME</Link>
            <Link to="/servicos" onClick={closeMenu} className={`block px-4 py-2 rounded hover:bg-gray-100 ${location.pathname === '/servicos' ? 'bg-gray-100 font-semibold text-kolibra-orange' : 'text-gray-800'}`}>SERVIÇOS</Link>
            <Link to="/metodo" onClick={closeMenu} className={`block px-4 py-2 rounded hover:bg-gray-100 ${location.pathname === '/metodo' ? 'bg-gray-100 font-semibold text-kolibra-orange' : 'text-gray-800'}`}>MÉTODO</Link>
            <Link to="/sobre" onClick={closeMenu} className={`block px-4 py-2 rounded hover:bg-gray-100 ${location.pathname === '/sobre' ? 'bg-gray-100 font-semibold text-kolibra-orange' : 'text-gray-800'}`}>SOBRE</Link>
            <Link to="/portfolio" onClick={closeMenu} className={`block px-4 py-2 rounded hover:bg-gray-100 ${location.pathname === '/portfolio' ? 'bg-gray-100 font-semibold text-kolibra-orange' : 'text-gray-800'}`}>PORTFOLIO</Link>
            <Link to="/blog" onClick={closeMenu} className={`block px-4 py-2 rounded hover:bg-gray-100 ${location.pathname === '/blog' ? 'bg-gray-100 font-semibold text-kolibra-orange' : 'text-gray-800'}`}>BLOG</Link>
            
            {isLoading ? (
              <Skeleton className="h-9 w-full" />
            ) : user ? (
              <>
                <Link to="/profile" onClick={closeMenu} className={`block px-4 py-2 rounded hover:bg-gray-100 ${location.pathname === '/profile' ? 'bg-gray-100 font-semibold text-kolibra-orange' : 'text-gray-800'}`}>MEU PERFIL</Link>
                
                {isAdmin && (
                  <Link to="/admin" onClick={closeMenu} className={`block px-4 py-2 rounded hover:bg-gray-100 ${location.pathname === '/admin' ? 'bg-gray-100 font-semibold text-kolibra-orange' : 'text-gray-800'}`}>PAINEL ADMIN</Link>
                )}
                
                <button 
                  onClick={() => {
                    handleLogout();
                    closeMenu();
                  }} 
                  className="block w-full text-left px-4 py-2 rounded hover:bg-gray-100 text-gray-800"
                >
                  SAIR
                </button>
              </>
            ) : (
              <Link to="/login" onClick={closeMenu} className={`block px-4 py-2 rounded hover:bg-gray-100 ${location.pathname === '/login' ? 'bg-gray-100 font-semibold text-kolibra-orange' : 'text-gray-800'}`}>LOGIN</Link>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNav;
