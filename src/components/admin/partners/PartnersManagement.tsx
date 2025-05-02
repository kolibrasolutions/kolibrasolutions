
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PartnerApplicationsTable } from './PartnerApplicationsTable';
import { PartnerCouponsTable } from './PartnerCouponsTable';
import { PartnerCommissionsTable } from './PartnerCommissionsTable';

export const PartnersManagement = () => {
  const [activeTab, setActiveTab] = useState("applications");

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Gerenciamento de Parceiros</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="applications">Solicitações</TabsTrigger>
            <TabsTrigger value="coupons">Cupons</TabsTrigger>
            <TabsTrigger value="commissions">Comissões</TabsTrigger>
          </TabsList>
          <div className="mt-6">
            <TabsContent value="applications">
              <PartnerApplicationsTable />
            </TabsContent>
            <TabsContent value="coupons">
              <PartnerCouponsTable />
            </TabsContent>
            <TabsContent value="commissions">
              <PartnerCommissionsTable />
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};
