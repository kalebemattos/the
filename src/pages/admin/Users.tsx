import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Users as UsersIcon, Shield, ShieldCheck, UserX,
  Trash2, UserPlus, Eye, EyeOff, Loader2,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface UserMeta {
  id: string;
  auth_id: string;
  email: string;
  name: string;
  role: 'admin' | 'operator' | 'staff';
  created_at: string;
}

const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrador',
  operator: 'Operador',
  staff: 'Staff',
};

const ROLE_DESC: Record<string, string> = {
  admin: 'Acesso total — pode criar e remover usuários',
  operator: 'PDV, Reservas, Clientes, Leads, Galerias, Configurações',
  staff: 'Sem acesso ao painel (conta criada mas não ativa)',
};

export default function AdminUsers() {
  const { isAdmin, user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'operator' });

  if (!isAdmin) return <Navigate to="/admin" replace />;

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('users_meta')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) toast.error('Erro ao carregar usuários');
    else setUsers((data ?? []) as UserMeta[]);
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      toast.error('Preencha todos os campos');
      return;
    }
    if (form.password.length < 8) {
      toast.error('A senha deve ter pelo menos 8 caracteres');
      return;
    }
    setCreating(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-create-user', {
        body: { action: 'create', ...form },
      });
      if (error || data?.error) throw new Error(data?.error ?? error?.message);
      toast.success(`Usuário "${form.name}" criado com sucesso!`);
      setDialogOpen(false);
      setForm({ name: '', email: '', password: '', role: 'operator' });
      fetchUsers();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao criar usuário');
    } finally {
      setCreating(false);
    }
  };

  const handleRoleChange = async (authId: string, newRole: string) => {
    const { error } = await supabase
      .from('users_meta')
      .update({ role: newRole })
      .eq('auth_id', authId);

    if (error) toast.error('Erro ao atualizar cargo');
    else {
      toast.success('Cargo atualizado');
      fetchUsers();
    }
  };

  const handleDelete = async (u: UserMeta) => {
    if (u.auth_id === currentUser?.id) {
      toast.error('Você não pode excluir sua própria conta');
      return;
    }
    if (!confirm(`Excluir o usuário "${u.name}" permanentemente?`)) return;

    try {
      const { data, error } = await supabase.functions.invoke('admin-create-user', {
        body: { action: 'delete', user_id: u.auth_id },
      });
      if (error || data?.error) throw new Error(data?.error ?? error?.message);
      toast.success('Usuário excluído');
      fetchUsers();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao excluir usuário');
    }
  };

  const roleBadge = (role: string) => {
    if (role === 'admin') return <Badge className="bg-primary gap-1"><ShieldCheck className="h-3 w-3" />Administrador</Badge>;
    if (role === 'operator') return <Badge variant="secondary" className="gap-1"><Shield className="h-3 w-3" />Operador</Badge>;
    return <Badge variant="outline" className="gap-1"><UserX className="h-3 w-3" />Staff</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Usuários</h1>
          <p className="text-muted-foreground">Crie contas e defina o que cada pessoa pode acessar</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Novo Usuário
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="pt-4">
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-2xl font-bold">{users.length}</p>
        </CardContent></Card>
        <Card><CardContent className="pt-4">
          <p className="text-sm text-muted-foreground">Administradores</p>
          <p className="text-2xl font-bold text-primary">{users.filter(u => u.role === 'admin').length}</p>
        </CardContent></Card>
        <Card><CardContent className="pt-4">
          <p className="text-sm text-muted-foreground">Operadores</p>
          <p className="text-2xl font-bold">{users.filter(u => u.role === 'operator').length}</p>
        </CardContent></Card>
      </div>

      {/* Users list */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
          <CardDescription>Apenas você (admin) vê esta página</CardDescription>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Nenhum usuário ainda.</p>
          ) : (
            <>
              {/* Mobile: cards */}
              <div className="md:hidden space-y-3">
                {users.map(u => (
                  <div key={u.id} className="border rounded-xl p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold truncate">{u.name}</p>
                          {u.auth_id === currentUser?.id && <Badge variant="outline" className="text-xs">Você</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(u.created_at), "dd/MM/yyyy", { locale: ptBR })}
                        </p>
                      </div>
                      <Button
                        variant="ghost" size="icon" className="h-8 w-8 shrink-0"
                        disabled={u.auth_id === currentUser?.id}
                        onClick={() => handleDelete(u)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-3">
                      {roleBadge(u.role)}
                      <Select
                        value={u.role}
                        onValueChange={v => handleRoleChange(u.auth_id, v)}
                        disabled={u.auth_id === currentUser?.id}
                      >
                        <SelectTrigger className="h-8 text-xs flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Administrador</SelectItem>
                          <SelectItem value="operator">Operador</SelectItem>
                          <SelectItem value="staff">Staff (sem acesso)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop: table */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Cadastro</TableHead>
                      <TableHead>Cargo atual</TableHead>
                      <TableHead>Alterar cargo</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map(u => (
                      <TableRow key={u.id}>
                        <TableCell className="font-medium">
                          {u.name}
                          {u.auth_id === currentUser?.id && (
                            <Badge variant="outline" className="ml-2 text-xs">Você</Badge>
                          )}
                        </TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {format(new Date(u.created_at), "dd/MM/yyyy", { locale: ptBR })}
                        </TableCell>
                        <TableCell>{roleBadge(u.role)}</TableCell>
                        <TableCell>
                          <Select
                            value={u.role}
                            onValueChange={v => handleRoleChange(u.auth_id, v)}
                            disabled={u.auth_id === currentUser?.id}
                          >
                            <SelectTrigger className="w-44">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Administrador</SelectItem>
                              <SelectItem value="operator">Operador</SelectItem>
                              <SelectItem value="staff">Staff (sem acesso)</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost" size="icon"
                            disabled={u.auth_id === currentUser?.id}
                            onClick={() => handleDelete(u)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Níveis de acesso */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Níveis de Acesso</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(ROLE_DESC).map(([role, desc]) => (
            <div key={role} className="flex items-start gap-3">
              {role === 'admin' ? <ShieldCheck className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                : role === 'operator' ? <Shield className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                : <UserX className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />}
              <div>
                <p className="font-medium">{ROLE_LABELS[role]}</p>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Create user dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Novo Usuário</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>Nome completo *</Label>
              <Input
                placeholder="Ex: Maria Silva"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-1">
              <Label>E-mail *</Label>
              <Input
                type="email"
                placeholder="maria@exemplo.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-1">
              <Label>Senha inicial *</Label>
              <div className="relative">
                <Input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Mínimo 8 caracteres"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                  minLength={8}
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  onClick={() => setShowPass(s => !s)}
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">Passe a senha para o usuário pessoalmente ou pelo WhatsApp.</p>
            </div>
            <div className="space-y-1">
              <Label>Nível de acesso *</Label>
              <Select value={form.role} onValueChange={v => setForm(f => ({ ...f, role: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="operator">
                    <div>
                      <p className="font-medium">Operador</p>
                      <p className="text-xs text-muted-foreground">PDV, Reservas, Clientes, Leads, Galerias</p>
                    </div>
                  </SelectItem>
                  <SelectItem value="admin">
                    <div>
                      <p className="font-medium">Administrador</p>
                      <p className="text-xs text-muted-foreground">Acesso total, incluindo usuários</p>
                    </div>
                  </SelectItem>
                  <SelectItem value="staff">
                    <div>
                      <p className="font-medium">Staff (sem acesso)</p>
                      <p className="text-xs text-muted-foreground">Conta criada mas sem acesso ao painel</p>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={creating}>
                {creating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
                Criar Usuário
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
