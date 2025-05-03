import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

export interface PartnerApplication {
  id: string;
  user_id: string;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  notes: string;
  review_notes: string | null;
  application_date: string;
  review_date: string | null;
  reviewer_id: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export const submitPartnerApplication = async (notes: string): Promise<boolean> => {
  try {
    // Get current user session
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;
    
    if (!userId) {
      toast.error("Erro", {
        description: "Você precisa estar logado para enviar uma solicitação de parceria."
      });
      return false;
    }

    // Usar a função create_partner_application para criar a aplicação
    const { data, error } = await supabase.rpc(
      'create_partner_application',
      { user_id: userId, notes }
    );

    if (error) {
      console.error("Erro ao enviar solicitação:", error);
      toast.error("Erro", {
        description: error.message || "Não foi possível enviar sua solicitação. Por favor, tente novamente."
      });
      return false;
    }

    toast.success("Solicitação enviada", {
      description: "Sua solicitação de parceria foi enviada com sucesso e será analisada."
    });
    
    return true;
  } catch (error) {
    console.error("Erro ao enviar solicitação de parceria:", error);
    toast.error("Erro", {
      description: error instanceof Error ? error.message : "Não foi possível enviar sua solicitação. Por favor, tente novamente."
    });
    return false;
  }
}

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

    return data as PartnerApplication[] || [];
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

export async function reviewApplication(
  id: string, 
  status: 'aprovado' | 'rejeitado', 
  reviewNotes?: string
): Promise<boolean> {
  try {
    let success;
    
    if (status === 'aprovado') {
      const { data, error } = await supabase.rpc(
        'approve_partner_application',
        { application_id: id, review_notes: reviewNotes || '' }
      );
      
      if (error) throw error;
      success = data;
    } else {
      const { data, error } = await supabase.rpc(
        'reject_partner_application',
        { application_id: id, review_notes: reviewNotes || '' }
      );
      
      if (error) throw error;
      success = data;
    }

    if (success) {
      toast.success(
        status === 'aprovado' ? "Solicitação aprovada" : "Solicitação rejeitada",
        {
          description: status === 'aprovado'
            ? "O usuário agora é um parceiro Kolibra."
            : "A solicitação de parceria foi rejeitada."
        }
      );
    }

    return success;
  } catch (error) {
    console.error('Erro ao revisar solicitação:', error);
    toast.error("Erro", {
      description: error instanceof Error ? error.message : `Não foi possível ${status === 'aprovado' ? 'aprovar' : 'rejeitar'} a solicitação.`
    });
    return false;
  }
}
