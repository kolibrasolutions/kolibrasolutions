import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PartnerApplicationsTable } from './PartnerApplicationsTable';
import { PartnerCommissionsTable } from './PartnerCommissionsTable';
import { PartnerCouponsTable } from './PartnerCouponsTable';

// Define the props for PartnerCouponsTable
interface PartnerCouponsTableProps {
  onViewCommissions?: (couponId: string) => void;
}

const PartnersManagement = () => {
  // State to track the selected partner/coupon for viewing commissions
  const [selectedCouponId, setSelectedCouponId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("applications");

  // Function to handle selecting a coupon from PartnerCouponsTable
  const handleSelectCoupon = (couponId: string) => {
    setSelectedCouponId(couponId);
    setActiveTab("commissions");
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="applications">Solicitações</TabsTrigger>
          <TabsTrigger value="coupons">Cupons</TabsTrigger>
          <TabsTrigger value="commissions">Comissões</TabsTrigger>
        </TabsList>

        <TabsContent value="applications" className="space-y-6">
          <PartnerApplicationsTable />
        </TabsContent>

        <TabsContent value="coupons" className="space-y-6">
          <PartnerCouponsTable />
        </TabsContent>

        <TabsContent value="commissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Comissões de Parceiros</CardTitle>
              <CardDescription>
                Gerencie as comissões a serem pagas aos parceiros.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedCouponId ? (
                <PartnerCommissionsTable couponId={selectedCouponId} />
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg text-muted-foreground">
                  Selecione um cupom na aba "Cupons" para ver suas comissões.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export { PartnersManagement };
