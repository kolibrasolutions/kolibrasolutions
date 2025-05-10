
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
import { PartnerApplication } from '@/types/partners';
import { ApplicationDetails } from './application-review/ApplicationDetails';
import { ReviewFormSection } from './application-review/ReviewFormSection';

type ApplicationReviewDialogProps = {
  application: PartnerApplication | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: () => void;
  onReject: (notes: string) => void;
};

export const ApplicationReviewDialog = ({ 
  application,
  open,
  onOpenChange,
  onApprove, 
  onReject 
}: ApplicationReviewDialogProps) => {
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
          <ApplicationDetails application={application} />

          {!isReviewed && (
            <ReviewFormSection
              onApprove={onApprove}
              onReject={onReject}
            />
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {isReviewed ? 'Fechar' : 'Cancelar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
