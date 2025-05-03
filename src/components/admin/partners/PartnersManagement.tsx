
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PartnerApplicationsTable } from './PartnerApplicationsTable';
import { PartnerCommissionsTable } from './PartnerCommissionsTable';
import { PartnerCouponsTable } from './PartnerCouponsTable';

const PartnersManagement: React.FC = () => {
  const [selectedCouponId, setSelectedCouponId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("applications");

  // Function to handle selecting a coupon to view its commissions
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
          <PartnerCouponsTable onSelectCoupon={handleSelectCoupon} />
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
              <PartnerCommissionsTable couponId={selectedCouponId} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PartnersManagement;
