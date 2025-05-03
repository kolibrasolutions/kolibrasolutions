
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPartnerCoupon } from '@/services/partners/couponService';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/sonner';
import { toggleCouponStatus } from '@/services/partners/couponService';

type PartnerCouponCardProps = {
  partnerId: string;
};

export const PartnerCouponCard = ({ partnerId }: PartnerCouponCardProps) => {
  const [coupon, setCoupon] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchCoupon = async () => {
      setLoading(true);
      try {
        const couponData = await getPartnerCoupon(partnerId);
        setCoupon(couponData);
      } catch (error) {
        console.error("Erro ao buscar cupom:", error);
      } finally {
        setLoading(false);
      }
    };

    if (partnerId) {
      fetchCoupon();
    }
  }, [partnerId]);

  const handleToggleStatus = async () => {
    if (!coupon) return;
    
    setIsUpdating(true);
    try {
      const success = await toggleCouponStatus(coupon.id, !coupon.is_active);
      if (success) {
        // Atualizar estado local
        setCoupon({
          ...coupon,
          is_active: !coupon.is_active
        });
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCopyCode = () => {
    if (!coupon) return;
    
    navigator.clipboard.writeText(coupon.code).then(() => {
      toast.success("Código copiado", {
        description: "O código do cupom foi copiado para a área de transferência."
      });
    }, () => {
      toast.error("Erro", {
        description: "Não foi possível copiar o código. Por favor, copie manualmente."
      });
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Meu Cupom</span>
          {coupon && (
            <div className="flex items-center gap-2 text-sm">
              <span>Ativo</span>
              <Switch 
                checked={coupon.is_active} 
                onCheckedChange={handleToggleStatus} 
                disabled={isUpdating}
              />
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : coupon ? (
          <div>
            <div className="bg-gray-50 rounded-lg border p-4 mb-4">
              <div className="text-sm text-gray-500 mb-1">Seu código de desconto</div>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-mono font-bold">{coupon.code}</div>
                <Button variant="outline" size="sm" onClick={handleCopyCode}>
                  Copiar
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <div className="text-sm text-gray-500 mb-1">Desconto para cliente</div>
                <div className="text-xl font-bold text-blue-600">{coupon.discount_percent}%</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <div className="text-sm text-gray-500 mb-1">Sua comissão</div>
                <div className="text-xl font-bold text-green-600">{coupon.commission_percent}%</div>
              </div>
            </div>

            <p className="text-sm text-gray-500">
              Compartilhe este código com seus contatos. Quando eles usarem seu código em um pedido, 
              receberão {coupon.discount_percent}% de desconto e você ganhará {coupon.commission_percent}% 
              de comissão sobre o valor total do pedido.
            </p>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum cupom encontrado. Entre em contato com o administrador.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
