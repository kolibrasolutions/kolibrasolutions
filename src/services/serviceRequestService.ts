import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { ServiceRequestData } from '@/components/services/ServiceRequestDialog';

export interface ServiceRequest {
  id: number;
  user_id: string;
  service_id: number;
  quantity: number;
  client_notes: string;
  urgency: 'normal' | 'urgent' | 'flexible';
  preferred_contact: 'email' | 'whatsapp' | 'phone';
  budget: string | null;
  status: 'pending' | 'reviewing' | 'quoted' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string | null;
}

export const submitServiceRequest = async (
  requestData: ServiceRequestData, 
  userId: string
): Promise<boolean> => {
  try {
    // Primeiro, vamos criar um pedido com status 'Solicitado'
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        status: 'Solicitado',
        total_price: 0, // Será definido pelo admin
        budget_status: 'pending',
        admin_notes: `Solicitação do cliente:
Urgência: ${requestData.urgency}
Contato preferido: ${requestData.preferredContact}
Orçamento estimado: ${requestData.budget || 'Não informado'}

Observações do cliente:
${requestData.clientNotes}`
      })
      .select()
      .single();

    if (orderError) {
      throw orderError;
    }

    // Criar o item do pedido
    const { error: itemError } = await supabase
      .from('order_items')
      .insert({
        order_id: order.id,
        service_id: requestData.serviceId,
        quantity: requestData.quantity,
        price_at_order: 0 // Será definido pelo admin
      });

    if (itemError) {
      throw itemError;
    }

    return true;
  } catch (error) {
    console.error('Erro ao enviar solicitação:', error);
    toast.error('Erro', {
      description: 'Não foi possível enviar sua solicitação. Tente novamente.'
    });
    return false;
  }
};

export const getServiceRequests = async () => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        user:users(*),
        order_items:order_items(
          *,
          service:services(*)
        )
      `)
      .eq('status', 'Solicitado')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Erro ao buscar solicitações:', error);
    return [];
  }
};

export const updateRequestStatus = async (
  orderId: number, 
  status: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    return false;
  }
}; 