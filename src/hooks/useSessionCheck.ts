
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export const useSessionCheck = () => {
  const [sessionChecked, setSessionChecked] = useState(false);
  const [sessionData, setSessionData] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log("Checking user session...");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error checking session:", error);
          setSessionChecked(true);
          return;
        }
        
        console.log("Session data:", data);
        setSessionData(data);
        
        if (data.session) {
          const returnUrl = new URLSearchParams(location.search).get('returnUrl');
          // Only redirect if there's a returnUrl parameter
          if (returnUrl) {
            console.log("User is logged in, redirecting to:", returnUrl);
            navigate(returnUrl);
          } else {
            console.log("User is logged in, but no returnUrl specified. Staying on current page.");
          }
        } else {
          console.log("No active session found");
        }
        
        setSessionChecked(true);
      } catch (err) {
        console.error("Session check exception:", err);
        setSessionChecked(true);
      }
    };
    
    checkSession();
  }, [navigate, location]);

  return { 
    sessionChecked,
    isAuthenticated: !!sessionData?.session,
    userSession: sessionData?.session 
  };
};
