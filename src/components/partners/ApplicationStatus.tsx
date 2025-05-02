
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserApplications, PartnerApplication } from '@/services/partners/applicationService';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type ApplicationStatusProps = {
  userId: string;
};

export const ApplicationStatus = ({ userId }: ApplicationStatusProps) => {
  const [application, setApplication] = useState<PartnerApplication | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplication = async () => {
      setLoading(true);
      try {
        const applications = await getUserApplications();
        if (applications.length > 0) {
          setApplication(applications[0]);
        }
      } catch (error) {
        console.error("Erro ao buscar status da solicitação:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchApplication();
    }
  }, [userId]);

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

  if (loading) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl">Status da Solicitação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!application) {
    return null;
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">Status da Solicitação</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">Status:</span>
            <div>{getStatusBadge(application.status)}</div>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Data da Solicitação:</span>
            <span>{format(new Date(application.application_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
          </div>
          {application.status !== 'pendente' && application.review_date && (
            <div className="flex justify-between items-center">
              <span className="font-medium">Data da Revisão:</span>
              <span>{format(new Date(application.review_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
            </div>
          )}
          {application.notes && (
            <div className="pt-2">
              <p className="font-medium mb-1">Observações:</p>
              <p className="text-gray-600">{application.notes}</p>
            </div>
          )}
          {application.status === 'pendente' && (
            <div className="pt-4 text-center text-sm text-muted-foreground">
              Sua solicitação está em análise. Você será notificado assim que for revisada.
            </div>
          )}
          {application.status === 'aprovado' && (
            <div className="pt-4 text-center text-sm text-green-600 font-medium">
              Parabéns! Sua solicitação foi aprovada. Você agora é um parceiro Kolibra.
            </div>
          )}
          {application.status === 'rejeitado' && (
            <div className="pt-4 text-center text-sm text-red-600">
              Infelizmente sua solicitação foi rejeitada. Você pode entrar em contato conosco para mais informações.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
