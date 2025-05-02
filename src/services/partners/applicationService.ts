
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

export type PartnerApplication = {
  id: string;
  user_id: string;
  status: string;
  application_date: string;
  review_date: string | null;
  reviewer_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export async function submitPartnerApplication(notes: string): Promise<boolean> {
  try {
    // Get current user session
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;
    
    if (!userId) {
      toast("Erro", {
        description: "Você precisa estar logado para enviar uma solicitação de parceria."
      });
      return false;
    }

    const { data: existingApplication, error: checkError } = await supabase
      .from("partner_applications")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "pendente")
      .maybeSingle();

    if (checkError) {
      console.error("Erro ao verificar solicitações existentes:", checkError);
      throw checkError;
    }

    if (existingApplication) {
      toast("Solicitação já enviada", {
        description: "Você já possui uma solicitação de parceria em análise."
      });
      return false;
    }

    const { error } = await supabase.from("partner_applications").insert({
      user_id: userId,
      notes
    });

    if (error) {
      console.error("Erro ao enviar solicitação:", error);
      throw error;
    }

    toast("Solicitação enviada", {
      description: "Sua solicitação de parceria foi enviada com sucesso e será analisada."
    });
    
    return true;
  } catch (error) {
    console.error("Erro ao enviar solicitação de parceria:", error);
    toast("Erro", {
      description: "Não foi possível enviar sua solicitação. Por favor, tente novamente."
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
  reviewerNotes?: string
): Promise<boolean> {
  try {
    // Get current user session
    const { data: sessionData } = await supabase.auth.getSession();
    const reviewerId = sessionData.session?.user?.id;
    
    if (!reviewerId) {
      toast("Erro", {
        description: "Você precisa estar logado para revisar uma solicitação."
      });
      return false;
    }

    const { error } = await supabase
      .from("partner_applications")
      .update({
        status,
        review_date: new Date().toISOString(),
        reviewer_id: reviewerId,
        notes: reviewerNotes ? reviewerNotes : undefined
      })
      .eq("id", id);

    if (error) {
      throw error;
    }

    if (status === 'aprovado') {
      // Se aprovado, atualiza o papel do usuário para parceiro
      const { data: application } = await supabase
        .from("partner_applications")
        .select("user_id")
        .eq("id", id)
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
    console.error(`Erro ao ${status === 'aprovado' ? 'aprovar' : 'rejeitar'} solicitação:`, error);
    toast("Erro", {
      description: `Não foi possível ${status === 'aprovado' ? 'aprovar' : 'rejeitar'} a solicitação.`
    });
    return false;
  }
}
