
import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { submitPartnerApplication } from '@/services/partners/applicationService';
import { toast } from '@/components/ui/sonner';

const formSchema = z.object({
  notes: z.string().min(10, {
    message: "Por favor, forneça mais detalhes sobre sua intenção de parceria (mínimo 10 caracteres).",
  }),
});

type BecomePartnerFormProps = {
  onSuccess?: () => void;
};

export const BecomePartnerForm = ({ onSuccess }: BecomePartnerFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notes: "",
    },
  });
  
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const success = await submitPartnerApplication(values.notes);
      if (success && onSuccess) {
        onSuccess();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Torne-se um Parceiro Kolibra</CardTitle>
        <CardDescription>
          Preencha este formulário para solicitar parceria com a Kolibra Solutions e ganhar comissões por indicações.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Por que você quer se tornar um parceiro Kolibra?</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Conte-nos sobre suas intenções, tipo de clientes que você poderia indicar, e como pretende divulgar nossos serviços..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Enviando..." : "Enviar Solicitação"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
