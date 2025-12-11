import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { z } from 'zod';
import { 
  Plus, 
  Search, 
  Download, 
  CalendarIcon, 
  TrendingUp,
  DollarSign,
  Pencil,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Sale {
  id: string;
  client_name: string;
  client_email: string | null;
  client_phone: string | null;
  product_service: string;
  amount: number;
  status: 'pending' | 'paid' | 'cancelled';
  sale_date: string;
  notes: string | null;
  created_at: string;
}

type SaleStatus = 'pending' | 'paid' | 'cancelled';

const saleSchema = z.object({
  client_name: z.string().min(2, 'Nome do cliente é obrigatório').max(100),
  client_email: z.string().email('Email inválido').optional().or(z.literal('')),
  client_phone: z.string().max(20).optional().or(z.literal('')),
  product_service: z.string().min(2, 'Produto/serviço é obrigatório').max(200),
  amount: z.number().positive('Valor deve ser positivo'),
  status: z.enum(['pending', 'paid', 'cancelled']),
  sale_date: z.string(),
  notes: z.string().max(500).optional().or(z.literal('')),
});

export default function AdminPDV() {
  const { user } = useAuth();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  
  // Filters
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterClient, setFilterClient] = useState('');
  const [filterDateStart, setFilterDateStart] = useState<Date | undefined>(startOfMonth(new Date()));
  const [filterDateEnd, setFilterDateEnd] = useState<Date | undefined>(endOfMonth(new Date()));

  // Form data
  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    product_service: '',
    amount: '',
    status: 'pending' as 'pending' | 'paid' | 'cancelled',
    sale_date: format(new Date(), 'yyyy-MM-dd'),
    notes: '',
  });

  // Stats
  const [stats, setStats] = useState({
    totalMonth: 0,
    totalDay: 0,
    topProducts: [] as { product: string; count: number }[],
  });

  useEffect(() => {
    fetchSales();
  }, [filterStatus, filterClient, filterDateStart, filterDateEnd]);

  const fetchSales = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('sales')
        .select('*')
        .order('sale_date', { ascending: false });

      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }

      if (filterClient) {
        query = query.ilike('client_name', `%${filterClient}%`);
      }

      if (filterDateStart) {
        query = query.gte('sale_date', format(filterDateStart, 'yyyy-MM-dd'));
      }

      if (filterDateEnd) {
        query = query.lte('sale_date', format(filterDateEnd, 'yyyy-MM-dd'));
      }

      const { data, error } = await query;

      if (error) throw error;
      const typedData = (data || []).map(sale => ({
        ...sale,
        status: sale.status as SaleStatus,
      }));
      setSales(typedData);
      calculateStats(typedData);
    } catch (error) {
      console.error('Error fetching sales:', error);
      toast.error('Erro ao carregar vendas');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (salesData: Sale[]) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const paidSales = salesData.filter(s => s.status === 'paid');
    
    const totalMonth = paidSales.reduce((acc, sale) => acc + Number(sale.amount), 0);
    const totalDay = paidSales
      .filter(s => s.sale_date === today)
      .reduce((acc, sale) => acc + Number(sale.amount), 0);

    // Top products
    const productCount: Record<string, number> = {};
    paidSales.forEach(sale => {
      productCount[sale.product_service] = (productCount[sale.product_service] || 0) + 1;
    });

    const topProducts = Object.entries(productCount)
      .map(([product, count]) => ({ product, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    setStats({ totalMonth, totalDay, topProducts });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const validatedData = saleSchema.parse({
        ...formData,
        amount: parseFloat(formData.amount),
        client_email: formData.client_email || null,
        client_phone: formData.client_phone || null,
        notes: formData.notes || null,
      });

      if (editingSale) {
        const { error } = await supabase
          .from('sales')
          .update({
            client_name: validatedData.client_name,
            client_email: validatedData.client_email,
            client_phone: validatedData.client_phone,
            product_service: validatedData.product_service,
            amount: validatedData.amount,
            status: validatedData.status,
            sale_date: validatedData.sale_date,
            notes: validatedData.notes,
          })
          .eq('id', editingSale.id);

        if (error) throw error;
        toast.success('Venda atualizada com sucesso');
      } else {
        const { error } = await supabase
          .from('sales')
          .insert([{
            client_name: validatedData.client_name,
            client_email: validatedData.client_email,
            client_phone: validatedData.client_phone,
            product_service: validatedData.product_service,
            amount: validatedData.amount,
            status: validatedData.status,
            sale_date: validatedData.sale_date,
            notes: validatedData.notes,
            created_by: user?.id,
          }]);

        if (error) throw error;
        toast.success('Venda registrada com sucesso');
      }

      setDialogOpen(false);
      resetForm();
      fetchSales();
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        console.error('Error saving sale:', error);
        toast.error('Erro ao salvar venda');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta venda?')) return;

    try {
      const { error } = await supabase
        .from('sales')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Venda excluída');
      fetchSales();
    } catch (error) {
      console.error('Error deleting sale:', error);
      toast.error('Erro ao excluir venda');
    }
  };

  const resetForm = () => {
    setFormData({
      client_name: '',
      client_email: '',
      client_phone: '',
      product_service: '',
      amount: '',
      status: 'pending',
      sale_date: format(new Date(), 'yyyy-MM-dd'),
      notes: '',
    });
    setEditingSale(null);
  };

  const openEditDialog = (sale: Sale) => {
    setEditingSale(sale);
    setFormData({
      client_name: sale.client_name,
      client_email: sale.client_email || '',
      client_phone: sale.client_phone || '',
      product_service: sale.product_service,
      amount: sale.amount.toString(),
      status: sale.status,
      sale_date: sale.sale_date,
      notes: sale.notes || '',
    });
    setDialogOpen(true);
  };

  const exportCSV = () => {
    const headers = ['Data', 'Cliente', 'Email', 'Telefone', 'Produto/Serviço', 'Valor', 'Status', 'Observações'];
    const rows = sales.map(sale => [
      format(new Date(sale.sale_date), 'dd/MM/yyyy'),
      sale.client_name,
      sale.client_email || '',
      sale.client_phone || '',
      sale.product_service,
      sale.amount.toFixed(2),
      sale.status === 'paid' ? 'Pago' : sale.status === 'pending' ? 'Pendente' : 'Cancelado',
      sale.notes || '',
    ]);

    const csvContent = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `vendas_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500">Pago</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pendente</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">PDV</h1>
          <p className="text-muted-foreground">Ponto de venda e controle de vendas</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Venda
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingSale ? 'Editar Venda' : 'Nova Venda'}</DialogTitle>
              <DialogDescription>
                Preencha os dados da venda
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client_name">Nome do Cliente *</Label>
                <Input
                  id="client_name"
                  value={formData.client_name}
                  onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client_email">Email</Label>
                  <Input
                    id="client_email"
                    type="email"
                    value={formData.client_email}
                    onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client_phone">Telefone</Label>
                  <Input
                    id="client_phone"
                    value={formData.client_phone}
                    onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="product_service">Produto/Serviço *</Label>
                <Input
                  id="product_service"
                  value={formData.product_service}
                  onChange={(e) => setFormData({ ...formData, product_service: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Valor (R$) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: 'pending' | 'paid' | 'cancelled') => 
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="paid">Pago</SelectItem>
                      <SelectItem value="cancelled">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sale_date">Data da Venda</Label>
                <Input
                  id="sale_date"
                  type="date"
                  value={formData.sale_date}
                  onChange={(e) => setFormData({ ...formData, sale_date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>

              <DialogFooter>
                <Button type="submit">
                  {editingSale ? 'Atualizar' : 'Registrar'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total do Dia</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalDay)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total do Período</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalMonth)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Mais Vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {stats.topProducts.length > 0 ? (
                stats.topProducts.slice(0, 3).map((item, index) => (
                  <div key={index} className="text-sm flex justify-between">
                    <span className="text-muted-foreground truncate">{item.product}</span>
                    <span className="font-medium">{item.count}x</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Nenhuma venda ainda</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label>Cliente</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar cliente..."
                  className="pl-10"
                  value={filterClient}
                  onChange={(e) => setFilterClient(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="paid">Pago</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Data Início</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !filterDateStart && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filterDateStart ? format(filterDateStart, 'dd/MM/yyyy') : 'Selecionar'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filterDateStart}
                    onSelect={setFilterDateStart}
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Data Fim</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !filterDateEnd && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filterDateEnd ? format(filterDateEnd, 'dd/MM/yyyy') : 'Selecionar'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filterDateEnd}
                    onSelect={setFilterDateEnd}
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button variant="outline" onClick={exportCSV}>
              <Download className="mr-2 h-4 w-4" />
              Exportar CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sales Table */}
      <Card>
        <CardHeader>
          <CardTitle>Vendas</CardTitle>
          <CardDescription>{sales.length} vendas encontradas</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : sales.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhuma venda encontrada
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Produto/Serviço</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell>
                        {format(new Date(sale.sale_date), 'dd/MM/yyyy')}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{sale.client_name}</p>
                          {sale.client_email && (
                            <p className="text-sm text-muted-foreground">{sale.client_email}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{sale.product_service}</TableCell>
                      <TableCell>{formatCurrency(sale.amount)}</TableCell>
                      <TableCell>{getStatusBadge(sale.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(sale)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(sale.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
