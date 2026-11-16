import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard, ShoppingCart, Image, Users, LogOut,
  UserCheck, CalendarDays, MessageSquare, Settings2, MoreHorizontal,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import logo from '@/assets/logo.png';

export function AdminLayout() {
  const { user, loading, isAdminOrOperator, signOut } = useAuth();
  const role = user?.role;
  const location = useLocation();
  const currentPath = location.pathname;
  const [moreOpen, setMoreOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/admin/login" replace />;

  if (!isAdminOrOperator) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Acesso Negado</h1>
          <p className="text-muted-foreground mb-4">Você não tem permissão para acessar esta área.</p>
          <Button onClick={signOut}>Sair</Button>
        </div>
      </div>
    );
  }

  const isActive = (href: string) =>
    href === '/admin' ? currentPath === '/admin' : currentPath.startsWith(href);

  // All nav items
  const allNav = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'PDV', href: '/admin/pdv', icon: ShoppingCart },
    { name: 'Clientes', href: '/admin/clients', icon: UserCheck },
    { name: 'Reservas', href: '/admin/bookings', icon: CalendarDays },
    { name: 'Leads', href: '/admin/contacts', icon: MessageSquare },
    { name: 'Galerias', href: '/admin/galleries', icon: Image },
    { name: 'Configurações', href: '/admin/settings', icon: Settings2 },
    ...(role === 'admin' ? [{ name: 'Usuários', href: '/admin/users', icon: Users }] : []),
  ];

  // Bottom tab bar: 4 primary + "Mais"
  const bottomPrimary = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Reservas', href: '/admin/bookings', icon: CalendarDays },
    { name: 'Leads', href: '/admin/contacts', icon: MessageSquare },
    { name: 'PDV', href: '/admin/pdv', icon: ShoppingCart },
  ];
  const moreItems = allNav.filter(n => !bottomPrimary.some(b => b.href === n.href));

  return (
    <div className="min-h-screen bg-muted/30">

      {/* ── Mobile top header ── */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 z-40 bg-card border-b border-border flex items-center px-4 gap-3">
        <div className="flex-1 flex items-center gap-2">
          <div className="bg-ocean-deep rounded-md px-2 py-1">
            <img src={logo} alt="The Best of Angra" className="h-7 w-auto" style={{ mixBlendMode: 'screen' }} />
          </div>
          <span className="text-xs text-muted-foreground capitalize">· {role}</span>
        </div>
        <Button variant="ghost" size="icon" onClick={signOut} title="Sair">
          <LogOut className="h-5 w-5" />
        </Button>
      </header>

      {/* ── Desktop sidebar ── */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 z-40 w-64 flex-col bg-card border-r border-border">
        <div className="p-6 border-b border-border">
          <div className="bg-ocean-deep rounded-lg px-3 py-2 mb-2 inline-flex">
            <img src={logo} alt="The Best of Angra" className="h-10 w-auto" style={{ mixBlendMode: 'screen' }} />
          </div>
          <p className="text-sm text-muted-foreground capitalize">{role}</p>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {allNav.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                isActive(item.href)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <Button variant="ghost" className="w-full justify-start gap-3" onClick={signOut}>
            <LogOut className="h-5 w-5" />
            Sair
          </Button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="lg:pl-64 pt-14 lg:pt-0 pb-20 lg:pb-0">
        <div className="p-4 lg:p-8">
          <Outlet />
        </div>
      </main>

      {/* ── Mobile bottom nav ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 z-40 bg-card border-t border-border flex items-stretch">
        {bottomPrimary.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              'flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors',
              isActive(item.href) ? 'text-primary' : 'text-muted-foreground',
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </Link>
        ))}
        <button
          onClick={() => setMoreOpen(true)}
          className="flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium text-muted-foreground"
        >
          <MoreHorizontal className="h-5 w-5" />
          <span>Mais</span>
        </button>
      </nav>

      {/* ── "Mais" bottom sheet ── */}
      {moreOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMoreOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-card rounded-t-2xl pb-safe">
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-border rounded-full" />
            </div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider px-6 pb-2">
              Mais opções
            </p>
            <div className="grid grid-cols-2 gap-2 px-4 pb-6">
              {moreItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMoreOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium border transition-colors',
                    isActive(item.href)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border text-foreground hover:bg-muted',
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {item.name}
                </Link>
              ))}
              <button
                onClick={() => { setMoreOpen(false); signOut(); }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium border border-border text-destructive hover:bg-destructive/5 transition-colors"
              >
                <LogOut className="h-5 w-5 shrink-0" />
                Sair
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
