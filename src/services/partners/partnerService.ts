import { supabase } from '@/integrations/supabase/client';

export const checkUserRole = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Erro ao verificar role do usuário:', error);
      return null;
    }

    return data?.role;
  } catch (error) {
    console.error('Erro ao verificar role do usuário:', error);
    return null;
  }
};

export const updateUserRole = async (userId: string, role: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({ role })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar role do usuário:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro ao atualizar role do usuário:', error);
    return false;
  }
}; 