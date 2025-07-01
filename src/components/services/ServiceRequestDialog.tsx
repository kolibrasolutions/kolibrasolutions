import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Package, Clock, MessageSquare } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { ServicePackage } from '@/types/orders';
import { formatCurrency } from '@/lib/utils';

interface ServiceRequestDialogProps {
  service: ServicePackage | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (requestData: ServiceRequestData) => void;
}

export interface ServiceRequestData {
  serviceId: number;
  quantity: number;
  clientNotes: string;
  urgency: 'normal' | 'urgent' | 'flexible';
  preferredContact: 'email' | 'whatsapp' | 'phone';
  budget: string;
}

export const ServiceRequestDialog: React.FC<ServiceRequestDialogProps> = ({
  service,
  open,
  onOpenChange,
  onSubmit
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [clientNotes, setClientNotes] = useState<string>('');
  const [urgency, setUrgency] = useState<'normal' | 'urgent' | 'flexible'>('normal');
  const [preferredContact, setPreferredContact] = useState<'email' | 'whatsapp' | 'phone'>('email');
  const [budget, setBudget] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!service) return;

    if (!clientNotes.trim()) {
      toast.error('Informações Obrigatórias', {
        description: 'Por favor, descreva suas necessidades para o projeto.'
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const requestData: ServiceRequestData = {
        serviceId: service.id,
        quantity,
        clientNotes: clientNotes.trim(),
        urgency,
        preferredContact,
        budget: budget.trim()
      };

      await onSubmit(requestData);
      
      // Reset form
      setQuantity(1);
      setClientNotes('');
      setUrgency('normal');
      setPreferredContact('email');
      setBudget('');
      
      onOpenChange(false);
      
      toast.success('Solicitação Enviada', {
        description: 'Sua solicitação foi enviada! Entraremos em contato em breve com um orçamento personalizado.'
      });
    } catch (error) {
      console.error('Erro ao enviar solicitação:', error);
      toast.error('Erro', {
        description: 'Não foi possível enviar sua solicitação. Tente novamente.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!service) return null;

  const urgencyOptions = [
    { value: 'flexible', label: 'Flexível', description: 'Posso aguardar o prazo normal' },
    { value: 'normal', label: 'Normal', description: 'Prazo padrão está bom' },
    { value: 'urgent', label: 'Urgente', description: 'Preciso com prioridade' }
  ];

  const contactOptions = [
    { value: 'email', label: 'E-mail', description: 'Prefiro contato por e-mail' },
    { value: 'whatsapp', label: 'WhatsApp', description: 'Prefiro contato por WhatsApp' },
    { value: 'phone', label: 'Telefone', description: 'Prefiro contato por telefone' }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Solicitar Orçamento
          </DialogTitle>
          <DialogDescription>
            Preencha os detalhes abaixo para receber um orçamento personalizado.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações do Serviço */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold">{service.name}</h3>
              {service.is_package && (
                <Badge variant="secondary" className="text-xs">
                  <Package className="w-3 h-3 mr-1" />
                  Pacote
                </Badge>
              )}
            </div>
            
            <p className="text-gray-600 text-sm mb-3">{service.description}</p>
            
            {service.package_items && service.package_items.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-medium text-gray-600 mb-1">Inclui:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                  {service.package_items.map((item, index) => (
                    <div key={index} className="flex items-center text-xs text-gray-500">
                      <span className="w-1 h-1 bg-kolibra-orange rounded-full mr-2"></span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between text-sm">
              {service.estimated_delivery_days && (
                <div className="flex items-center text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  Prazo estimado: {service.estimated_delivery_days} dias
                </div>
              )}
              
              {service.price && (
                <div className="text-kolibra-orange font-semibold">
                  A partir de {formatCurrency(service.price)}
                </div>
              )}
            </div>
          </div>

          {/* Quantidade */}
          <div>
            <Label htmlFor="quantity">Quantidade</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-24"
            />
          </div>

          {/* Descrição das Necessidades */}
          <div>
            <Label htmlFor="clientNotes">Descreva suas necessidades *</Label>
            <Textarea
              id="clientNotes"
              value={clientNotes}
              onChange={(e) => setClientNotes(e.target.value)}
              placeholder="Descreva detalhadamente o que você precisa, suas expectativas, referências, etc..."
              rows={4}
              required
            />
          </div>

          {/* Orçamento Estimado */}
          <div>
            <Label htmlFor="budget">Orçamento Estimado (opcional)</Label>
            <Input
              id="budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="Ex: R$ 1.000 - R$ 2.000"
            />
            <p className="text-xs text-gray-500 mt-1">
              Nos ajuda a criar uma proposta mais adequada ao seu orçamento
            </p>
          </div>

          {/* Urgência */}
          <div>
            <Label>Urgência do Projeto</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
              {urgencyOptions.map((option) => (
                <div
                  key={option.value}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    urgency === option.value
                      ? 'border-kolibra-orange bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setUrgency(option.value as 'normal' | 'urgent' | 'flexible')}
                >
                  <div className="font-medium text-sm">{option.label}</div>
                  <div className="text-xs text-gray-500">{option.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Forma de Contato Preferida */}
          <div>
            <Label>Forma de Contato Preferida</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
              {contactOptions.map((option) => (
                <div
                  key={option.value}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    preferredContact === option.value
                      ? 'border-kolibra-blue bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setPreferredContact(option.value as 'email' | 'whatsapp' | 'phone')}
                >
                  <div className="font-medium text-sm">{option.label}</div>
                  <div className="text-xs text-gray-500">{option.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting || !clientNotes.trim()}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Solicitação'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 