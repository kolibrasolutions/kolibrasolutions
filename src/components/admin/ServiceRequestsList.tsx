import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MessageSquare, Eye, CheckCircle, X, Clock } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { getServiceRequests, updateRequestStatus } from '@/services/serviceRequestService';
import { BudgetDialog, BudgetData } from '@/components/admin/order-details/BudgetDialog';
import { supabase } from '@/integrations/supabase/client';
import { OrderType } from '@/types/admin';

export const ServiceRequestsList = () => {
  const [selectedRequest, setSelectedRequest] = useState<OrderType | null>(null);
  const [budgetDialogOpen, setBudgetDialogOpen] = useState(false);
  const [requests, setRequests] = useState<OrderType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const data = await getServiceRequests();
      setRequests(data);
    } catch (error) {
      console.error('Erro ao buscar solicitações:', error);
      toast.error('Erro', {
        description: 'Não foi possível carregar as solicitações. Tente novamente.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar solicitações ao montar o componente
  useEffect(() => {
    fetchRequests();

    // Atualizar a cada 30 segundos
    const interval = setInterval(fetchRequests, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleViewRequest = (request: OrderType) => {
    setSelectedRequest(request);
  };

  const handleSendBudget = (request: OrderType) => {
    setSelectedRequest(request);
    setBudgetDialogOpen(true);
  };

  const handleSubmitBudget = async (budgetData: BudgetData) => {
    if (!selectedRequest) return;

    try {
      // Atualizar o pedido com os dados do orçamento
      const { error } = await supabase
        .from('orders')
        .update({
          total_price: budgetData.totalAmount,
          admin_notes: budgetData.adminNotes,
          payment_plan: budgetData.paymentPlan,
          budget_status: 'waiting_approval',
          status: 'Orçamento Enviado',
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedRequest.id);

      if (error) throw error;

      toast.success('Orçamento Enviado', {
        description: 'O orçamento foi enviado para o cliente aprovar.'
      });

      // Refresh the requests list
      fetchRequests();
      setBudgetDialogOpen(false);
      setSelectedRequest(null);
    } catch (error) {
      console.error('Erro ao enviar orçamento:', error);
      toast.error('Erro', {
        description: 'Não foi possível enviar o orçamento. Tente novamente.'
      });
    }
  };

  const handleRejectRequest = async (request: OrderType) => {
    try {
      const success = await updateRequestStatus(request.id, 'Rejeitado');
      if (success) {
        toast.success('Solicitação Rejeitada', {
          description: 'A solicitação foi rejeitada.'
        });
        fetchRequests();
      }
    } catch (error) {
      console.error('Erro ao rejeitar solicitação:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Solicitado':
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Aguardando
          </Badge>
        );
      case 'Orçamento Enviado':
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            <MessageSquare className="w-3 h-3 mr-1" />
            Orçamento Enviado
          </Badge>
        );
      case 'Rejeitado':
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            <X className="w-3 h-3 mr-1" />
            Rejeitado
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'urgent':
        return <Badge variant="destructive" className="text-xs">Urgente</Badge>;
      case 'normal':
        return <Badge variant="secondary" className="text-xs">Normal</Badge>;
      case 'flexible':
        return <Badge variant="outline" className="text-xs">Flexível</Badge>;
      default:
        return null;
    }
  };

  const extractUrgencyFromNotes = (notes: string): string => {
    if (notes.includes('Urgência: urgent')) return 'urgent';
    if (notes.includes('Urgência: flexible')) return 'flexible';
    return 'normal';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma solicitação</h3>
        <p className="text-gray-500">Quando os clientes solicitarem orçamentos, eles aparecerão aqui.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Solicitações de Orçamento</h2>
        <Button onClick={fetchRequests} variant="outline" size="sm">
          Atualizar
        </Button>
      </div>

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Serviço</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Urgência</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request: OrderType) => (
              <TableRow key={request.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{request.user?.full_name || 'N/A'}</div>
                    <div className="text-sm text-gray-500">{request.user?.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    {request.order_items?.map((item: any, index: number) => (
                      <div key={index}>
                        <div className="font-medium">{item.service?.name}</div>
                        <div className="text-sm text-gray-500">Qtd: {item.quantity}</div>
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(request.status)}</TableCell>
                <TableCell>
                  {getUrgencyBadge(extractUrgencyFromNotes(request.admin_notes || ''))}
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {formatDistanceToNow(new Date(request.created_at), { 
                      addSuffix: true, 
                      locale: ptBR 
                    })}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewRequest(request)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Ver
                    </Button>
                    
                    {request.status === 'Solicitado' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSendBudget(request)}
                          className="bg-green-50 hover:bg-green-100 text-green-600"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Orçar
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRejectRequest(request)}
                          className="bg-red-50 hover:bg-red-100 text-red-600"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Rejeitar
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Budget Dialog */}
      <BudgetDialog
        order={selectedRequest}
        open={budgetDialogOpen}
        onOpenChange={setBudgetDialogOpen}
        onSubmit={handleSubmitBudget}
      />
    </div>
  );
}; 