import { Json } from '@/integrations/supabase/types';

export type OrderItem = {
  id: number;
  service: {
    name: string;
    price: number | null;
    description: string | null;
    is_package: boolean;
    package_items: string[] | null;
    estimated_delivery_days: number | null;
  };
  quantity: number;
  price_at_order: number;
};

export type PaymentInstallment = {
  installment_number: number;
  percentage: number;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  due_date?: string;
  paid_at?: string;
  description: string; // Ex: "Pagamento inicial", "Pagamento intermediário", "Pagamento final"
};

export type PaymentPlan = {
  total_amount: number;
  installments: PaymentInstallment[];
  currency: string;
};

export type BudgetStatus = 'pending' | 'approved' | 'rejected' | 'waiting_approval';

export type OrderStatus = 
  | 'Solicitado'           // Cliente fez a solicitação
  | 'Orçamento Enviado'    // Admin enviou orçamento
  | 'Orçamento Aprovado'   // Cliente aprovou
  | 'Orçamento Rejeitado'  // Cliente rejeitou
  | 'Aguardando Pagamento' // Aguardando parcela
  | 'Em Andamento'         // Trabalho iniciado
  | 'Aguardando Aprovação' // Aguardando aprovação de etapa
  | 'Finalizado'           // Trabalho concluído
  | 'Cancelado';           // Cancelado

export type Order = {
  id: number;
  created_at: string;
  updated_at: string | null;
  status: OrderStatus;
  total_price: number;
  user_id: string;
  
  // Novos campos para orçamento
  budget_status: BudgetStatus | null;
  budget_approved_at: string | null;
  admin_notes: string | null;
  payment_plan: PaymentPlan | null;
  current_installment: number | null;
  
  // Campos antigos mantidos para compatibilidade
  initial_payment_amount: number | null;
  final_payment_amount: number | null;
  
  // Desconto por cupom
  coupon_id: string | null;
  discount_amount: number | null;
  
  order_items: OrderItem[];
};

export type ServicePackage = {
  id: number;
  name: string;
  description: string | null;
  category: string;
  is_package: boolean;
  package_items: string[] | null;
  estimated_delivery_days: number | null;
  price: number | null; // null = orçamento sob consulta
  is_active: boolean;
};

export type PaymentInstallmentConfig = {
  percentage: number;
  description: string;
};

// Configurações predefinidas de parcelas
export const PAYMENT_PLANS = {
  // Plano tradicional (20% + 80%)
  TRADITIONAL: [
    { percentage: 20, description: "Pagamento inicial (20%)" },
    { percentage: 80, description: "Pagamento final (80%)" }
  ],
  
  // Plano em 3 parcelas (20% + 30% + 50%)
  THREE_INSTALLMENTS: [
    { percentage: 20, description: "Pagamento inicial (20%)" },
    { percentage: 30, description: "Pagamento intermediário (30%)" },
    { percentage: 50, description: "Pagamento final (50%)" }
  ],
  
  // Plano em 4 parcelas (25% cada)
  FOUR_EQUAL: [
    { percentage: 25, description: "1ª parcela (25%)" },
    { percentage: 25, description: "2ª parcela (25%)" },
    { percentage: 25, description: "3ª parcela (25%)" },
    { percentage: 25, description: "4ª parcela (25%)" }
  ],
  
  // Plano personalizado
  CUSTOM: [] as PaymentInstallmentConfig[]
};

// Função para validar se as porcentagens somam 100%
export const validatePaymentPlan = (installments: PaymentInstallmentConfig[]): boolean => {
  const total = installments.reduce((sum, installment) => sum + installment.percentage, 0);
  return Math.abs(total - 100) < 0.01; // Permite pequenas diferenças de arredondamento
};

// Função para criar plano de pagamento
export const createPaymentPlan = (
  totalAmount: number, 
  installments: PaymentInstallmentConfig[]
): PaymentPlan => {
  if (!validatePaymentPlan(installments)) {
    throw new Error('As porcentagens das parcelas devem somar 100%');
  }
  
  return {
    total_amount: totalAmount,
    currency: 'BRL',
    installments: installments.map((config, index) => ({
      installment_number: index + 1,
      percentage: config.percentage,
      amount: Math.round((totalAmount * config.percentage) / 100 * 100) / 100, // Arredonda para 2 casas decimais
      status: 'pending' as const,
      description: config.description
    }))
  };
};

export type PortfolioProject = {
  id: string;
  title: string;
  description: string;
  images: string[];  // We'll ensure this is always a string[] in our conversion functions
  published: boolean;
  created_at: string;
  updated_at: string;
};

// Helper function to ensure images from Supabase are properly converted to string arrays
export const convertPortfolioProjectImages = (images: Json): string[] => {
  if (!images) return [];
  if (Array.isArray(images)) {
    // Filter out non-string values and ensure all entries are strings
    return images.filter(item => typeof item === 'string').map(item => String(item));
  }
  // If it's a single string, return it as an array
  if (typeof images === 'string') {
    return [images];
  }
  return [];
};
