import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import {
  ShoppingCart, Image, Users, TrendingUp, Euro,
  CalendarDays, ArrowRight, MessageSquare, Settings2, UserCheck,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DashboardStats {
  totalReceita: number;
  reservasConfirmadas: number;
  leadsNovos: number;
  galerias: number;
  reservasPendentes: number;
  leadsTotal: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalReceita: 0,
    reservasConfirmadas: 0,
    leadsNovos: 0,
    galerias: 0,
    reservasPendentes: 0,
    leadsTotal: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [bookingsRes, contactsRes, galleriesRes] = await Promise.all([
        supabase.from('bookings').select('status, total_amount'),
        supabase.from('contacts').select('status'),
        supabase.from('galleries').select('id', { count: 'exact', head: true }),
      ]);

      const bookings = bookingsRes.data ?? [];
      const contacts = contactsRes.data ?? [];

      const totalReceita = bookings
        .filter(b => b.status === 'confirmed' || b.status === 'completed')
        .reduce((sum, b) => sum + Number(b.total_amount ?? 0), 0);

      setStats({
        totalReceita,
        reservasConfirmadas: bookings.filter(b => b.status === 'confirmed').length,
        reservasPendentes: bookings.filter(b => b.status === 'pending').length,
        leadsNovos: contacts.filter(c => c.status === 'new').length,
        leadsTotal: contacts.length,
        galerias: galleriesRes.count ?? 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Receita Total (reservas)',
      value: `€ ${stats.totalReceita.toLocaleString('pt-BR')}`,
      sub: 'confirmadas + concluídas',
      icon: Euro,
      color: 'text-green-600',
    },
    {
      title: 'Reservas Confirmadas',
      value: stats.reservasConfirmadas,
      sub: `${stats.reservasPendentes} pendente(s)`,
      icon: CalendarDays,
      color: 'text-primary',
    },
    {
      title: 'Leads Novos',
      value: stats.leadsNovos,
      sub: `${stats.leadsTotal} no total`,
      icon: MessageSquare,
      color: 'text-blue-600',
    },
    {
      title: 'Galerias',
      value: stats.galerias,
      sub: 'cadastradas',
      icon: Image,
      color: 'text-muted-foreground',
    },
  ];

  const quickActions = [
    { name: 'PDV', desc: 'Registre vendas e recebimentos', href: '/admin/pdv', icon: ShoppingCart },
    { name: 'Reservas', desc: 'Calendário de ocupação das casas', href: '/admin/bookings', icon: CalendarDays },
    { name: 'Leads', desc: 'Submissões do formulário do site', href: '/admin/contacts', icon: MessageSquare },
    { name: 'Clientes', desc: 'Cadastro e histórico de clientes', href: '/admin/clients', icon: UserCheck },
    { name: 'Galerias', desc: 'Fotos das casas e do site', href: '/admin/galleries', icon: Image },
    { name: 'Configurações', desc: 'Contato, preços e informações gerais', href: '/admin/settings', icon: Settings2 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          {format(new Date(), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{s.title}</CardTitle>
                <Icon className={`h-4 w-4 ${s.color}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Acesso Rápido</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card key={action.name} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Icon className="h-5 w-5 text-primary" />
                    {action.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{action.desc}</p>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full" size="sm">
                    <Link to={action.href}>
                      Acessar {action.name}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
