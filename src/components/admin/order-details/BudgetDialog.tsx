import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { formatCurrency } from '@/lib/utils';
import { toast } from '@/components/ui/sonner';
import { PaymentPlanConfig } from './PaymentPlanConfig';
import { PaymentPlan, PaymentInstallmentConfig } from '@/types/orders';
import { OrderType } from '@/types/admin';

interface BudgetDialogProps {
  order: OrderType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (budgetData: BudgetData) => void;
}

export interface BudgetData {
  totalAmount: number;
  adminNotes: string;
  paymentPlan: PaymentPlan;
  estimatedDeliveryDays: number;
}

export const BudgetDialog: React.FC<BudgetDialogProps> = ({
  order,
  open,
  onOpenChange,
  onSubmit
}) => {
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [adminNotes, setAdminNotes] = useState<string>('');
  const [estimatedDeliveryDays, setEstimatedDeliveryDays] = useState<number>(30);
  const [paymentPlan, setPaymentPlan] = useState<PaymentPlan | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!paymentPlan) {
      toast.error('Configuração de Pagamento', {
        description: 'Configure o plano de pagamento antes de enviar o orçamento.'
      });
      return;
    }

    if (totalAmount <= 0) {
      toast.error('Valor Inválido', {
        description: 'O valor total deve ser maior que zero.'
      });
      return;
    }

    if (!adminNotes.trim()) {
      toast.error('Observações Obrigatórias', {
        description: 'Adicione observações sobre o projeto.'
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const budgetData: BudgetData = {
        totalAmount,
        adminNotes: adminNotes.trim(),
        paymentPlan,
        estimatedDeliveryDays
      };

      await onSubmit(budgetData);
      
      // Reset form
      setTotalAmount(0);
      setAdminNotes('');
      setEstimatedDeliveryDays(30);
      setPaymentPlan(null);
      
      onOpenChange(false);
      
      toast.success('Orçamento Enviado', {
        description: 'O orçamento foi enviado para o cliente aprovar.'
      });
    } catch (error) {
      console.error('Erro ao enviar orçamento:', error);
      toast.error('Erro', {
        description: 'Não foi possível enviar o orçamento. Tente novamente.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePlanChange = (plan: PaymentPlan | null) => {
    setPaymentPlan(plan);
  };

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Enviar Orçamento - Pedido #{order.id}</DialogTitle>
          <DialogDescription>
            Configure o valor, parcelas e condições do projeto para o cliente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações do Pedido */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Itens Solicitados:</h3>
            <div className="space-y-2">
              {order.order_items?.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>{item.service?.name} (x{item.quantity})</span>
                  <span className="text-gray-500 text-sm">
                    Preço: {formatCurrency(item.price_at_order)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Valor Total */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="totalAmount">Valor Total do Projeto (R$)</Label>
              <Input
                id="totalAmount"
                type="number"
                min="0"
                step="0.01"
                value={totalAmount}
                onChange={(e) => setTotalAmount(Number(e.target.value))}
                placeholder="Ex: 1000.00"
              />
            </div>
            
            <div>
              <Label htmlFor="deliveryDays">Prazo de Entrega (dias)</Label>
              <Input
                id="deliveryDays"
                type="number"
                min="1"
                value={estimatedDeliveryDays}
                onChange={(e) => setEstimatedDeliveryDays(Number(e.target.value))}
                placeholder="Ex: 30"
              />
            </div>
          </div>

          {/* Observações */}
          <div>
            <Label htmlFor="adminNotes">Observações do Projeto</Label>
            <Textarea
              id="adminNotes"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Descreva os detalhes do projeto, o que está incluído, cronograma, etc..."
              rows={4}
            />
          </div>

          {/* Configuração de Parcelas */}
          {totalAmount > 0 && (
            <PaymentPlanConfig
              totalAmount={totalAmount}
              onPlanChange={handlePlanChange}
            />
          )}

          {/* Resumo */}
          {paymentPlan && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Resumo do Orçamento:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p><strong>Valor Total:</strong> {formatCurrency(totalAmount)}</p>
                  <p><strong>Prazo:</strong> {estimatedDeliveryDays} dias</p>
                  <p><strong>Parcelas:</strong> {paymentPlan.installments.length}</p>
                </div>
                <div>
                  <p><strong>Primeira Parcela:</strong> {formatCurrency(paymentPlan.installments[0]?.amount || 0)}</p>
                  <p><strong>Cliente:</strong> {order.user?.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting || !paymentPlan || totalAmount <= 0}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Orçamento'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 