
import { supabase } from "@/integrations/supabase/client";

export const checkUserRole = async (userId: string): Promise<string | null> => {
  try {
    console.log("Checking role for user:", userId);
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error("Error checking user role:", error);
      return null;
    }
    
    console.log("User role data:", data);
    return data?.role || null;
  } catch (error) {
    console.error("Exception checking user role:", error);
    return null;
  }
};
