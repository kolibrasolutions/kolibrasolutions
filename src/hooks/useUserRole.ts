
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { checkUserRole } from '@/services/partners/partnerService';

export const useUserRole = (userId: string | undefined) => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!userId) {
        setUserRole(null);
        setIsLoading(false);
        return;
      }

      try {
        const role = await checkUserRole(userId);
        console.log("Fetched user role:", role);
        setUserRole(role);
      } catch (error) {
        console.error('Erro ao verificar role do usuário:', error);
        setUserRole(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, [userId]);

  const updateRole = async (newRole: string) => {
    if (!userId) return false;

    try {
      const { data, error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar role do usuário:', error);
        return false;
      }

      setUserRole(data.role);
      return true;
    } catch (error) {
      console.error('Erro ao atualizar role do usuário:', error);
      return false;
    }
  };

  return { userRole, isLoading, updateRole };
}; 
