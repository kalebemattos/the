import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Settings2, Save, Loader2 } from 'lucide-react';

interface ConfigItem {
  key: string;
  value: string;
  label: string | null;
  updated_at: string | null;
}

const KEY_LABELS: Record<string, string> = {
  whatsapp_number: 'WhatsApp (com DDI, ex: +5524999999999)',
  contact_email: 'E-mail de contato',
  instagram_url: 'URL do Instagram',
  price_1p: 'Preço — 1 pessoa (€)',
  price_2p: 'Preço — 2 pessoas (€)',
  price_4p: 'Preço — 4 pessoas (€)',
  price_5p: 'Preço — 5 pessoas (€)',
  price_6p: 'Preço — 6 pessoas (€)',
  trip_duration_days: 'Duração do roteiro (dias)',
  wise_iban: 'IBAN (Wise)',
  wise_bic: 'BIC / SWIFT (Wise)',
  wise_account_name: 'Nome do beneficiário (Wise)',
};

const CONFIG_GROUPS = [
  {
    title: 'Contato',
    keys: ['whatsapp_number', 'contact_email', 'instagram_url'],
  },
  {
    title: 'Preços por Número de Pessoas (€)',
    description: 'Valor base do pacote por capacidade de hóspedes. Usado no wizard de reserva do site.',
    keys: ['price_1p', 'price_2p', 'price_4p', 'price_5p', 'price_6p'],
  },
  {
    title: 'Pagamento — Wise',
    description: 'IBAN da sua conta Wise em EUR. Exibido no site quando o cliente escolhe transferência bancária.',
    keys: ['wise_iban', 'wise_bic', 'wise_account_name'],
  },
  {
    title: 'Roteiro',
    keys: ['trip_duration_days'],
  },
];

export default function Settings() {
  const [config, setConfig] = useState<Record<string, ConfigItem>>({});
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchConfig = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('site_config').select('*');
    if (error) {
      toast.error('Erro ao carregar configurações');
    } else {
      const map: Record<string, ConfigItem> = {};
      const vals: Record<string, string> = {};
      (data ?? []).forEach((item: ConfigItem) => {
        map[item.key] = item;
        vals[item.key] = item.value;
      });
      setConfig(map);
      setValues(vals);
    }
    setLoading(false);
  };

  useEffect(() => { fetchConfig(); }, []);

  const handleSave = async () => {
    setSaving(true);
    const now = new Date().toISOString();
    const updates = Object.entries(values).map(([key, value]) => ({
      key,
      value,
      label: config[key]?.label ?? KEY_LABELS[key] ?? key,
      updated_at: now,
    }));

    const { error } = await supabase
      .from('site_config')
      .upsert(updates, { onConflict: 'key' });

    if (error) {
      toast.error('Erro ao salvar: ' + error.message);
    } else {
      toast.success('Configurações salvas!');
      fetchConfig();
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Configurações do Site</h1>
          <p className="text-muted-foreground">Edite informações de contato, preços e configurações gerais</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Salvar Tudo
        </Button>
      </div>

      <div className="space-y-6">
        {CONFIG_GROUPS.map(group => {
          return (
            <Card key={group.title}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings2 className="h-5 w-5" />
                  {group.title}
                </CardTitle>
                {'description' in group && group.description && (
                  <CardDescription>{group.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  {group.keys.map(key => {
                    const label = config[key]?.label ?? KEY_LABELS[key] ?? key;
                    const val = values[key] ?? '';
                    return (
                      <div key={key} className="space-y-1">
                        <Label>{label}</Label>
                        <Input
                          value={val}
                          onChange={e => setValues(v => ({ ...v, [key]: e.target.value }))}
                          placeholder={label}
                        />
                        {config[key]?.updated_at && (
                          <p className="text-xs text-muted-foreground">
                            Atualizado em {new Date(config[key].updated_at!).toLocaleDateString('pt-BR')}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Remaining config items not in any group */}
        {(() => {
          const knownKeys = CONFIG_GROUPS.flatMap(g => g.keys);
          const remaining = Object.keys(config).filter(k => !knownKeys.includes(k));
          if (remaining.length === 0) return null;
          return (
            <Card>
              <CardHeader>
                <CardTitle>Outras Configurações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  {remaining.map(key => (
                    <div key={key} className="space-y-1">
                      <Label>{config[key]?.label ?? key}</Label>
                      <Input
                        value={values[key] ?? ''}
                        onChange={e => setValues(v => ({ ...v, [key]: e.target.value }))}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })()}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
}
