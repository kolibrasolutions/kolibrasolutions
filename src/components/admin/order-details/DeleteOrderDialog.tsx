
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

type DeleteOrderDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: number;
  onConfirm: () => void;
};

export const DeleteOrderDialog: React.FC<DeleteOrderDialogProps> = ({
  open,
  onOpenChange,
  orderId,
  onConfirm,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Você está prestes a excluir o pedido #{orderId}. Esta ação não pode ser desfeita.
            
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-800">
              <p>Atenção: A exclusão do pedido removerá permanentemente todos os dados associados a este pedido.</p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-red-500 hover:bg-red-600">
            Excluir Pedido
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
