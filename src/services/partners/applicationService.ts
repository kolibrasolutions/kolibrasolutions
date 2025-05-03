import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

export interface PartnerApplication {
  id: string;
  user_id: string;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  notes: string;
  review_notes?: string;
  application_date: string;
  review_date?: string;
  created_at: string;
  updated_at: string;
}

export const submitPartnerApplication = async (notes: string): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.error('Nenhuma sessão encontrada');
      return false;
    }

    const { error } = await supabase
      .from('partner_applications')
      .insert({
        user_id: session.user.id,
        notes,
        status: 'pendente'
      });

    if (error) {
      console.error('Erro ao enviar solicitação:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro ao enviar solicitação:', error);
    return false;
  }
};

export const getUserApplications = async (): Promise<PartnerApplication[]> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.error('Nenhuma sessão encontrada');
      return [];
    }

    const { data, error } = await supabase
      .from('partner_applications')
      .select('*')
      .order('application_date', { ascending: false });

    if (error) {
      console.error('Erro ao buscar solicitações:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erro ao buscar solicitações:', error);
    return [];
  }
};

export async function getApplicationById(id: string): Promise<PartnerApplication | null> {
  try {
    const { data, error } = await supabase
      .from("partner_applications")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Erro ao buscar solicitação:", error);
    return null;
  }
}

export const reviewApplication = async (
  applicationId: string,
  status: 'aprovado' | 'rejeitado',
  notes: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('partner_applications')
      .update({
        status,
        review_notes: notes,
        review_date: new Date().toISOString()
      })
      .eq('id', applicationId);

    if (error) {
      console.error('Erro ao revisar solicitação:', error);
      return false;
    }

    if (status === 'aprovado') {
      // Se aprovado, atualiza o papel do usuário para parceiro
      const { data: application } = await supabase
        .from("partner_applications")
        .select("user_id")
        .eq("id", applicationId)
        .single();
        
      if (application) {
        await supabase
          .from("users")
          .update({ role: "partner" })
          .eq("id", application.user_id);
      }
    }

    toast(status === 'aprovado' ? "Solicitação aprovada" : "Solicitação rejeitada", {
      description: status === 'aprovado' 
        ? "O usuário agora é um parceiro Kolibra." 
        : "A solicitação de parceria foi rejeitada."
    });
    
    return true;
  } catch (error) {
    console.error('Erro ao revisar solicitação:', error);
    toast("Erro", {
      description: `Não foi possível ${status === 'aprovado' ? 'aprovar' : 'rejeitar'} a solicitação.`
    });
    return false;
  }
};
