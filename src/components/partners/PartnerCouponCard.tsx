
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPartnerCoupon, toggleCouponStatus } from '@/services/partners/couponService';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Copy, CheckCircle2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

type PartnerCouponCardProps = {
  partnerId: string;
};

export const PartnerCouponCard = ({ partnerId }: PartnerCouponCardProps) => {
  const [coupon, setCoupon] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchCoupon = async () => {
      setLoading(true);
      try {
        const data = await getPartnerCoupon(partnerId);
        setCoupon(data);
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

  const handleToggleActive = async () => {
    if (!coupon) return;
    
    const success = await toggleCouponStatus(coupon.id, !coupon.is_active);
    if (success) {
      setCoupon(prev => ({ ...prev, is_active: !prev.is_active }));
    }
  };

  const handleCopyCode = () => {
    if (!coupon) return;
    
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    toast("Código copiado", {
      description: "O código do cupom foi copiado para a área de transferência."
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Seu Código de Parceiro</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!coupon) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Seu Código de Parceiro</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            Você ainda não recebeu um código de parceiro.
            Entre em contato com a administração.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Seu Código de Parceiro</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <div className="text-sm text-muted-foreground">Seu código personalizado:</div>
            <div className="flex items-center gap-2">
              <div className="bg-gray-100 p-3 rounded-lg flex-1 text-center font-mono font-bold text-lg">
                {coupon.code}
              </div>
              <Button variant="outline" size="icon" onClick={handleCopyCode}>
                {copied ? <CheckCircle2 size={18} className="text-green-600" /> : <Copy size={18} />}
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="text-sm text-muted-foreground">Informações do cupom:</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-muted-foreground">Desconto oferecido</div>
                <div className="font-semibold text-lg">{coupon.discount_percent}%</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-muted-foreground">Sua comissão</div>
                <div className="font-semibold text-lg">{coupon.commission_percent}%</div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="flex flex-col">
              <span className="font-medium">Status do Cupom</span>
              <span className={`text-sm ${coupon.is_active ? 'text-green-600' : 'text-red-600'}`}>
                {coupon.is_active ? 'Ativo' : 'Desativado'}
              </span>
            </div>
            <Switch 
              checked={coupon.is_active} 
              onCheckedChange={handleToggleActive}
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg text-sm mt-4">
            <p className="font-medium">Como usar:</p>
            <p className="mt-2">Compartilhe este código com seus clientes. Eles receberão {coupon.discount_percent}% de desconto e você ganhará {coupon.commission_percent}% de comissão sobre o valor da compra.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
