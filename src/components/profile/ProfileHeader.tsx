import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Order } from '@/types/orders';

// Log fora do componente para garantir que o arquivo está sendo carregado
console.log("ProfileHeader carregado!");

type ProfileHeaderProps = {
  user: any;
  orders: Order[];
};

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, orders }) => {
  // Log para descobrir os campos do usuário
  console.log("Usuário no perfil:", user);
  console.log("Role do usuário:", user?.role);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Informações Pessoais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Nome</p>
              <p className="font-medium">{user.user_metadata?.full_name || 'Não informado'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Telefone</p>
              <p className="font-medium">{user.user_metadata?.phone || 'Não informado'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Resumo de Pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Total de Pedidos</p>
              <p className="text-2xl font-bold">{orders.length}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-700">Pendentes</p>
              <p className="text-2xl font-bold text-yellow-700">
                {orders.filter(order => order.status === 'Pendente').length}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-700">Em Andamento</p>
              <p className="text-2xl font-bold text-purple-700">
                {orders.filter(order => ['Aceito', 'Em Andamento'].includes(order.status)).length}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-700">Finalizados</p>
              <p className="text-2xl font-bold text-green-700">
                {orders.filter(order => order.status === 'Finalizado').length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileHeader;