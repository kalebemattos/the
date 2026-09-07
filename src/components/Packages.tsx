import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format, eachDayOfInterval, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Users, Check, Euro, Calendar as CalendarIcon, Home,
  Waves, Bath, Sofa, ChevronRight, ChevronLeft,
  Wind, Mountain, Fish, Binoculars, Anchor, Car, Star, Loader2,
} from 'lucide-react';

// ─── Data ───────────────────────────────────────────────────────────────────

const houses = [
  {
    id: 'casa-101', name: 'Casa 101', icon: Bath,
    taglinePt: 'O Canto do Relaxamento', taglineEn: 'The Relaxation Corner',
    taglineEs: 'El Rincón del Relax', taglineFr: 'Le Coin de la Détente',
    highlightPt: 'Banheira de Hidromassagem', highlightEn: 'Hot Tub',
    highlightEs: 'Bañera de Hidromasaje', highlightFr: 'Jacuzzi',
    descPt: '2 quartos (1 suíte), varanda com hidromassagem, garagem privativa.',
    descEn: '2 bedrooms (1 suite), balcony with hot tub, private garage.',
    descEs: '2 habitaciones (1 suite), balcón con jacuzzi, garaje privado.',
    descFr: '2 chambres (1 suite), balcon avec jacuzzi, garage privé.',
  },
  {
    id: 'casa-102', name: 'Casa 102', icon: Waves,
    taglinePt: 'Piscina Privativa para Curtir o Dia Todo', taglineEn: 'Private Pool to Enjoy All Day',
    taglineEs: 'Piscina Privada para Disfrutar Todo el Día', taglineFr: 'Piscine Privée pour Profiter Toute la Journée',
    highlightPt: 'Piscina com Hidromassagem', highlightEn: 'Pool with Hydromassage',
    highlightEs: 'Piscina con Hidromasaje', highlightFr: 'Piscine avec Hydromassage',
    descPt: 'Mesma planta da 101 com piscina redonda privativa e pontos de hidromassagem.',
    descEn: 'Same layout as 101 with a private round pool and hydromassage jets.',
    descEs: 'Misma planta que la 101 con piscina redonda privada y puntos de hidromasaje.',
    descFr: 'Même plan que la 101 avec piscine ronde privée et jets d\'hydromassage.',
  },
  {
    id: 'casa-201', name: 'Casa 201', icon: Sofa,
    taglinePt: 'Tranquilidade no Piso Superior', taglineEn: 'Tranquility on the Upper Floor',
    taglineEs: 'Tranquilidad en el Piso Superior', taglineFr: "Tranquillité à l'Étage Supérieur",
    highlightPt: 'Sacada Privativa com Vista', highlightEn: 'Private Balcony with View',
    highlightEs: 'Balcón Privado con Vista', highlightFr: 'Balcon Privé avec Vue',
    descPt: '2 quartos espaçosos, sacada privativa com vista, ar-condicionado e garagem.',
    descEn: '2 spacious bedrooms, private balcony with view, air conditioning and garage.',
    descEs: '2 habitaciones espaciosas, balcón privado con vista, aire acondicionado y garaje.',
    descFr: '2 chambres spacieuses, balcon privé avec vue, climatisation et garage.',
  },
  {
    id: 'casa-202', name: 'Casa 202', icon: Sofa,
    taglinePt: 'Conforto e Calmaria no Andar Superior', taglineEn: 'Comfort and Calm on the Upper Floor',
    taglineEs: 'Confort y Calma en el Piso Superior', taglineFr: "Confort et Sérénité à l'Étage Supérieur",
    highlightPt: 'Sacada Privativa', highlightEn: 'Private Balcony',
    highlightEs: 'Balcón Privado', highlightFr: 'Balcon Privé',
    descPt: 'Mesma proposta da 201, paz e privacidade para uma estadia inesquecível.',
    descEn: 'Same concept as 201, peace and privacy for an unforgettable stay.',
    descEs: 'Misma propuesta que la 201, paz y privacidad para una estadía inolvidable.',
    descFr: 'Même concept que la 201, paix et intimité pour un séjour inoubliable.',
  },
];

