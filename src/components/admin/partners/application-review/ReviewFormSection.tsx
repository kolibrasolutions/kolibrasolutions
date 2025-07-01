
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  notes: z.string().min(5, {
    message: "Por favor, forneça uma justificativa para a rejeição (mínimo 5 caracteres).",
  }),
});

type ReviewFormSectionProps = {
  onApprove: () => void;
  onReject: (notes: string) => void;
};

export const ReviewFormSection = ({
  onApprove,
  onReject
}: ReviewFormSectionProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notes: "",
    },
  });

  const handleReject = (values: z.infer<typeof formSchema>) => {
    onReject(values.notes);
  };

  return (
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
  );
};
