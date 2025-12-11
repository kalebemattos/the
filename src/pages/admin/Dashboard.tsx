import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { 
  ShoppingCart, 
  Image, 
  Users, 
  TrendingUp, 
  DollarSign,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { format, startOfMonth, endOfMonth, startOfDay, endOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DashboardStats {
  totalSalesToday: number;
  totalSalesMonth: number;
  totalGalleries: number;
  totalUsers: number;
  salesCountToday: number;
  salesCountMonth: number;
}

export default function AdminDashboard() {
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalSalesToday: 0,
    totalSalesMonth: 0,
    totalGalleries: 0,
    totalUsers: 0,
    salesCountToday: 0,
    salesCountMonth: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const today = new Date();
      const monthStart = format(startOfMonth(today), 'yyyy-MM-dd');
      const monthEnd = format(endOfMonth(today), 'yyyy-MM-dd');
      const todayStart = format(startOfDay(today), 'yyyy-MM-dd');
      const todayEnd = format(endOfDay(today), 'yyyy-MM-dd');

      // Sales today
      const { data: salesToday } = await supabase
        .from('sales')
        .select('amount')
        .gte('sale_date', todayStart)
        .lte('sale_date', todayEnd)
        .eq('status', 'paid');

      // Sales this month
      const { data: salesMonth } = await supabase
        .from('sales')
        .select('amount')
        .gte('sale_date', monthStart)
        .lte('sale_date', monthEnd)
        .eq('status', 'paid');

      // Galleries count
      const { count: galleriesCount } = await supabase
        .from('galleries')
        .select('*', { count: 'exact', head: true });

      // Users count (only for admin)
      let usersCount = 0;
      if (isAdmin) {
        const { count } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        usersCount = count || 0;
      }

      setStats({
        totalSalesToday: salesToday?.reduce((acc, sale) => acc + Number(sale.amount), 0) || 0,
        totalSalesMonth: salesMonth?.reduce((acc, sale) => acc + Number(sale.amount), 0) || 0,
        totalGalleries: galleriesCount || 0,
        totalUsers: usersCount,
        salesCountToday: salesToday?.length || 0,
        salesCountMonth: salesMonth?.length || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral do sistema - {format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas Hoje</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalSalesToday)}</div>
            <p className="text-xs text-muted-foreground">
              {stats.salesCountToday} vendas realizadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas do Mês</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalSalesMonth)}</div>
            <p className="text-xs text-muted-foreground">
              {stats.salesCountMonth} vendas no total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Galerias</CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalGalleries}</div>
            <p className="text-xs text-muted-foreground">
              galerias cadastradas
            </p>
          </CardContent>
        </Card>

        {isAdmin && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                usuários cadastrados
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              PDV
            </CardTitle>
            <CardDescription>
              Registre vendas e acompanhe o histórico
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/admin/pdv">
                Acessar PDV
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              Galerias
            </CardTitle>
            <CardDescription>
              Gerencie as galerias de imagens do site
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/admin/galleries">
                Gerenciar Galerias
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {isAdmin && (
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Usuários
              </CardTitle>
              <CardDescription>
                Gerencie os usuários e permissões
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/admin/users">
                  Gerenciar Usuários
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
