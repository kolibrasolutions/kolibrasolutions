
import React from 'react';
import Layout from '@/components/Layout';

const Blog = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-green-800 mb-6">Blog</h1>
        
        <div className="bg-green-50 p-8 rounded-lg text-center">
          <p className="text-xl text-gray-700">
            Blog em desenvolvimento. Em breve, compartilharemos dicas e novidades sobre jardinagem e paisagismo aqui.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Blog;
