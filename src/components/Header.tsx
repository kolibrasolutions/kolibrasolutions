
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, User } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { cartItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  
  useEffect(() => {
    let isMounted = true;
    
    const checkUser = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth session error:", error);
          return;
        }
        
        if (!isMounted) return;
        
        setUser(data.session?.user || null);
        
        // Check if the user is an admin
        if (data.session?.user) {
          try {
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('role')
              .eq('id', data.session.user.id)
              .single();
              
            if (userError) {
              console.error("User role error:", userError);
              return;
            }
            
            if (!isMounted) return;
            setIsAdmin(userData?.role === 'admin' || false);
          } catch (err) {
            console.error("Error checking admin status:", err);
          }
        }
      } catch (err) {
        console.error("Session check error:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    checkUser();
    
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;
      
      setUser(session?.user || null);
      
      // Check admin status on auth state change
      if (session?.user) {
        try {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('role')
            .eq('id', session.user.id)
            .single();
            
          if (!isMounted) return;
          
          if (!userError && userData) {
            setIsAdmin(userData.role === 'admin');
          }
        } catch (err) {
          console.error("Error checking admin status on auth change:", err);
        }
      } else {
        setIsAdmin(false);
      }
    });
    
    return () => {
      isMounted = false;
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);
  
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Logout error:", error);
        toast("Erro ao sair", {
          description: "Houve um problema ao desconectar sua conta.",
          variant: "destructive"
        });
        return;
      }
      
      toast("Logout realizado com sucesso", {
        description: "Você foi desconectado da sua conta."
      });
      navigate('/');
    } catch (err) {
      console.error("Logout exception:", err);
      toast("Erro ao sair", {
        description: "Houve um problema ao desconectar sua conta.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <header className="shadow-sm py-4 px-6 bg-white">
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
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  Meu Perfil
                </DropdownMenuItem>
                
                {isAdmin && (
                  <DropdownMenuItem onClick={() => navigate('/admin')}>
                    Painel Admin
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
          <button onClick={toggleMenu} className="text-gray-800">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white z-50 shadow-md">
          <div className="container mx-auto py-4 space-y-4">
            <Link to="/" onClick={closeMenu} className={`block px-4 py-2 rounded hover:bg-gray-100 ${location.pathname === '/' ? 'bg-gray-100 font-semibold text-kolibra-blue' : ''}`}>HOME</Link>
            <Link to="/servicos" onClick={closeMenu} className={`block px-4 py-2 rounded hover:bg-gray-100 ${location.pathname === '/servicos' ? 'bg-gray-100 font-semibold text-kolibra-blue' : ''}`}>SOLUÇÕES</Link>
            <Link to="/portfolio" onClick={closeMenu} className={`block px-4 py-2 rounded hover:bg-gray-100 ${location.pathname === '/portfolio' ? 'bg-gray-100 font-semibold text-kolibra-blue' : ''}`}>PORTFOLIO</Link>
            <Link to="/blog" onClick={closeMenu} className={`block px-4 py-2 rounded hover:bg-gray-100 ${location.pathname === '/blog' ? 'bg-gray-100 font-semibold text-kolibra-blue' : ''}`}>BLOG</Link>
            
            {isLoading ? (
              <Skeleton className="h-9 w-full" />
            ) : user ? (
              <>
                <Link to="/profile" onClick={closeMenu} className={`block px-4 py-2 rounded hover:bg-gray-100 ${location.pathname === '/profile' ? 'bg-gray-100 font-semibold text-kolibra-blue' : ''}`}>MEU PERFIL</Link>
                
                {isAdmin && (
                  <Link to="/admin" onClick={closeMenu} className={`block px-4 py-2 rounded hover:bg-gray-100 ${location.pathname === '/admin' ? 'bg-gray-100 font-semibold text-kolibra-blue' : ''}`}>PAINEL ADMIN</Link>
                )}
                
                <button 
                  onClick={() => {
                    handleLogout();
                    closeMenu();
                  }} 
                  className="block w-full text-left px-4 py-2 rounded hover:bg-gray-100"
                >
                  SAIR
                </button>
              </>
            ) : (
              <Link to="/login" onClick={closeMenu} className={`block px-4 py-2 rounded hover:bg-gray-100 ${location.pathname === '/login' ? 'bg-gray-100 font-semibold text-kolibra-blue' : ''}`}>LOGIN</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
