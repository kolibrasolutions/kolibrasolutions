
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

export type PartnerApplication = {
  id: string;
  user_id: string;
  status: string;
  notes: string;
  application_date: string;
  review_date: string | null;
  review_notes: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export async function submitPartnerApplication(notes: string): Promise<boolean> {
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
  } catch (error: any) {
    console.error("Erro ao enviar solicitação de parceria:", error);
    toast.error("Erro", {
      description: error.message || "Não foi possível enviar sua solicitação. Por favor, tente novamente."
    });
    return false;
  }
}

export async function getUserApplications(): Promise<PartnerApplication[]> {
  try {
    // Get current user session
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;
    
    if (!userId) {
      return [];
    }

    const { data, error } = await supabase
      .from("partner_applications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Erro ao buscar solicitações:", error);
    return [];
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
      toast.success(status === 'aprovado' ? "Solicitação aprovada" : "Solicitação rejeitada", {
        description: status === 'aprovado' 
          ? "O usuário agora é um parceiro Kolibra." 
          : "A solicitação de parceria foi rejeitada."
      });
    }
    
    return !!success;
  } catch (error: any) {
    console.error(`Erro ao ${status === 'aprovado' ? 'aprovar' : 'rejeitar'} solicitação:`, error);
    toast.error("Erro", {
      description: error.message || `Não foi possível ${status === 'aprovado' ? 'aprovar' : 'rejeitar'} a solicitação.`
    });
    return false;
  }
}
