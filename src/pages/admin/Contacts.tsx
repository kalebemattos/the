import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, MessageSquare, Pencil, Trash2, Mail, Phone } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  message: string | null;
  house_interest: string | null;
  num_guests: number | null;
  travel_period: string | null;
  status: string;
  notes: string | null;
  created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-yellow-100 text-yellow-800',
  converted: 'bg-green-100 text-green-800',
  lost: 'bg-red-100 text-red-800',
};
const STATUS_LABELS: Record<string, string> = {
  new: 'Novo', contacted: 'Contactado', converted: 'Convertido', lost: 'Perdido',
};

export default function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selected, setSelected] = useState<Contact | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchContacts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
    if (error) toast.error('Erro ao carregar leads');
    else setContacts(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchContacts(); }, []);

  const handleStatusUpdate = async (id: string, status: string) => {
    await supabase.from('contacts').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
    fetchContacts();
  };

  const handleNotesUpdate = async () => {
    if (!selected) return;
    await supabase.from('contacts').update({ notes: selected.notes, updated_at: new Date().toISOString() }).eq('id', selected.id);
    toast.success('Nota salva');
    setDialogOpen(false);
    fetchContacts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este lead?')) return;
    await supabase.from('contacts').delete().eq('id', id);
    toast.success('Lead excluído');
    fetchContacts();
  };

  const filtered = contacts.filter(c => {
    const matchSearch = !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search);
    const matchStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = {
    new: contacts.filter(c => c.status === 'new').length,
    contacted: contacts.filter(c => c.status === 'contacted').length,
    converted: contacts.filter(c => c.status === 'converted').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Leads & Contatos</h1>
          <p className="text-muted-foreground">Submissões do formulário de contato do site</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="pt-4"><p className="text-sm text-muted-foreground">Novos</p><p className="text-2xl font-bold text-blue-600">{stats.new}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-sm text-muted-foreground">Em Contato</p><p className="text-2xl font-bold text-yellow-600">{stats.contacted}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-sm text-muted-foreground">Convertidos</p><p className="text-2xl font-bold text-green-600">{stats.converted}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5" /> Lista de Leads</CardTitle>
          <CardDescription>{filtered.length} lead(s)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar por nome, email..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="new">Novos</SelectItem>
                <SelectItem value="contacted">Contactados</SelectItem>
                <SelectItem value="converted">Convertidos</SelectItem>
                <SelectItem value="lost">Perdidos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">Nenhum lead encontrado.</p>
          ) : (
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Interesse</TableHead>
                    <TableHead>Mensagem</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(c => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell>
                        <div className="space-y-0.5">
                          {c.email && <div className="flex items-center gap-1 text-sm"><Mail className="h-3 w-3" />{c.email}</div>}
                          {c.phone && <div className="flex items-center gap-1 text-sm"><Phone className="h-3 w-3" />{c.phone}</div>}
                        </div>
                      </TableCell>
                      <TableCell>
                        {c.house_interest && <div className="text-sm">{c.house_interest}</div>}
                        {c.num_guests && <div className="text-xs text-muted-foreground">{c.num_guests} hóspede(s)</div>}
                        {c.travel_period && <div className="text-xs text-muted-foreground">{c.travel_period}</div>}
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <p className="text-sm truncate text-muted-foreground">{c.message || '-'}</p>
                      </TableCell>
                      <TableCell>
                        <Select value={c.status} onValueChange={v => handleStatusUpdate(c.id, v)}>
                          <SelectTrigger className="w-32 h-7 text-xs">
                            <SelectValue>
                              <Badge className={`${STATUS_COLORS[c.status] ?? ''} text-xs`}>{STATUS_LABELS[c.status] ?? c.status}</Badge>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">Novo</SelectItem>
                            <SelectItem value="contacted">Contactado</SelectItem>
                            <SelectItem value="converted">Convertido</SelectItem>
                            <SelectItem value="lost">Perdido</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(c.created_at).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelected(c); setDialogOpen(true); }}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(c.id)}>
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

      {/* Detail / Notes Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Detalhes do Lead: {selected?.name}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-muted-foreground">Email:</span> {selected.email || '-'}</div>
                <div><span className="text-muted-foreground">Telefone:</span> {selected.phone || '-'}</div>
                <div><span className="text-muted-foreground">Casa de interesse:</span> {selected.house_interest || '-'}</div>
                <div><span className="text-muted-foreground">Hóspedes:</span> {selected.num_guests ?? '-'}</div>
                <div className="col-span-2"><span className="text-muted-foreground">Período:</span> {selected.travel_period || '-'}</div>
              </div>
              {selected.message && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Mensagem:</p>
                  <p className="text-sm bg-muted rounded p-3">{selected.message}</p>
                </div>
              )}
              <div className="space-y-1">
                <Label>Notas internas</Label>
                <Textarea rows={3} value={selected.notes ?? ''} onChange={e => setSelected(s => s ? { ...s, notes: e.target.value } : s)} placeholder="Anotações sobre este lead..." />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Fechar</Button>
            <Button onClick={handleNotesUpdate}>Salvar Nota</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
