
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
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatCurrency } from '@/lib/utils';

type OrderType = {
  id: number;
  created_at: string;
  updated_at: string | null;
  status: string;
  total_price: number;
  user_id: string;
  initial_payment_amount: number | null;
  final_payment_amount: number | null;
  user: {
    email: string;
    full_name: string | null;
    phone: string | null;
  };
  order_items: {
    id: number;
    service: {
      name: string;
      price: number;
    };
    quantity: number;
    price_at_order: number;
  }[];
};

const Admin = () => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewOrderDetails, setViewOrderDetails] = useState<OrderType | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          toast("Acesso restrito", { description: "Faça login para acessar esta página" });
          navigate('/login?returnUrl=/admin');
          return;
        }
        
        // Check user role
        const { data: userData, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        if (error || !userData || userData.role !== 'admin') {
          toast("Acesso negado", { description: "Você não tem permissão para acessar esta página" });
          navigate('/');
          return;
        }
        
        setIsAdmin(true);
        fetchOrders();
      } finally {
        setAuthChecked(true);
        setLoading(false);
      }
    };
    
    checkAdmin();
  }, [navigate]);

  // Fetch orders with related data
  const fetchOrders = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          user:users(email, full_name, phone),
          order_items:order_items(
            id,
            quantity,
            price_at_order,
            service:services(name, price)
          )
        `)
        .order('created_at', { ascending: false });
      
      if (statusFilter) {
        query = query.eq('status', statusFilter);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast("Erro", { description: "Não foi possível carregar os pedidos" });
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus, updated_at: new Date().toISOString() } 
          : order
      ));
      
      // If status is "Finalizado", call the finalize order function
      if (newStatus === 'Finalizado') {
        await finalizeOrder(orderId);
      }
      
      toast("Status atualizado", { 
        description: `Pedido #${orderId} foi marcado como ${newStatus}` 
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      toast("Erro", { description: "Não foi possível atualizar o status do pedido" });
    }
  };

  // Handle finalization of an order
  const finalizeOrder = async (orderId: number) => {
    try {
      const { error } = await supabase.functions.invoke('handle-order-finalized', {
        body: { order_id: orderId }
      });
      
      if (error) throw error;
      
      toast("Pedido finalizado", { 
        description: "O cliente foi notificado sobre a finalização do pedido" 
      });
    } catch (error) {
      console.error('Error finalizing order:', error);
      toast("Erro", { 
        description: "O pedido foi marcado como finalizado, mas ocorreu um erro ao enviar a notificação" 
      });
    }
  };

  // Filter orders based on search term
  const filteredOrders = orders.filter(order => {
    const searchString = searchTerm.toLowerCase();
    const userEmail = order.user?.email?.toLowerCase() || '';
    const userName = order.user?.full_name?.toLowerCase() || '';
    const orderId = order.id.toString();
    
    return userEmail.includes(searchString) || 
           userName.includes(searchString) || 
           orderId.includes(searchString);
  });

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('pt-BR');
  };

  if (!authChecked) {
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

  if (!isAdmin) {
    return (
      <Layout>
        <div className="container mx-auto py-12 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Acesso Negado</h1>
            <p className="mt-4">Você não tem permissão para acessar esta página.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Painel Administrativo - Pedidos</h1>
        
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="w-full md:w-1/2">
            <Input 
              placeholder="Buscar por cliente ou ID do pedido..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="w-full md:w-1/4">
            <Select
              value={statusFilter || ''}
              onValueChange={(value) => setStatusFilter(value || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="">Todos os status</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Aceito">Aceito</SelectItem>
                  <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                  <SelectItem value="Finalizado">Finalizado</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Button onClick={() => fetchOrders()}>
              Atualizar
            </Button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableCaption>Lista de pedidos</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      Nenhum pedido encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>#{order.id}</TableCell>
                      <TableCell>
                        <div className="font-medium">{order.user?.full_name || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{order.user?.email}</div>
                        {order.user?.phone && (
                          <div className="text-sm text-gray-500">Tel: {order.user.phone}</div>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(order.created_at)}</TableCell>
                      <TableCell>{formatCurrency(order.total_price)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          order.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'Aceito' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'Em Andamento' ? 'bg-purple-100 text-purple-800' :
                          'bg-green-100 text-green-800'
                        }`}>
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
                          
                          {order.status === 'Pendente' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => updateOrderStatus(order.id, 'Aceito')}
                              className="bg-blue-50 hover:bg-blue-100 text-blue-600"
                            >
                              Aceitar
                            </Button>
                          )}
                          
                          {order.status === 'Aceito' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => updateOrderStatus(order.id, 'Em Andamento')}
                              className="bg-purple-50 hover:bg-purple-100 text-purple-600"
                            >
                              Iniciar
                            </Button>
                          )}
                          
                          {order.status === 'Em Andamento' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => updateOrderStatus(order.id, 'Finalizado')}
                              className="bg-green-50 hover:bg-green-100 text-green-600"
                            >
                              Finalizar
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
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
                    <h3 className="text-lg font-semibold mb-2">Informações do Cliente</h3>
                    <div className="space-y-1">
                      <p><span className="font-medium">Nome:</span> {viewOrderDetails.user?.full_name || 'N/A'}</p>
                      <p><span className="font-medium">Email:</span> {viewOrderDetails.user?.email}</p>
                      <p><span className="font-medium">Telefone:</span> {viewOrderDetails.user?.phone || 'N/A'}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Informações do Pedido</h3>
                    <div className="space-y-1">
                      <p><span className="font-medium">Status:</span> {viewOrderDetails.status}</p>
                      <p><span className="font-medium">Valor Total:</span> {formatCurrency(viewOrderDetails.total_price)}</p>
                      <p><span className="font-medium">Pagamento Inicial:</span> {formatCurrency(viewOrderDetails.initial_payment_amount || 0)}</p>
                      <p><span className="font-medium">Pagamento Final:</span> {formatCurrency(viewOrderDetails.final_payment_amount || 0)}</p>
                      <p><span className="font-medium">Última Atualização:</span> {formatDate(viewOrderDetails.updated_at)}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Itens do Pedido</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Serviço</TableHead>
                        <TableHead>Qtd</TableHead>
                        <TableHead>Preço Unit.</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {viewOrderDetails.order_items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.service?.name || 'N/A'}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{formatCurrency(item.price_at_order)}</TableCell>
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
                  {viewOrderDetails.status === 'Pendente' && (
                    <Button 
                      onClick={() => {
                        updateOrderStatus(viewOrderDetails.id, 'Aceito');
                        setViewOrderDetails(null);
                      }}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      Aceitar Pedido
                    </Button>
                  )}
                  
                  {viewOrderDetails.status === 'Aceito' && (
                    <Button 
                      onClick={() => {
                        updateOrderStatus(viewOrderDetails.id, 'Em Andamento');
                        setViewOrderDetails(null);
                      }}
                      className="bg-purple-500 hover:bg-purple-600"
                    >
                      Iniciar Trabalho
                    </Button>
                  )}
                  
                  {viewOrderDetails.status === 'Em Andamento' && (
                    <Button 
                      onClick={() => {
                        updateOrderStatus(viewOrderDetails.id, 'Finalizado');
                        setViewOrderDetails(null);
                      }}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      Finalizar Pedido
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Admin;
