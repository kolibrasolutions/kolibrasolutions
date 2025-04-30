
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useCheckout } from '@/hooks/useCheckout';
import UserSessionCheck from '@/components/auth/UserSessionCheck';
import ServicesContent from '@/components/services/ServicesContent';

const Services = () => {
  const [user, setUser] = useState<any>(null);
  const { handleCheckout, isProcessing } = useCheckout();

  const onCheckout = () => {
    handleCheckout(user);
  };

  return (
    <Layout>
      <UserSessionCheck onUserChange={setUser}>
        {(userLoading) => (
          <ServicesContent onCheckout={onCheckout} />
        )}
      </UserSessionCheck>
    </Layout>
  );
};

export default Services;
