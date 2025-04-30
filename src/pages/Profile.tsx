import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { StripePaymentForm } from '@/components/StripePaymentForm';

type OrderType = {
  id: number;
  created_at: string;
  updated_at: string | null;
  status: string;
  total_price: number;
  initial_payment_amount: number | null;
  final_payment_amount: number | null;
  order_items: {
    id: number;
    service: {
      name: string;
      price: number;
      description: string | null;
    };
    quantity: number;
    price_at_order: number;
  }[];
};

const Profile = () => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [viewOrderDetails, setViewOrderDetails] = useState<OrderType | null>(null);
  const [paymentOrder, setPaymentOrder] = useState<OrderType | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast("Acesso restrito", { description: "Faça login para acessar esta página" });
        navigate('/login?returnUrl=/profile');
        return;
      }
      
      setUser(session.user);
      fetchOrders(session.user.id);
    };
    
    checkAuth();
  }, [navigate]);

  const fetchOrders = async (userId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items:order_items(
            id,
            quantity,
            price_at_order,
            service:services(name, price, description)
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast("Erro", { description: "Não foi possível carregar seus pedidos" });
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('pt-BR');
  };
  
  // Handle payment for finalized orders
  const handlePayFinalAmount = (order: OrderType) => {
    if (order.status !== 'Finalizado') {
      toast("Informação", { 
        description: "O pagamento final só pode ser realizado quando o pedido estiver finalizado" 
      });
      return;
    }
    
    setPaymentOrder(order);
  };
  
  // Get order status badge style
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Aceito':
        return 'bg-blue-100 text-blue-800';
      case 'Em Andamento':
        return 'bg-purple-100 text-purple-800';
      case 'Finalizado':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto py-12 px-4">
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Minha Conta</h1>
        
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
        
        <h2 className="text-2xl font-bold mb-4">Meus Pedidos</h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-xl text-gray-600">Você ainda não possui pedidos</p>
            <Button 
              className="mt-4"
              onClick={() => navigate('/servicos')}
            >
              Explorar Serviços
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableCaption>Lista de seus pedidos</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Pedido</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>#{order.id}</TableCell>
                    <TableCell>{formatDate(order.created_at)}</TableCell>
                    <TableCell>{formatCurrency(order.total_price)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setViewOrderDetails(order)}
                        >
                          Detalhes
                        </Button>
                        
                        {order.status === 'Finalizado' && !order.final_payment_amount && (
                          <Button 
                            size="sm"
                            onClick={() => handlePayFinalAmount(order)}
                            className="bg-green-500 hover:bg-green-600"
                          >
                            Pagar Restante
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        
        {/* Order Details Dialog */}
        <Dialog open={!!viewOrderDetails} onOpenChange={(open) => {
          if (!open) setViewOrderDetails(null);
        }}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalhes do Pedido #{viewOrderDetails?.id}</DialogTitle>
              <DialogDescription>
                Criado em {formatDate(viewOrderDetails?.created_at || null)}
              </DialogDescription>
            </DialogHeader>
            
            {viewOrderDetails && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Informações do Pedido</h3>
                    <div className="space-y-1">
                      <p><span className="font-medium">Status:</span> {viewOrderDetails.status}</p>
                      <p><span className="font-medium">Valor Total:</span> {formatCurrency(viewOrderDetails.total_price)}</p>
                      <p><span className="font-medium">Pagamento Inicial (20%):</span> {formatCurrency(viewOrderDetails.initial_payment_amount || 0)}</p>
                      <p><span className="font-medium">Pagamento Final (80%):</span> {formatCurrency(viewOrderDetails.final_payment_amount || 0)}</p>
                      <p><span className="font-medium">Última Atualização:</span> {formatDate(viewOrderDetails.updated_at)}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Status do Pedido</h3>
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                      <div className="relative flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${viewOrderDetails.status !== 'Pendente' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
                          1
                        </div>
                        <div className="ml-4">
                          <p className="font-semibold">Pedido Recebido</p>
                          <p className="text-sm text-gray-500">Aguardando confirmação</p>
                        </div>
                      </div>
                      
                      <div className="relative flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${['Aceito', 'Em Andamento', 'Finalizado'].includes(viewOrderDetails.status) ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
                          2
                        </div>
                        <div className="ml-4">
                          <p className="font-semibold">Pedido Aceito</p>
                          <p className="text-sm text-gray-500">Preparando para iniciar</p>
                        </div>
                      </div>
                      
                      <div className="relative flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${['Em Andamento', 'Finalizado'].includes(viewOrderDetails.status) ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
                          3
                        </div>
                        <div className="ml-4">
                          <p className="font-semibold">Em Andamento</p>
                          <p className="text-sm text-gray-500">Trabalhando no seu pedido</p>
                        </div>
                      </div>
                      
                      <div className="relative flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${viewOrderDetails.status === 'Finalizado' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
                          4
                        </div>
                        <div className="ml-4">
                          <p className="font-semibold">Finalizado</p>
                          <p className="text-sm text-gray-500">Pedido concluído</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Itens do Pedido</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Serviço</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Qtd</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {viewOrderDetails.order_items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.service?.name || 'N/A'}</TableCell>
                          <TableCell>{item.service?.description || 'Sem descrição'}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.price_at_order * item.quantity)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-semibold">Total</TableCell>
                        <TableCell className="text-right font-semibold">{formatCurrency(viewOrderDetails.total_price)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                
                <div className="flex justify-end space-x-2">
                  {viewOrderDetails.status === 'Finalizado' && !viewOrderDetails.final_payment_amount && (
                    <Button 
                      onClick={() => {
                        handlePayFinalAmount(viewOrderDetails);
                        setViewOrderDetails(null);
                      }}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      Realizar Pagamento Final
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
        
        {/* Payment Dialog */}
        <Dialog open={!!paymentOrder} onOpenChange={(open) => {
          if (!open) setPaymentOrder(null);
        }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Pagamento Final - Pedido #{paymentOrder?.id}</DialogTitle>
              <DialogDescription>
                Complete o pagamento para finalizar seu pedido
              </DialogDescription>
            </DialogHeader>
            
            {paymentOrder && (
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <h3 className="font-semibold mb-2">Resumo do Pedido</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm text-gray-500">Valor Total</p>
                      <p className="font-medium">{formatCurrency(paymentOrder.total_price)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Pagamento Inicial (20%)</p>
                      <p className="font-medium">{formatCurrency(paymentOrder.initial_payment_amount || 0)}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500">Pagamento Final (80%)</p>
                      <p className="font-bold text-xl text-green-600">
                        {formatCurrency(paymentOrder.final_payment_amount || (paymentOrder.total_price * 0.8))}
                      </p>
                    </div>
                  </div>
                </div>
                
                <StripePaymentForm 
                  orderId={paymentOrder.id} 
                  paymentType="final"
                  amount={paymentOrder.final_payment_amount || (paymentOrder.total_price * 0.8)}
                  onSuccess={() => {
                    setPaymentOrder(null);
                    // Update orders list
                    if (user) {
                      fetchOrders(user.id);
                    }
                  }}
                />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Profile;
