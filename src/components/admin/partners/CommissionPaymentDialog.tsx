
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

type CommissionPaymentDialogProps = {
  commission: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPaymentComplete: () => void;
};

export const CommissionPaymentDialog = ({ 
  commission, 
  open, 
  onOpenChange, 
  onPaymentComplete 
}: CommissionPaymentDialogProps) => {
  const [paymentReference, setPaymentReference] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);
  };

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      
      const { error } = await supabase
        .from('coupon_uses')
        .update({
          status: 'pago',
          payment_date: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', commission.id);
      
      if (error) throw error;
      
      toast.success("Pagamento processado", {
        description: "O pagamento da comissão foi registrado com sucesso."
      });
      
      onPaymentComplete();
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      toast.error("Erro", {
        description: "Não foi possível processar o pagamento da comissão."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = async () => {
    try {
      setIsProcessing(true);
      
      const { error } = await supabase
        .from('coupon_uses')
        .update({
          status: 'cancelado',
          updated_at: new Date().toISOString(),
        })
        .eq('id', commission.id);
      
      if (error) throw error;
      
      toast.success("Comissão cancelada", {
        description: "A comissão foi cancelada com sucesso."
      });
      
      onPaymentComplete();
    } catch (error) {
      console.error("Erro ao cancelar comissão:", error);
      toast.error("Erro", {
        description: "Não foi possível cancelar a comissão."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!commission) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Processar Pagamento de Comissão</DialogTitle>
          <DialogDescription>
            Registre o pagamento da comissão para o parceiro.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground mb-1 block">Data</Label>
                <p className="font-medium">
                  {commission.created_at 
                    ? format(new Date(commission.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                    : "N/A"}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground mb-1 block">Pedido</Label>
                <p className="font-medium">#{commission.order_id}</p>
              </div>
            </div>

            <div>
              <Label className="text-muted-foreground mb-1 block">Cupom</Label>
              <p className="font-mono text-sm bg-gray-50 p-2 rounded">{commission.coupon?.code || 'N/A'}</p>
            </div>

            <div>
              <Label className="text-muted-foreground mb-1 block">Parceiro</Label>
              <p className="font-medium">{commission.coupon?.partner?.full_name || commission.coupon?.partner?.email || 'N/A'}</p>
            </div>

            <div>
              <Label className="text-muted-foreground mb-1 block">Valor da Comissão</Label>
              <p className="text-lg font-bold text-green-700">{formatCurrency(commission.commission_amount)}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentReference">Referência do Pagamento</Label>
              <Input
                id="paymentReference"
                placeholder="Ex: PIX, transferência, ID da transação..."
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentNotes">Observações (opcional)</Label>
              <Input
                id="paymentNotes"
                placeholder="Observações sobre o pagamento..."
                value={paymentNotes}
                onChange={(e) => setPaymentNotes(e.target.value)}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="destructive"
            onClick={handleCancel}
            disabled={isProcessing}
            className="w-full sm:w-auto"
          >
            Cancelar Comissão
          </Button>
          <Button 
            onClick={handlePayment} 
            disabled={isProcessing || !paymentReference}
            className="w-full sm:w-auto"
          >
            {isProcessing ? "Processando..." : "Confirmar Pagamento"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
