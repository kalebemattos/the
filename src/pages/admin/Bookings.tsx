import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Calendar, Home, Users, ChevronLeft, ChevronRight, Pencil, Trash2 } from 'lucide-react';

const HOUSES = ['casa-101', 'casa-102', 'casa-201', 'casa-202'];
const HOUSE_LABELS: Record<string, string> = {
  'casa-101': 'Casa 101', 'casa-102': 'Casa 102',
  'casa-201': 'Casa 201', 'casa-202': 'Casa 202',
};
const HOUSE_COLORS: Record<string, string> = {
  'casa-101': 'bg-blue-500', 'casa-102': 'bg-emerald-500',
  'casa-201': 'bg-violet-500', 'casa-202': 'bg-orange-500',
};
const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendente', confirmed: 'Confirmado', completed: 'Concluído', cancelled: 'Cancelado',
};
const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  completed: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-red-100 text-red-800',
};

interface Booking {
  id: string;
  client_name: string;
  client_id?: string;
  house_id: string;
  check_in: string;
  check_out: string;
  num_guests: number;
  total_amount: number;
  currency: string;
  payment_method: string;
  status: string;
  notes?: string;
  created_at: string;
}

const emptyForm = {
  client_name: '', house_id: 'casa-101', check_in: '', check_out: '',
  num_guests: 1, total_amount: 0, currency: 'EUR',
  payment_method: 'pix', status: 'pending', notes: '',
};

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Booking | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const fetchBookings = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('bookings').select('*').order('check_in');
    if (error) toast.error('Erro ao carregar reservas');
    else setBookings(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, num_guests: Number(form.num_guests), total_amount: Number(form.total_amount) };
    if (editing) {
      const { error } = await supabase.from('bookings').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', editing.id);
      if (error) { toast.error('Erro ao atualizar'); return; }
      toast.success('Reserva atualizada');
    } else {
      const { error } = await supabase.from('bookings').insert(payload);
      if (error) { toast.error('Erro ao criar'); return; }
      toast.success('Reserva criada');
    }
    setDialogOpen(false);
    setEditing(null);
    setForm({ ...emptyForm });
    fetchBookings();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir esta reserva?')) return;
    await supabase.from('bookings').delete().eq('id', id);
    toast.success('Reserva excluída');
    fetchBookings();
  };

  const openNew = () => { setEditing(null); setForm({ ...emptyForm }); setDialogOpen(true); };
  const openEdit = (b: Booking) => {
    setEditing(b);
    setForm({ client_name: b.client_name, house_id: b.house_id, check_in: b.check_in,
      check_out: b.check_out, num_guests: b.num_guests, total_amount: b.total_amount,
      currency: b.currency, payment_method: b.payment_method, status: b.status, notes: b.notes ?? '' });
    setDialogOpen(true);
  };

  // Calendar helpers
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const monthStr = currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  const getBookingsForDay = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateStr = date.toISOString().split('T')[0];
    return bookings.filter(b => b.check_in <= dateStr && b.check_out > dateStr);
  };

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const stats = {
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    pending: bookings.filter(b => b.status === 'pending').length,
    total: bookings.reduce((s, b) => s + Number(b.total_amount), 0),
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reservas</h1>
          <p className="text-muted-foreground">Calendário de ocupação das casas</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setViewMode(v => v === 'calendar' ? 'list' : 'calendar')}>
            {viewMode === 'calendar' ? 'Ver Lista' : 'Ver Calendário'}
          </Button>
          <Button onClick={openNew}><Plus className="mr-2 h-4 w-4" /> Nova Reserva</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="pt-4"><p className="text-sm text-muted-foreground">Confirmadas</p><p className="text-2xl font-bold text-green-600">{stats.confirmed}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-sm text-muted-foreground">Pendentes</p><p className="text-2xl font-bold text-yellow-600">{stats.pending}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-sm text-muted-foreground">Receita Total</p><p className="text-2xl font-bold">€ {stats.total.toLocaleString('pt-BR')}</p></CardContent></Card>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {HOUSES.map(h => (
          <div key={h} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${HOUSE_COLORS[h]}`} />
            <span className="text-sm text-muted-foreground">{HOUSE_LABELS[h]}</span>
          </div>
        ))}
      </div>

      {viewMode === 'calendar' ? (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="icon" onClick={prevMonth}><ChevronLeft className="h-5 w-5" /></Button>
              <CardTitle className="capitalize">{monthStr}</CardTitle>
              <Button variant="ghost" size="icon" onClick={nextMonth}><ChevronRight className="h-5 w-5" /></Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 mb-2">
              {['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'].map(d => (
                <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
              {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="bg-background min-h-[80px]" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dayBookings = getBookingsForDay(day);
                const isToday = new Date().getDate() === day &&
                  new Date().getMonth() === currentMonth.getMonth() &&
                  new Date().getFullYear() === currentMonth.getFullYear();
                return (
                  <div key={day} className="bg-background min-h-[80px] p-1">
                    <span className={`text-xs font-medium inline-flex w-6 h-6 items-center justify-center rounded-full ${isToday ? 'bg-primary text-white' : 'text-foreground'}`}>
                      {day}
                    </span>
                    <div className="mt-1 space-y-0.5">
                      {dayBookings.slice(0, 3).map(b => (
                        <div
                          key={b.id}
                          className={`text-xs text-white px-1 rounded truncate cursor-pointer ${HOUSE_COLORS[b.house_id] ?? 'bg-gray-500'}`}
                          onClick={() => openEdit(b)}
                          title={`${b.client_name} — ${HOUSE_LABELS[b.house_id]}`}
                        >
                          {HOUSE_LABELS[b.house_id]}
                        </div>
                      ))}
                      {dayBookings.length > 3 && <div className="text-xs text-muted-foreground">+{dayBookings.length - 3}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-4">
            {loading ? (
              <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>
            ) : bookings.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">Nenhuma reserva ainda.</p>
            ) : (
              <div className="space-y-3">
                {bookings.map(b => (
                  <div key={b.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full shrink-0 ${HOUSE_COLORS[b.house_id] ?? 'bg-gray-400'}`} />
                      <div>
                        <p className="font-medium">{b.client_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {HOUSE_LABELS[b.house_id]} · {new Date(b.check_in).toLocaleDateString('pt-BR')} → {new Date(b.check_out).toLocaleDateString('pt-BR')} · {b.num_guests} hóspede(s)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-sm">€ {Number(b.total_amount).toLocaleString('pt-BR')}</span>
                      <Badge className={STATUS_COLORS[b.status] ?? ''}>{STATUS_LABELS[b.status] ?? b.status}</Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(b)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(b.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? 'Editar Reserva' : 'Nova Reserva'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1">
                <Label>Nome do Cliente *</Label>
                <Input value={form.client_name} onChange={e => setForm(f => ({ ...f, client_name: e.target.value }))} required />
              </div>
              <div className="space-y-1">
                <Label>Casa *</Label>
                <Select value={form.house_id} onValueChange={v => setForm(f => ({ ...f, house_id: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{HOUSES.map(h => <SelectItem key={h} value={h}>{HOUSE_LABELS[h]}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Hóspedes</Label>
                <Input type="number" min={1} value={form.num_guests} onChange={e => setForm(f => ({ ...f, num_guests: Number(e.target.value) }))} />
              </div>
              <div className="space-y-1">
                <Label>Check-in *</Label>
                <Input type="date" value={form.check_in} onChange={e => setForm(f => ({ ...f, check_in: e.target.value }))} required />
              </div>
              <div className="space-y-1">
                <Label>Check-out *</Label>
                <Input type="date" value={form.check_out} onChange={e => setForm(f => ({ ...f, check_out: e.target.value }))} required />
              </div>
              <div className="space-y-1">
                <Label>Valor Total</Label>
                <Input type="number" min={0} value={form.total_amount} onChange={e => setForm(f => ({ ...f, total_amount: Number(e.target.value) }))} />
              </div>
              <div className="space-y-1">
                <Label>Moeda</Label>
                <Select value={form.currency} onValueChange={v => setForm(f => ({ ...f, currency: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="BRL">BRL (R$)</SelectItem>
                    <SelectItem value="USD">USD ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Pagamento</Label>
                <Select value={form.payment_method} onValueChange={v => setForm(f => ({ ...f, payment_method: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pix">Pix</SelectItem>
                    <SelectItem value="card">Cartão</SelectItem>
                    <SelectItem value="transfer">Transferência</SelectItem>
                    <SelectItem value="cash">Dinheiro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="confirmed">Confirmado</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-1">
                <Label>Observações</Label>
                <Textarea rows={2} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button type="submit">{editing ? 'Atualizar' : 'Criar'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
