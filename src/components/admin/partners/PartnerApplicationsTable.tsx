import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getPartnerApplications } from '@/services/admin/partnersManagement';
import { reviewApplication } from '@/services/partners/applicationService';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ApplicationReviewDialog } from './ApplicationReviewDialog';
import { ptBR } from 'date-fns/locale';
import { toast } from '@/components/ui/sonner';
import { PartnerApplication } from '@/types/partners';
import { getUserDisplay } from '@/utils/supabaseHelpers';

export const PartnerApplicationsTable = () => {
  const queryClient = useQueryClient();
  const [selectedApplication, setSelectedApplication] = useState<PartnerApplication | null>(null);

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['partner-applications'],
    queryFn: getPartnerApplications,
  });

  const handleApprove = async (application: PartnerApplication) => {
    // Approves the application and relies on the database function to create the coupon
    const success = await reviewApplication(application.id, 'aprovado', '');
    
    if (success) {
      // Update the applications list
      queryClient.invalidateQueries({ queryKey: ['partner-applications'] });
      
      toast.success("Sucesso", {
        description: "Solicitação aprovada com sucesso. Um cupom foi criado automaticamente para o parceiro."
      });
    }
  };

  const handleReject = async (application: PartnerApplication, notes: string) => {
    const success = await reviewApplication(application.id, 'rejeitado', notes || '');
    
    if (success) {
      queryClient.invalidateQueries({ queryKey: ['partner-applications'] });
      toast.success("Sucesso", {
        description: "Solicitação rejeitada com sucesso."
      });
    }
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

  // Separar aplicações pendentes e revisadas
  const pendingApplications = applications.filter(app => app.status === 'pendente');
  const reviewedApplications = applications.filter(app => app.status !== 'pendente');

  // Function to display user email safely using the helper
  const renderUserEmail = (application: PartnerApplication) => {
    return getUserDisplay(application.user, application.user_id);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-4">Solicitações Pendentes</h2>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : pendingApplications.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg text-muted-foreground">
            Não há solicitações pendentes.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 font-medium text-muted-foreground">Data</th>
                  <th className="text-left py-3 font-medium text-muted-foreground">Usuário</th>
                  <th className="text-left py-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-right py-3 font-medium text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {pendingApplications.map((application) => (
                  <tr key={application.id} className="border-b">
                    <td className="py-3">
                      {application.application_date 
                        ? format(new Date(application.application_date), "dd/MM/yyyy", { locale: ptBR })
                        : "N/A"}
                    </td>
                    <td className="py-3">
                      {renderUserEmail(application)}
                    </td>
                    <td className="py-3">{getStatusBadge(application.status)}</td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedApplication(application)}
                        >
                          Revisar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Solicitações Revisadas</h2>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : reviewedApplications.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg text-muted-foreground">
            Não há solicitações revisadas.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 font-medium text-muted-foreground">Data</th>
                  <th className="text-left py-3 font-medium text-muted-foreground">Revisão</th>
                  <th className="text-left py-3 font-medium text-muted-foreground">Usuário</th>
                  <th className="text-left py-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-right py-3 font-medium text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {reviewedApplications.map((application) => (
                  <tr key={application.id} className="border-b">
                    <td className="py-3">
                      {application.application_date 
                        ? format(new Date(application.application_date), "dd/MM/yyyy", { locale: ptBR })
                        : "N/A"}
                    </td>
                    <td className="py-3">
                      {application.review_date 
                        ? format(new Date(application.review_date), "dd/MM/yyyy", { locale: ptBR })
                        : "N/A"}
                    </td>
                    <td className="py-3">
                      {renderUserEmail(application)}
                    </td>
                    <td className="py-3">{getStatusBadge(application.status)}</td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedApplication(application)}
                        >
                          Detalhes
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ApplicationReviewDialog
        application={selectedApplication}
        open={!!selectedApplication}
        onOpenChange={(open) => {
          if (!open) setSelectedApplication(null);
        }}
        onApprove={() => selectedApplication && handleApprove(selectedApplication)}
        onReject={(notes) => selectedApplication && handleReject(selectedApplication, notes)}
      />
    </div>
  );
};
