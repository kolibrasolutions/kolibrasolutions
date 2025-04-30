
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

type UserSessionCheckProps = {
  onUserChange: (user: any) => void;
  children: (loading: boolean) => React.ReactNode;
};

const UserSessionCheck: React.FC<UserSessionCheckProps> = ({ 
  onUserChange,
  children 
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const checkUser = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth session error:", error);
          return;
        }
        
        if (!isMounted) return;
        onUserChange(data.session?.user || null);
      } catch (err) {
        console.error("Session check error:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    checkUser();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;
      onUserChange(session?.user || null);
    });
    
    return () => {
      isMounted = false;
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [onUserChange]);

  return <>{children(loading)}</>;
};

export default UserSessionCheck;