const packages = [
  { people: 1, price: 3000 },
  { people: 2, price: 4000 },
  { people: 4, price: 5000 },
  { people: 5, price: 5700 },
  { people: 6, price: 6000 },
];

const extras = [
  {
    id: 'paragliding', icon: Wind,
    namePt: 'Voo de Parapente', nameEn: 'Paragliding Flight',
    nameEs: 'Vuelo de Parapente', nameFr: 'Vol en Parapente',
    descPt: 'Voe sobre as montanhas e o mar de Angra com vista incrível.',
    descEn: 'Fly over the mountains and sea of Angra with incredible views.',
    descEs: 'Vuela sobre las montañas y el mar de Angra con vistas increíbles.',
    descFr: 'Survolez les montagnes et la mer d\'Angra avec des vues incroyables.',
    prices: { 1: 350, 2: 450, 3: 550, 6: 850 } as Record<number, number>,
  },
  {
    id: 'rio', icon: Mountain,
    namePt: 'Cristo Redentor & Pão de Açúcar', nameEn: 'Christ the Redeemer & Sugarloaf',
    nameEs: 'Cristo Redentor y Pan de Azúcar', nameFr: 'Christ Rédempteur & Pain de Sucre',
    descPt: 'Passeio de um dia ao Rio de Janeiro nos principais pontos turísticos.',
    descEn: 'Full-day trip to Rio de Janeiro\'s main tourist spots.',
    descEs: 'Excursión de un día a los principales atractivos turísticos de Río de Janeiro.',
    descFr: 'Excursion d\'une journée aux principaux sites touristiques de Rio de Janeiro.',
    prices: { 1: 350, 2: 450, 3: 550, 6: 850 } as Record<number, number>,
  },
  {
    id: 'aquarium', icon: Fish,
    namePt: 'AquaRio / BioParque', nameEn: 'AquaRio / BioParque',
    nameEs: 'AquaRio / BioParque', nameFr: 'AquaRio / BioParque',
    descPt: 'Visite o maior aquário da América do Sul ou o zoológico do Rio.',
    descEn: 'Visit the largest aquarium in South America or Rio\'s zoo.',
    descEs: 'Visita el acuario más grande de América del Sur o el zoológico de Río.',
    descFr: 'Visitez le plus grand aquarium d\'Amérique du Sud ou le zoo de Rio.',
    prices: { 1: 350, 2: 450, 3: 550, 6: 850 } as Record<number, number>,
  },
  {
    id: 'diving', icon: Fish,
    namePt: 'Mergulho Subaquático', nameEn: 'Scuba Diving',
    nameEs: 'Buceo Submarino', nameFr: 'Plongée Sous-Marine',
    descPt: 'Explore a vida marinha nas águas cristalinas das ilhas de Angra.',
    descEn: 'Explore marine life in the crystal-clear waters around Angra\'s islands.',
    descEs: 'Explora la vida marina en las aguas cristalinas alrededor de las islas de Angra.',
    descFr: 'Explorez la vie marine dans les eaux cristallines des îles d\'Angra.',
    prices: { 1: 400, 2: 550, 3: 650, 6: 950 } as Record<number, number>,
  },
];

const QTY_OPTIONS = [1, 2, 3, 6];
const TOTAL_STEPS = 5;

const included = [
  { icon: Home, pt: 'Hospedagem completa por 10 dias', en: 'Full accommodation for 10 days', es: 'Alojamiento completo por 10 días', fr: 'Hébergement complet pendant 10 jours' },
  { icon: Car, pt: 'Motorista privado durante toda a estadia', en: 'Private driver throughout the stay', es: 'Conductor privado durante toda la estancia', fr: 'Chauffeur privé pendant tout le séjour' },
  { icon: Anchor, pt: 'Dois passeios de lancha privativa', en: 'Two private boat tours', es: 'Dos paseos en lancha privada', fr: 'Deux excursions en bateau privé' },
  { icon: Binoculars, pt: 'Visitas guiadas — ilhas, cachoeiras e cultura', en: 'Guided visits — islands, waterfalls and culture', es: 'Visitas guiadas — islas, cascadas y cultura', fr: 'Visites guidées — îles, cascades et culture' },
  { icon: Star, pt: 'Assistência para passagens aéreas Europa–Rio', en: 'Assistance for Europe–Rio airline tickets', es: 'Asistencia para vuelos Europa–Río', fr: 'Assistance pour les billets Europe–Rio' },
];

