
import React from 'react';
import Layout from '@/components/Layout';
import AuthForm from '@/components/auth/AuthForm';
import { useLoginForm } from '@/hooks/useLoginForm';
import { useSessionCheck } from '@/hooks/useSessionCheck';

const Login = () => {
  const { sessionChecked } = useSessionCheck();
  const loginForm = useLoginForm();
  
  if (!sessionChecked) {
    return (
      <Layout>
        <div className="container mx-auto py-12 px-4 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-md mx-auto">
          <AuthForm {...loginForm} />
        </div>
      </div>
    </Layout>
  );
};

export default Login;
