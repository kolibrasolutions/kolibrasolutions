
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
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type CommissionPaymentDialogProps = {
  commission: any | null;
  onClose: () => void;
  onMarkAsPaid: (paymentDate: string) => void;
  onCancel: () => void;
};

export const CommissionPaymentDialog = ({
  commission,
  onClose,
  onMarkAsPaid,
  onCancel
}: CommissionPaymentDialogProps) => {
  const [paymentDate, setPaymentDate] = useState<Date | undefined>(new Date());
  
  if (!commission) return null;

  const isPending = commission.status === 'pendente';
  const isPaid = commission.status === 'pago';
  const isCancelled = commission.status === 'cancelado';

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendente':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case 'pago':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Pago</Badge>;
      case 'cancelado':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleMarkAsPaid = () => {
    if (paymentDate) {
      onMarkAsPaid(paymentDate.toISOString());
    }
  };

  return (
    <Dialog open={!!commission} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isPending ? 'Gerenciar Comissão' : 'Detalhes da Comissão'}
          </DialogTitle>
          <DialogDescription>
            {isPending 
              ? 'Marque esta comissão como paga ou cancele-a.' 
              : 'Informações sobre a comissão processada.'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground mb-1 block">Data do Uso</Label>
                <p className="font-medium">
                  {commission.created_at 
                    ? format(new Date(commission.created_at), "dd/MM/yyyy", { locale: ptBR })
                    : "N/A"}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground mb-1 block">Status</Label>
                <p>{getStatusBadge(commission.status)}</p>
              </div>
            </div>

            <div>
              <Label className="text-muted-foreground mb-1 block">Parceiro</Label>
              <p className="font-medium">
                {commission.coupon?.partner?.full_name || commission.coupon?.partner?.email || commission.coupon_id}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground mb-1 block">Código do Cupom</Label>
                <p>
                  <code className="bg-gray-100 px-2 py-1 rounded font-mono">
                    {commission.coupon?.code || "N/A"}
                  </code>
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground mb-1 block">Pedido</Label>
                <p>#{commission.order_id}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground mb-1 block">Valor da Comissão</Label>
                <p className="font-semibold text-lg">
                  {formatCurrency(commission.commission_amount)}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground mb-1 block">Valor do Pedido</Label>
                <p>
                  {commission.order?.total_price 
                    ? formatCurrency(commission.order.total_price) 
                    : "N/A"}
                </p>
              </div>
            </div>

            {(isPaid || isCancelled) && (
              <div className="pt-2">
                <Label className="text-muted-foreground mb-1 block">
                  {isPaid ? 'Data do Pagamento' : 'Data do Cancelamento'}
                </Label>
                <p className="font-medium">
                  {commission.payment_date 
                    ? format(new Date(commission.payment_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                    : "N/A"}
                </p>
              </div>
            )}

            {isPending && (
              <div className="pt-4 space-y-4">
                <div className="space-y-2">
                  <Label>Data do Pagamento</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !paymentDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {paymentDate ? format(paymentDate, "dd/MM/yyyy", { locale: ptBR }) : "Selecione uma data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={paymentDate}
                        onSelect={setPaymentDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="pt-4 flex gap-4 flex-col sm:flex-row">
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={handleMarkAsPaid}
                  >
                    Marcar como Pago
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={onCancel}
                  >
                    Cancelar Comissão
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
