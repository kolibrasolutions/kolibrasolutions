
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PartnerApplication } from '@/types/partners';

type ApplicationDetailsProps = {
  application: PartnerApplication;
};

export const ApplicationDetails = ({ application }: ApplicationDetailsProps) => {
  const isReviewed = application.status !== 'pendente';
  
  // Display user email if available, otherwise fall back to user_id
  const userDisplay = application.user && application.user.email 
    ? application.user.email 
    : application.user && application.user.full_name 
      ? application.user.full_name 
      : application.user_id;
      
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

  return (
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
        <Label className="text-muted-foreground mb-1 block">Usuário</Label>
        <p className="font-mono text-sm bg-gray-50 p-2 rounded">{userDisplay}</p>
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
          {application.status === 'rejeitado' && application.review_notes && (
            <div>
              <Label className="text-muted-foreground mb-1 block">Motivo da Rejeição</Label>
              <div className="bg-red-50 p-3 rounded border border-red-100 text-sm">
                {application.review_notes}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
