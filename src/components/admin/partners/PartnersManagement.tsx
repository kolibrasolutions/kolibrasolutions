
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PartnerApplicationsTable } from './PartnerApplicationsTable';
import { PartnerCouponsTable } from './PartnerCouponsTable';
import { PartnerCommissionsTable } from './PartnerCommissionsTable';

export const PartnersManagement = () => {
  const [activeTab, setActiveTab] = useState("applications");

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Gerenciamento de Parceiros</h2>
      </div>

      <Tabs
        defaultValue="applications"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-6">
          <TabsTrigger value="applications">Solicitações</TabsTrigger>
          <TabsTrigger value="coupons">Cupons</TabsTrigger>
          <TabsTrigger value="commissions">Comissões</TabsTrigger>
        </TabsList>
        
        <TabsContent value="applications" className="mt-0">
          <PartnerApplicationsTable />
        </TabsContent>
        
        <TabsContent value="coupons" className="mt-0">
          <PartnerCouponsTable />
        </TabsContent>
        
        <TabsContent value="commissions" className="mt-0">
          <PartnerCommissionsTable />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PartnersManagement;
