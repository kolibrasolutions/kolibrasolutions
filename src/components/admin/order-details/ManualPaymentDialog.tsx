
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ManualPaymentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: number;
  paymentType: 'initial' | 'final' | null;
  selectedPaymentMethod: string;
  setSelectedPaymentMethod: (method: string) => void;
  onConfirm: () => void;
};

export const ManualPaymentDialog: React.FC<ManualPaymentDialogProps> = ({
  open,
  onOpenChange,
  orderId,
  paymentType,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  onConfirm,
}) => {
  // Payment methods options
  const paymentMethods = ["Dinheiro", "PIX", "Transferência bancária", "Outro"];

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Pagamento Manual</AlertDialogTitle>
          <AlertDialogDescription>
            Você está prestes a registrar um {paymentType === 'initial' ? 'pagamento inicial (20%)' : 'pagamento final (80%)'} 
            manual para o pedido #{orderId}.
            
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">
                Método de pagamento:
              </label>
              <select
                className="w-full p-2 border rounded"
                value={selectedPaymentMethod}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              >
                {paymentMethods.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Confirmar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
