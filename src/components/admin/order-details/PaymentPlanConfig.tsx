import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, AlertCircle, Check } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatCurrency } from '@/lib/utils';
import { 
  PaymentInstallmentConfig, 
  PaymentPlan,
  PAYMENT_PLANS, 
  validatePaymentPlan, 
  createPaymentPlan 
} from '@/types/orders';

interface PaymentPlanConfigProps {
  totalAmount: number;
  onPlanChange: (plan: PaymentPlan | null) => void;
  initialPlan?: PaymentInstallmentConfig[];
}

export const PaymentPlanConfig: React.FC<PaymentPlanConfigProps> = ({
  totalAmount,
  onPlanChange,
  initialPlan = []
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('CUSTOM');
  const [installments, setInstallments] = useState<PaymentInstallmentConfig[]>(
    initialPlan.length > 0 ? initialPlan : PAYMENT_PLANS.THREE_INSTALLMENTS
  );
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const valid = validatePaymentPlan(installments);
    setIsValid(valid);
    
    if (valid && totalAmount > 0) {
      const plan = createPaymentPlan(totalAmount, installments);
      onPlanChange(plan);
    }
  }, [installments, totalAmount, onPlanChange]);

  const handleTemplateChange = (template: string) => {
    setSelectedTemplate(template);
    
    switch (template) {
      case 'TRADITIONAL':
        setInstallments([...PAYMENT_PLANS.TRADITIONAL]);
        break;
      case 'THREE_INSTALLMENTS':
        setInstallments([...PAYMENT_PLANS.THREE_INSTALLMENTS]);
        break;
      case 'FOUR_EQUAL':
        setInstallments([...PAYMENT_PLANS.FOUR_EQUAL]);
        break;
      case 'CUSTOM':
        // Mantém as parcelas atuais
        break;
      default:
        setInstallments([]);
    }
  };

  const addInstallment = () => {
    setInstallments([...installments, { percentage: 0, description: '' }]);
  };

  const removeInstallment = (index: number) => {
    setInstallments(installments.filter((_, i) => i !== index));
  };

  const updateInstallment = (index: number, field: keyof PaymentInstallmentConfig, value: string | number) => {
    const updated = [...installments];
    if (field === 'percentage') {
      updated[index][field] = Number(value);
    } else {
      updated[index][field] = value as string;
    }
    setInstallments(updated);
  };

  const getTotalPercentage = () => {
    return installments.reduce((sum, installment) => sum + installment.percentage, 0);
  };

  const getInstallmentAmount = (percentage: number) => {
    return (totalAmount * percentage) / 100;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurar Plano de Pagamento</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Template Selector */}
        <div>
          <Label htmlFor="template">Modelo de Pagamento</Label>
          <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um modelo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TRADITIONAL">Tradicional (20% + 80%)</SelectItem>
              <SelectItem value="THREE_INSTALLMENTS">3 Parcelas (20% + 30% + 50%)</SelectItem>
              <SelectItem value="FOUR_EQUAL">4 Parcelas Iguais (25% cada)</SelectItem>
              <SelectItem value="CUSTOM">Personalizado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Valor Total */}
        <div>
          <Label>Valor Total do Projeto</Label>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(totalAmount)}
          </div>
        </div>

        {/* Installments Configuration */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Parcelas</Label>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={addInstallment}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Parcela
            </Button>
          </div>

          {installments.map((installment, index) => (
            <div key={index} className="flex gap-4 items-end p-4 border rounded-lg">
              <div className="flex-1">
                <Label htmlFor={`percentage-${index}`}>Porcentagem (%)</Label>
                <Input
                  id={`percentage-${index}`}
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={installment.percentage}
                  onChange={(e) => updateInstallment(index, 'percentage', e.target.value)}
                  placeholder="Ex: 20"
                />
              </div>
              
              <div className="flex-2">
                <Label htmlFor={`description-${index}`}>Descrição</Label>
                <Input
                  id={`description-${index}`}
                  value={installment.description}
                  onChange={(e) => updateInstallment(index, 'description', e.target.value)}
                  placeholder="Ex: Pagamento inicial"
                />
              </div>
              
              <div className="flex-1">
                <Label>Valor</Label>
                <div className="font-semibold text-green-600">
                  {formatCurrency(getInstallmentAmount(installment.percentage))}
                </div>
              </div>
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeInstallment(index)}
                disabled={installments.length <= 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Validation */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span>Total das Porcentagens:</span>
            <span className={`font-bold ${isValid ? 'text-green-600' : 'text-red-600'}`}>
              {getTotalPercentage().toFixed(1)}%
            </span>
          </div>
          
          {!isValid && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                As porcentagens devem somar exatamente 100%. 
                Atualmente: {getTotalPercentage().toFixed(1)}%
              </AlertDescription>
            </Alert>
          )}
          
          {isValid && (
            <Alert>
              <Check className="h-4 w-4" />
              <AlertDescription>
                Plano de pagamento válido! Total: {formatCurrency(totalAmount)} em {installments.length} parcela{installments.length > 1 ? 's' : ''}.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Preview */}
        {isValid && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">Resumo do Plano de Pagamento:</h4>
            <div className="space-y-2">
              {installments.map((installment, index) => (
                <div key={index} className="flex justify-between">
                  <span>{installment.description}</span>
                  <span className="font-semibold">
                    {formatCurrency(getInstallmentAmount(installment.percentage))} 
                    <span className="text-sm text-gray-500 ml-1">
                      ({installment.percentage}%)
                    </span>
                  </span>
                </div>
              ))}
              <div className="border-t pt-2 flex justify-between font-bold">
                <span>Total:</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 