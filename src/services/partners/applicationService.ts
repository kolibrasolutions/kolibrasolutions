
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { PartnerApplication } from "@/types/partners";

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
      .select(`
        *,
        user:users(
          email,
          full_name
        )
      `)
      .order('application_date', { ascending: false });

    if (error) {
      console.error('Erro ao buscar solicitações:', error);
      return [];
    }

    // Normalize user data to handle potential errors in relationships
    return (data || []).map(application => {
      // Handle potential error in user relation
      const normalizedUser = application.user && typeof application.user === 'object' && !('error' in application.user) 
        ? application.user 
        : null;
      
      return {
        ...application,
        user: normalizedUser
      } as PartnerApplication;
    });
  } catch (error) {
    console.error('Erro ao buscar solicitações:', error);
    return [];
  }
};

export async function getApplicationById(id: string): Promise<PartnerApplication | null> {
  try {
    const { data, error } = await supabase
      .from("partner_applications")
      .select(`
        *,
        user:users(
          email,
          full_name
        )
      `)
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }
    
    if (!data) {
      return null;
    }
    
    // Handle potential error in user relation
    const normalizedUser = data.user && typeof data.user === 'object' && !('error' in data.user) 
      ? data.user 
      : null;
    
    return {
      ...data,
      user: normalizedUser
    } as PartnerApplication;
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
    console.log(`Revisando aplicação ${id} com status ${status} e notas: ${reviewNotes || 'sem notas'}`);
    
    let success;
    
    if (status === 'aprovado') {
      const { data, error } = await supabase.rpc(
        'approve_partner_application',
        { application_id: id, review_notes: reviewNotes || '' }
      );
      
      if (error) {
        console.error('Erro ao aprovar solicitação:', error);
        throw error;
      }
      
      success = data;
    } else {
      const { data, error } = await supabase.rpc(
        'reject_partner_application',
        { application_id: id, review_notes: reviewNotes || '' }
      );
      
      if (error) {
        console.error('Erro ao rejeitar solicitação:', error);
        throw error;
      }
      
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
    } else {
      toast.error("Erro na operação", {
        description: "Não foi possível processar a solicitação. Verifique se já não foi processada anteriormente."
      });
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
