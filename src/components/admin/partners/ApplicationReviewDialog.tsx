
import React from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type ApplicationReviewDialogProps = {
  application: any | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: () => void;
  onReject: (notes: string) => void;
};

const formSchema = z.object({
  notes: z.string().min(5, {
    message: "Por favor, forneça uma justificativa para a rejeição (mínimo 5 caracteres).",
  }),
});

export const ApplicationReviewDialog = ({ 
  application,
  open,
  onOpenChange,
  onApprove, 
  onReject 
}: ApplicationReviewDialogProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notes: "",
    },
  });

  const handleReject = (values: z.infer<typeof formSchema>) => {
    onReject(values.notes);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendente':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case 'aprovado':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Aprovado</Badge>;
      case 'rejeitado':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Rejeitado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!application) return null;

  const isReviewed = application.status !== 'pendente';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isReviewed ? 'Detalhes da Solicitação' : 'Revisar Solicitação de Parceria'}
          </DialogTitle>
          <DialogDescription>
            {isReviewed 
              ? 'Detalhes da solicitação revisada anteriormente.' 
              : 'Revise os detalhes da solicitação antes de aprovar ou rejeitar.'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground mb-1 block">Data da Solicitação</Label>
                <p className="font-medium">
                  {application.application_date 
                    ? format(new Date(application.application_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                    : "N/A"}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground mb-1 block">Status</Label>
                <p>{getStatusBadge(application.status)}</p>
              </div>
            </div>

            <div>
              <Label className="text-muted-foreground mb-1 block">ID do Usuário</Label>
              <p className="font-mono text-sm bg-gray-50 p-2 rounded">{application.user_id}</p>
            </div>

            <div>
              <Label className="text-muted-foreground mb-1 block">Solicitação do Usuário</Label>
              <div className="bg-gray-50 p-3 rounded border text-sm">
                {application.notes || "Nenhuma observação fornecida."}
              </div>
            </div>

            {isReviewed && application.review_date && (
              <>
                <div>
                  <Label className="text-muted-foreground mb-1 block">Data da Revisão</Label>
                  <p className="font-medium">
                    {format(new Date(application.review_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </p>
                </div>
                {application.status === 'rejeitado' && (
                  <div>
                    <Label className="text-muted-foreground mb-1 block">Motivo da Rejeição</Label>
                    <div className="bg-red-50 p-3 rounded border border-red-100 text-sm">
                      {application.notes || "Nenhum motivo fornecido."}
                    </div>
                  </div>
                )}
              </>
            )}

            {!isReviewed && (
              <div className="pt-4">
                <h3 className="font-medium mb-2">Opções de Revisão</h3>
                <div className="bg-blue-50 p-3 rounded text-sm mb-4">
                  <p className="mb-2 font-medium">Ao aprovar esta solicitação:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>O usuário receberá o papel de "partner" no sistema</li>
                    <li>Um código de cupom único será gerado automaticamente</li>
                    <li>O cupom terá 10% de desconto e 10% de comissão</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={onApprove}
                  >
                    Aprovar Solicitação
                  </Button>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleReject)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Motivo da Rejeição</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Descreva o motivo da rejeição..."
                                className="resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        variant="destructive" 
                        className="w-full"
                      >
                        Rejeitar Solicitação
                      </Button>
                    </form>
                  </Form>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {isReviewed ? 'Fechar' : 'Cancelar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
