
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DesktopNavProps {
  user: any;
  isAdmin: boolean;
  isLoading: boolean;
  cartItems: any[];
  handleLogout: () => Promise<void>;
}

const DesktopNav: React.FC<DesktopNavProps> = ({ 
  user, isAdmin, isLoading, cartItems, handleLogout 
}) => {
  const location = useLocation();
  
  return (
    <nav className="hidden md:flex items-center space-x-8">
      <Link to="/" className={`text-gray-800 hover:text-kolibra-blue ${location.pathname === '/' ? 'font-semibold text-kolibra-blue' : ''}`}>HOME</Link>
      <Link to="/servicos" className={`text-gray-800 hover:text-kolibra-blue ${location.pathname === '/servicos' ? 'font-semibold text-kolibra-blue' : ''}`}>SOLUÇÕES</Link>
      <Link to="/portfolio" className={`text-gray-800 hover:text-kolibra-blue ${location.pathname === '/portfolio' ? 'font-semibold text-kolibra-blue' : ''}`}>PORTFOLIO</Link>
      <Link to="/blog" className={`text-gray-800 hover:text-kolibra-blue ${location.pathname === '/blog' ? 'font-semibold text-kolibra-blue' : ''}`}>BLOG</Link>
      
      {isLoading ? (
        <Skeleton className="h-9 w-20" />
      ) : user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-gray-800 hover:text-kolibra-blue flex items-center gap-1">
              <User size={16} />
              {user.user_metadata?.full_name?.split(' ')[0] || 'CONTA'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile">Meu Perfil</Link>
            </DropdownMenuItem>
            
            {isAdmin && (
              <DropdownMenuItem asChild>
                <Link to="/admin">Painel Admin</Link>
              </DropdownMenuItem>
            )}
            
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link to="/login" className={`text-gray-800 hover:text-kolibra-blue ${location.pathname === '/login' ? 'font-semibold text-kolibra-blue' : ''}`}>
          LOGIN
        </Link>
      )}
      
      {cartItems.length > 0 && (
        <Link to="/servicos" className="relative">
          <ShoppingCart className="text-kolibra-orange h-6 w-6" />
          <span className="absolute -top-2 -right-2 bg-kolibra-orange text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {cartItems.length}
          </span>
        </Link>
      )}
    </nav>
  );
};

export default DesktopNav;