// ─── Component ───────────────────────────────────────────────────────────────

export function Packages() {
  const { t } = useLanguage();

  // Wizard state
  const [step, setStep] = useState(1);
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [selectedPeople, setSelectedPeople] = useState<number>(2);
  const [selectedHouse, setSelectedHouse] = useState<string>(() => {
    const pre = sessionStorage.getItem('preselected_house');
    if (pre) { sessionStorage.removeItem('preselected_house'); return pre; }
    return 'casa-101';
  });
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [extraQty, setExtraQty] = useState<Record<string, number>>({});

  // Form
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);

  // Supabase data
  const [coverImages, setCoverImages] = useState<Record<string, string>>({});
  const [occupiedRanges, setOccupiedRanges] = useState<{ houseId: string; start: Date; end: Date }[]>([]);

  useEffect(() => {
    // Fetch house cover images
    (async () => {
      const { data: galleries } = await supabase.from('galleries').select('id, house_id').not('house_id', 'is', null);
      if (!galleries?.length) return;
      const results = await Promise.all(
        galleries.map(async (g) => {
          const { data: imgs } = await supabase.from('gallery_images').select('url').eq('gallery_id', g.id).order('display_order', { ascending: true }).limit(1);
          return { houseId: g.house_id!, url: imgs?.[0]?.url ?? null };
        })
      );
      const map: Record<string, string> = {};
      results.forEach(({ houseId, url }) => { if (url) map[houseId] = url; });
      setCoverImages(map);
    })();

    // Fetch bookings for availability
    (async () => {
      const { data } = await supabase.from('bookings').select('house_id, check_in, check_out').eq('status', 'confirmed');
      if (data?.length) {
        setOccupiedRanges(data.map(b => ({
          houseId: b.house_id,
          start: parseISO(b.check_in),
          end: parseISO(b.check_out),
        })));
      }
    })();
  }, []);

  // ─── Helpers ──────────────────────────────────────────────────────────────

  const selectedPackage = packages.find(p => p.people === selectedPeople) || packages[1];
  const selectedHouseData = houses.find(h => h.id === selectedHouse);

  const getExtraPrice = (extraId: string) => {
    const extra = extras.find(e => e.id === extraId);
    if (!extra) return 0;
    const qty = extraQty[extraId] ?? 1;
    const keys = Object.keys(extra.prices).map(Number).sort((a, b) => a - b);
    const key = keys.filter(k => k <= qty).pop() ?? keys[0];
    return extra.prices[key];
  };

  const extrasTotal = selectedExtras.reduce((sum, id) => sum + getExtraPrice(id), 0);
  const totalPrice = selectedPackage.price + extrasTotal;

  const toggleExtra = (extraId: string) => {
    setSelectedExtras(prev =>
      prev.includes(extraId) ? prev.filter(id => id !== extraId) : [...prev, extraId]
    );
  };

  const setQty = (extraId: string, qty: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setExtraQty(prev => ({ ...prev, [extraId]: qty }));
    setSelectedExtras(prev => (prev.includes(extraId) ? prev : [...prev, extraId]));
  };

  // Is a date occupied for the selected house?
  const isDateOccupied = (date: Date) =>
    occupiedRanges.some(r => r.houseId === selectedHouse && date >= r.start && date < r.end);

  // All occupied dates for all houses (for step 1, before house is selected)
  const allOccupiedDates = (() => {
    const allDates: Date[] = [];
    occupiedRanges.forEach(r => {
      try {
        eachDayOfInterval({ start: r.start, end: r.end }).forEach(d => allDates.push(d));
      } catch {}
    });
    return allDates;
  })();

  // Check if selected house is busy on chosen date
  const houseConflict = checkInDate && occupiedRanges.some(
    r => r.houseId === selectedHouse && checkInDate >= r.start && checkInDate < r.end
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error(t('Nome obrigatório', 'Name required', 'Nombre requerido', 'Nom requis')); return; }

    setSubmitting(true);

    const extrasText = selectedExtras.map(id => {
      const ex = extras.find(e => e.id === id);
      if (!ex) return '';
      const qty = extraQty[id] ?? 1;
      return `${t(ex.namePt, ex.nameEn, ex.nameEs, ex.nameFr)} (${qty}x) €${getExtraPrice(id)}`;
    }).filter(Boolean).join(', ');

    const message = t(
      `Pacote ${selectedPeople}px · ${selectedHouseData?.name} · Check-in: ${checkInDate ? format(checkInDate, 'dd/MM/yyyy') : 'a definir'} · Total: €${totalPrice}${extrasText ? ' · Extras: ' + extrasText : ''}`,
      `Package ${selectedPeople}px · ${selectedHouseData?.name} · Check-in: ${checkInDate ? format(checkInDate, 'dd/MM/yyyy') : 'TBD'} · Total: €${totalPrice}${extrasText ? ' · Extras: ' + extrasText : ''}`,
      `Paquete ${selectedPeople}px · ${selectedHouseData?.name} · Check-in: ${checkInDate ? format(checkInDate, 'dd/MM/yyyy') : 'a definir'} · Total: €${totalPrice}${extrasText ? ' · Extras: ' + extrasText : ''}`,
      `Forfait ${selectedPeople}px · ${selectedHouseData?.name} · Arrivée: ${checkInDate ? format(checkInDate, 'dd/MM/yyyy') : 'à définir'} · Total: €${totalPrice}${extrasText ? ' · Extras: ' + extrasText : ''}`
    );

    // Save to contacts table
    try {
      await supabase.from('contacts').insert({
        name: form.name,
        email: form.email || null,
        phone: form.phone || null,
        house_interest: selectedHouse,
        num_guests: selectedPeople,
        travel_period: checkInDate ? format(checkInDate, 'yyyy-MM-dd') : null,
        message,
        status: 'new',
      });
    } catch {}

    // Open WhatsApp
    const waMsg = `${t('Olá!', 'Hello!', '¡Hola!', 'Bonjour!')} ${form.name}.\n${message}`;
    window.open(`https://wa.me/5524999999999?text=${encodeURIComponent(waMsg)}`, '_blank');
    toast.success(t('Pré-reserva enviada! Redirecionando para WhatsApp...', 'Pre-booking sent! Redirecting to WhatsApp...', '¡Pre-reserva enviada! Redirigiendo a WhatsApp...', 'Pré-réservation envoyée! Redirection vers WhatsApp...'));
    setSubmitting(false);
  };

  // ─── Step labels ──────────────────────────────────────────────────────────

  const stepLabels = [
    t('Quando?', 'When?', '¿Cuándo?', 'Quand?'),
    t('Pessoas', 'People', 'Personas', 'Personnes'),
    t('Casa', 'House', 'Casa', 'Maison'),
    t('Extras', 'Extras', 'Extras', 'Extras'),
    t('Resumo', 'Summary', 'Resumen', 'Résumé'),
  ];

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <section id="packages" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-secondary text-2xl">■</span>
            <h2 className="section-title">{t('Pacotes e Valores', 'Packages & Prices', 'Paquetes y Precios', 'Forfaits et Tarifs')}</h2>
            <span className="text-secondary text-2xl">■</span>
          </div>
          <p className="section-subtitle">{t('Monte o pacote ideal para você em 5 passos simples.', 'Build your ideal package in 5 simple steps.', 'Arma tu paquete ideal en 5 pasos simples.', 'Créez votre forfait idéal en 5 étapes simples.')}</p>
        </div>

        <div className="max-w-3xl mx-auto">

          {/* ── Progress bar ── */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {stepLabels.map((label, i) => {
                const num = i + 1;
                const done = step > num;
                const active = step === num;
                return (
                  <div key={num} className="flex items-center flex-1">
                    <div className="flex flex-col items-center gap-1">
                      <button
                        onClick={() => done && setStep(num)}
                        className={cn(
                          'w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all shrink-0',
                          done ? 'bg-primary text-white cursor-pointer hover:bg-primary/80' : active ? 'bg-primary text-white ring-4 ring-primary/25' : 'bg-muted text-muted-foreground'
                        )}
                      >
                        {done ? <Check className="w-4 h-4" /> : num}
                      </button>
                      <span className={cn('text-xs hidden sm:block', active ? 'text-primary font-semibold' : 'text-muted-foreground')}>{label}</span>
                    </div>
                    {i < TOTAL_STEPS - 1 && (
                      <div className={cn('h-0.5 flex-1 mx-1 rounded-full transition-all', done ? 'bg-primary' : 'bg-muted')} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Mini summary bar ── */}
          {step > 1 && (
            <div className="flex flex-wrap gap-2 mb-5 px-4 py-3 bg-muted/40 rounded-xl text-sm border border-border">
              {checkInDate && <span className="bg-background px-2 py-0.5 rounded-md border text-xs">{format(checkInDate, 'dd/MM/yyyy')}</span>}
              {step > 2 && <span className="bg-background px-2 py-0.5 rounded-md border text-xs">{selectedPeople} {t('pessoas', 'people', 'personas', 'personnes')} · €{selectedPackage.price}</span>}
              {step > 3 && <span className="bg-background px-2 py-0.5 rounded-md border text-xs">{selectedHouseData?.name}</span>}
              {step > 4 && selectedExtras.length > 0 && <span className="bg-background px-2 py-0.5 rounded-md border text-xs">+{selectedExtras.length} extras</span>}
              <span className="ml-auto font-bold text-primary">€{totalPrice}</span>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════
              STEP 1 — Data
          ══════════════════════════════════════════════════════ */}
          {step === 1 && (
            <Card className="p-8 border-primary/20 animate-fade-in-up">
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <CalendarIcon className="w-6 h-6 text-primary" />
                {t('Quando você quer vir?', 'When do you want to come?', '¿Cuándo quieres venir?', 'Quand voulez-vous venir?')}
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                {t('Selecione a data de check-in. O pacote é de 10 dias.', 'Select your check-in date. The package is 10 days.', 'Seleccione la fecha de check-in. El paquete es de 10 días.', 'Sélectionnez la date d\'arrivée. Le forfait dure 10 jours.')}
              </p>
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={checkInDate}
                  onSelect={setCheckInDate}
                  disabled={(date) => date < new Date()}
                  className="rounded-xl border border-border p-3 pointer-events-auto"
                />
              </div>
              {checkInDate && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    {t('Check-in:', 'Check-in:', 'Check-in:', 'Arrivée:')} <span className="font-semibold text-foreground">{format(checkInDate, 'dd/MM/yyyy')}</span>
                    {' · '}
                    {t('Check-out:', 'Check-out:', 'Check-out:', 'Départ:')} <span className="font-semibold text-foreground">{format(new Date(checkInDate.getTime() + 10 * 86400000), 'dd/MM/yyyy')}</span>
                  </p>
                </div>
              )}
            </Card>
          )}

          {/* ══════════════════════════════════════════════════════
              STEP 2 — Pessoas
          ══════════════════════════════════════════════════════ */}
          {step === 2 && (
            <Card className="p-8 border-primary/20 animate-fade-in-up">
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <Users className="w-6 h-6 text-primary" />
                {t('Quantas pessoas vão?', 'How many people are going?', '¿Cuántas personas van?', 'Combien de personnes partent?')}
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                {t('O preço do pacote varia conforme o número de pessoas.', 'The package price varies by number of people.', 'El precio del paquete varía según el número de personas.', 'Le prix du forfait varie selon le nombre de personnes.')}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {packages.map((pkg) => (
                  <button
                    key={pkg.people}
                    onClick={() => { setSelectedPeople(pkg.people); setTimeout(() => setStep(3), 280); }}
                    className={cn(
                      'p-5 rounded-xl border-2 transition-all hover:scale-105 active:scale-95',
                      selectedPeople === pkg.people ? 'border-primary bg-primary/10 shadow-md' : 'border-border hover:border-primary/50'
                    )}
                  >
                    <Users className={cn('w-7 h-7 mx-auto mb-2', selectedPeople === pkg.people ? 'text-primary' : 'text-muted-foreground')} />
                    <p className="font-semibold text-base text-center">
                      {pkg.people} {pkg.people === 1 ? t('pessoa', 'person', 'persona', 'personne') : t('pessoas', 'people', 'personas', 'personnes')}
                    </p>
                    <p className="text-xl font-bold text-primary text-center mt-1">€{pkg.price}</p>
                  </button>
                ))}
              </div>
            </Card>
          )}

          {/* ══════════════════════════════════════════════════════
              STEP 3 — Casa
          ══════════════════════════════════════════════════════ */}
          {step === 3 && (
            <Card className="p-8 border-secondary/20 animate-fade-in-up">
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <Home className="w-6 h-6 text-secondary" />
                {t('Qual acomodação prefere?', 'Which accommodation do you prefer?', '¿Qué alojamiento prefiere?', 'Quel hébergement préférez-vous?')}
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                {t('Todas as casas têm WiFi, ar-condicionado, TV, Alexa e garagem privativa.', 'All houses have WiFi, AC, TV, Alexa and private garage.', 'Todas las casas tienen WiFi, AC, TV, Alexa y garaje privado.', 'Toutes les maisons ont WiFi, clim, TV, Alexa et garage privé.')}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {houses.map((house) => {
                  const IconComponent = house.icon;
                  const isSelected = selectedHouse === house.id;
                  const busy = checkInDate && occupiedRanges.some(
                    r => r.houseId === house.id && checkInDate >= r.start && checkInDate < r.end
                  );
                  return (
                    <button
                      key={house.id}
                      onClick={() => { setSelectedHouse(house.id); setTimeout(() => setStep(4), 280); }}
                      className={cn(
                        'rounded-xl border-2 transition-all hover:scale-[1.02] active:scale-[0.98] text-left overflow-hidden',
                        isSelected ? 'border-secondary shadow-md' : 'border-border hover:border-secondary/50'
                      )}
                    >
                      {/* Photo */}
                      <div className="relative h-36 bg-muted">
                        {coverImages[house.id] ? (
                          <img src={coverImages[house.id]} alt={house.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                            <IconComponent className="w-12 h-12 text-muted-foreground/40" />
                          </div>
                        )}
                        {busy && (
                          <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                            {t('Ocupada nessa data', 'Busy on this date', 'Ocupada en esa fecha', 'Occupée à cette date')}
                          </div>
                        )}
                        {isSelected && (
                          <div className="absolute top-2 left-2 bg-secondary text-white rounded-full p-1">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      {/* Info */}
                      <div className="p-4">
                        <p className="font-bold text-base">{house.name}</p>
                        <p className={cn('text-sm mb-1', isSelected ? 'text-secondary' : 'text-muted-foreground')}>
                          {t(house.taglinePt, house.taglineEn, house.taglineEs, house.taglineFr)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t(house.descPt, house.descEn, house.descEs, house.descFr)}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>
          )}

          {/* ══════════════════════════════════════════════════════
              STEP 4 — Extras
          ══════════════════════════════════════════════════════ */}
          {step === 4 && (
            <Card className="p-8 border-accent/20 animate-fade-in-up">
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <Star className="w-6 h-6 text-accent" />
                {t('Adicione experiências extras', 'Add extra experiences', 'Añade experiencias extras', 'Ajoutez des expériences supplémentaires')}
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                {t('Opcional. Escolha a experiência e quantas pessoas participam.', 'Optional. Choose the experience and how many people participate.', 'Opcional. Elige la experiencia y cuántas personas participan.', 'Optionnel. Choisissez l\'expérience et combien de personnes participent.')}
              </p>
              <div className="space-y-4">
                {extras.map((extra) => {
                  const isSelected = selectedExtras.includes(extra.id);
                  const currentQty = extraQty[extra.id] ?? 1;
                  const IconComponent = extra.icon;
                  return (
                    <div
                      key={extra.id}
                      onClick={() => toggleExtra(extra.id)}
                      className={cn(
                        'p-4 rounded-xl border-2 transition-all cursor-pointer',
                        isSelected ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/40'
                      )}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <Checkbox id={extra.id} checked={isSelected} onCheckedChange={() => toggleExtra(extra.id)} className="mt-1" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-semibold">{t(extra.namePt, extra.nameEn, extra.nameEs, extra.nameFr)}</p>
                            <span className="text-accent font-bold shrink-0">€{getExtraPrice(extra.id)}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {t(extra.descPt, extra.descEn, extra.descEs, extra.descFr)}
                          </p>
                        </div>
                      </div>
                      {/* Qty — segmented control */}
                      <div className="flex items-center gap-1 pl-7 mt-2 bg-muted rounded-lg p-1 w-fit" onClick={e => e.stopPropagation()}>
                        {QTY_OPTIONS.map(qty => {
                          const selected = currentQty === qty;
                          return (
                            <button
                              key={qty}
                              onClick={e => setQty(extra.id, qty, e)}
                              className={cn(
                                'px-3 py-1.5 rounded-md text-sm font-medium transition-all',
                                selected
                                  ? 'bg-accent text-white shadow-sm'
                                  : 'text-muted-foreground hover:text-foreground'
                              )}
                            >
                              {qty === 1
                                ? t('1 pessoa', '1 person', '1 persona', '1 personne')
                                : `${qty} ${t('pessoas', 'people', 'personas', 'personnes')}`}
                              <span className={cn('ml-1.5 text-xs', selected ? 'text-white/80' : 'text-muted-foreground')}>
                                €{extra.prices[qty]}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* ══════════════════════════════════════════════════════
              STEP 5 — O que está incluído + Resumo + Formulário
          ══════════════════════════════════════════════════════ */}
          {step === 5 && (
            <div className="space-y-6 animate-fade-in-up">
              {/* What's included */}
              <Card className="p-8 border-primary/20">
                <h3 className="text-xl font-semibold mb-5 flex items-center gap-2">
                  <Check className="w-6 h-6 text-primary" />
                  {t('O que está incluído no pacote', "What's included in the package", 'Lo que está incluido en el paquete', 'Ce qui est inclus dans le forfait')}
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {included.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div key={i} className="flex items-start gap-3 p-3 bg-primary/5 rounded-xl">
                        <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        <p className="text-sm font-medium leading-snug">{t(item.pt, item.en, item.es, item.fr)}</p>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Summary */}
              <Card className="p-8 bg-gradient-sunset border-none text-white">
                <h3 className="text-xl font-bold mb-4">{t('Resumo da Reserva', 'Booking Summary', 'Resumen de Reserva', 'Résumé de la Réservation')}</h3>
                <div className="space-y-2 mb-6 text-sm">
                  <div className="flex justify-between text-white/80">
                    <span>{t('Pacote', 'Package', 'Paquete', 'Forfait')} — {selectedPeople} {t('pessoas', 'people', 'personas', 'personnes')}</span>
                    <span className="font-semibold text-white">€{selectedPackage.price}</span>
                  </div>
                  <div className="flex justify-between text-white/80">
                    <span>{t('Acomodação', 'Accommodation', 'Alojamiento', 'Hébergement')}</span>
                    <span className="font-semibold text-white">{selectedHouseData?.name}</span>
                  </div>
                  {checkInDate && (
                    <div className="flex justify-between text-white/80">
                      <span>Check-in</span>
                      <span className="font-semibold text-white">{format(checkInDate, 'dd/MM/yyyy')}</span>
                    </div>
                  )}
                  {selectedExtras.length > 0 && (
                    <div className="border-t border-white/20 pt-2 mt-1">
                      <p className="text-white/60 text-xs mb-1">{t('Extras selecionados:', 'Selected extras:', 'Extras seleccionados:', 'Extras sélectionnés:')}</p>
                      {selectedExtras.map(id => {
                        const ex = extras.find(e => e.id === id);
                        if (!ex) return null;
                        const qty = extraQty[id] ?? 1;
                        const pessoaLabel = qty === 1
                          ? t('1 pessoa', '1 person', '1 persona', '1 personne')
                          : t(`${qty} pessoas`, `${qty} people`, `${qty} personas`, `${qty} personnes`);
                        return (
                          <div key={id} className="flex justify-between text-white/80">
                            <span>{t(ex.namePt, ex.nameEn, ex.nameEs, ex.nameFr)} <span className="text-white/50 text-xs">({pessoaLabel})</span></span>
                            <span className="font-semibold text-white">€{getExtraPrice(id)}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <div className="border-t border-white/30 pt-3 mt-2 flex justify-between">
                    <span className="font-bold text-lg">{t('Total', 'Total', 'Total', 'Total')}</span>
                    <span className="font-bold text-3xl">€{totalPrice}</span>
                  </div>
                </div>

                {/* Pre-booking form */}
                <form onSubmit={handleSubmit} className="space-y-3 pt-4 border-t border-white/20">
                  <p className="text-sm text-white/80 font-medium mb-3">
                    {t('Preencha seus dados para confirmar a pré-reserva:', 'Fill in your details to confirm the pre-booking:', 'Complete sus datos para confirmar la pre-reserva:', 'Remplissez vos coordonnées pour confirmer la pré-réservation:')}
                  </p>
                  <Input
                    required
                    placeholder={t('Seu nome *', 'Your name *', 'Su nombre *', 'Votre nom *')}
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-white"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      type="email"
                      placeholder="Email"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-white"
                    />
                    <Input
                      type="tel"
                      placeholder={t('Telefone / WhatsApp', 'Phone / WhatsApp', 'Teléfono / WhatsApp', 'Téléphone / WhatsApp')}
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-white"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={submitting}
                    size="lg"
                    className="w-full bg-white text-primary hover:bg-white/90 py-6 text-lg font-bold shadow-elegant hover:scale-105 active:scale-95 transition-all"
                  >
                    {submitting
                      ? <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      : null}
                    {t('Confirmar Pré-Reserva via WhatsApp', 'Confirm Pre-Booking via WhatsApp', 'Confirmar Pre-Reserva por WhatsApp', 'Confirmer la Pré-Réservation via WhatsApp')} →
                  </Button>
                  <p className="text-xs text-white/60 text-center">
                    {t('Nossa equipe responde em até 2 horas para confirmar disponibilidade.', 'Our team responds within 2 hours to confirm availability.', 'Nuestro equipo responde en 2 horas para confirmar disponibilidad.', 'Notre équipe répond dans 2 heures pour confirmer la disponibilité.')}
                  </p>
                </form>
              </Card>
            </div>
          )}

          {/* ── Navigation ── */}
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => setStep(s => Math.max(1, s - 1))}
              disabled={step === 1}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              {t('Anterior', 'Back', 'Anterior', 'Précédent')}
            </Button>
            {step < TOTAL_STEPS && (
              <Button
                onClick={() => setStep(s => Math.min(TOTAL_STEPS, s + 1))}
                className="gap-2 bg-primary text-white hover:bg-primary/90 active:scale-95"
              >
                {step === 4
                  ? t('Ver Resumo', 'See Summary', 'Ver Resumen', 'Voir le Résumé')
                  : t('Próximo', 'Next', 'Siguiente', 'Suivant')}
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ── Sticky price bar (mobile) ── */}
      {step > 1 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-background/95 backdrop-blur border-t border-border px-4 py-3 flex items-center justify-between shadow-lg">
          <div>
            <p className="text-xs text-muted-foreground">{t('Total estimado', 'Estimated total', 'Total estimado', 'Total estimé')}</p>
            <p className="text-xl font-bold text-primary">€{totalPrice}</p>
          </div>
          {step < TOTAL_STEPS ? (
            <Button size="sm" onClick={() => setStep(s => Math.min(TOTAL_STEPS, s + 1))} className="bg-primary text-white gap-1">
              {step === 4 ? t('Ver Resumo', 'See Summary', 'Ver Resumen', 'Voir le Résumé') : t('Próximo', 'Next', 'Siguiente', 'Suivant')}
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <p className="text-sm font-semibold text-primary">{t('Preencha acima ↑', 'Fill above ↑', 'Complete arriba ↑', 'Remplissez ci-dessus ↑')}</p>
          )}
        </div>
      )}
    </section>
  );
}
