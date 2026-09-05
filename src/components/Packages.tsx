import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Users, Check, Euro, Calendar as CalendarIcon, Home, Waves, Bath, Sofa, ChevronRight, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const houses = [
  {
    id: 'casa-101',
    name: 'Casa 101',
    taglinePt: 'O Canto do Relaxamento',
    taglineEn: 'The Relaxation Corner',
    taglineEs: 'El Rincón del Relax',
    taglineFr: 'Le Coin de la Détente',
    highlightPt: 'Banheira de Hidromassagem',
    highlightEn: 'Hot Tub',
    highlightEs: 'Bañera de Hidromasaje',
    highlightFr: 'Jacuzzi',
    icon: Bath,
  },
  {
    id: 'casa-102',
    name: 'Casa 102',
    taglinePt: 'Piscina Privativa',
    taglineEn: 'Private Pool',
    taglineEs: 'Piscina Privada',
    taglineFr: 'Piscine Privée',
    highlightPt: 'Piscina com Hidromassagem',
    highlightEn: 'Pool with Hydromassage',
    highlightEs: 'Piscina con Hidromasaje',
    highlightFr: 'Piscine avec Hydromassage',
    icon: Waves,
  },
  {
    id: 'casa-201',
    name: 'Casa 201',
    taglinePt: 'Tranquilidade Superior',
    taglineEn: 'Upper Floor Tranquility',
    taglineEs: 'Tranquilidad Superior',
    taglineFr: "Tranquillité à l'Étage",
    highlightPt: 'Sacada Privativa',
    highlightEn: 'Private Balcony',
    highlightEs: 'Balcón Privado',
    highlightFr: 'Balcon Privé',
    icon: Sofa,
  },
  {
    id: 'casa-202',
    name: 'Casa 202',
    taglinePt: 'Conforto e Calmaria',
    taglineEn: 'Comfort & Serenity',
    taglineEs: 'Confort y Calma',
    taglineFr: 'Confort et Sérénité',
    highlightPt: 'Sacada Privativa',
    highlightEn: 'Private Balcony',
    highlightEs: 'Balcón Privado',
    highlightFr: 'Balcon Privé',
    icon: Sofa,
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
    id: 'paragliding',
    namePt: 'Voo de Parapente',
    nameEn: 'Paragliding Flight',
    nameEs: 'Vuelo de Parapente',
    nameFr: 'Vol en Parapente',
    prices: { 1: 350, 2: 450, 3: 550, 6: 850 } as Record<number, number>,
  },
  {
    id: 'rio',
    namePt: 'Cristo Redentor & Pão de Açúcar',
    nameEn: 'Christ the Redeemer & Sugarloaf',
    nameEs: 'Cristo Redentor y Pan de Azúcar',
    nameFr: 'Christ Rédempteur & Pain de Sucre',
    prices: { 1: 350, 2: 450, 3: 550, 6: 850 } as Record<number, number>,
  },
  {
    id: 'aquarium',
    namePt: 'AquaRio / BioParque',
    nameEn: 'AquaRio / BioParque',
    nameEs: 'AquaRio / BioParque',
    nameFr: 'AquaRio / BioParque',
    prices: { 1: 350, 2: 450, 3: 550, 6: 850 } as Record<number, number>,
  },
  {
    id: 'diving',
    namePt: 'Mergulho Subaquático',
    nameEn: 'Scuba Diving',
    nameEs: 'Buceo Submarino',
    nameFr: 'Plongée Sous-Marine',
    prices: { 1: 400, 2: 550, 3: 650, 6: 950 } as Record<number, number>,
  },
];

const QTY_OPTIONS = [1, 2, 3, 6];

const TOTAL_STEPS = 4;

export function Packages() {
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [selectedPeople, setSelectedPeople] = useState<number>(1);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [selectedHouse, setSelectedHouse] = useState<string>('casa-101');
  const [extraQty, setExtraQty] = useState<Record<string, number>>({});

  const selectedPackage = packages.find(p => p.people === selectedPeople) || packages[0];
  const selectedHouseData = houses.find(h => h.id === selectedHouse);

  const getExtraPrice = (extraId: string) => {
    const extra = extras.find(e => e.id === extraId);
    if (!extra) return 0;
    const qty = extraQty[extraId] ?? 1;
    // find closest lower qty
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

  const handleBooking = () => {
    const dateText = checkInDate
      ? format(checkInDate, 'dd/MM/yyyy')
      : t('(data a definir)', '(date to be defined)', '(fecha por definir)', '(date à définir)');
    const houseName = selectedHouseData?.name || 'Casa 101';
    const houseTagline = selectedHouseData
      ? t(selectedHouseData.taglinePt, selectedHouseData.taglineEn, selectedHouseData.taglineEs, selectedHouseData.taglineFr)
      : '';
    const extrasText = selectedExtras.length
      ? '\nExtras: ' + selectedExtras.map(id => {
          const ex = extras.find(e => e.id === id);
          const qty = extraQty[id] ?? 1;
          return ex ? `${t(ex.namePt, ex.nameEn, ex.nameEs, ex.nameFr)} (${qty}x) €${getExtraPrice(id)}` : '';
        }).join(', ')
      : '';
    const message = t(
      `Olá! Gostaria de reservar o pacote para ${selectedPeople} pessoa(s). Acomodação: ${houseName} - ${houseTagline}. Check-in: ${dateText}.${extrasText} Total: €${totalPrice}`,
      `Hello! I would like to book the package for ${selectedPeople} person(s). Accommodation: ${houseName} - ${houseTagline}. Check-in: ${dateText}.${extrasText} Total: €${totalPrice}`,
      `¡Hola! Me gustaría reservar el paquete para ${selectedPeople} persona(s). Alojamiento: ${houseName} - ${houseTagline}. Check-in: ${dateText}.${extrasText} Total: €${totalPrice}`,
      `Bonjour! Je souhaite réserver le forfait pour ${selectedPeople} personne(s). Hébergement: ${houseName} - ${houseTagline}. Arrivée: ${dateText}.${extrasText} Total: €${totalPrice}`
    );
    window.open(`https://wa.me/5524999999999?text=${encodeURIComponent(message)}`, '_blank');
    toast.success(t('Redirecionando para WhatsApp...', 'Redirecting to WhatsApp...', 'Redirigiendo a WhatsApp...', 'Redirection vers WhatsApp...'));
  };

  const stepTitles = [
    t('Quantas pessoas?', 'How many people?', '¿Cuántas personas?', 'Combien de personnes?'),
    t('Escolha a acomodação', 'Choose accommodation', 'Elige el alojamiento', "Choisissez l'hébergement"),
    t('Adicione experiências extras', 'Add extra experiences', 'Añade experiencias extras', 'Ajoutez des expériences'),
    t('Data de check-in', 'Check-in date', 'Fecha de check-in', "Date d'arrivée"),
  ];

  const stepIcons = [
    <Users className="w-5 h-5" />,
    <Home className="w-5 h-5" />,
    <Euro className="w-5 h-5" />,
    <CalendarIcon className="w-5 h-5" />,
  ];

  return (
    <section id="packages" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-secondary text-2xl">■</span>
            <h2 className="section-title">
              {t('Pacotes e Valores', 'Packages & Prices', 'Paquetes y Precios', 'Forfaits et Tarifs')}
            </h2>
            <span className="text-secondary text-2xl">■</span>
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              {Array.from({ length: TOTAL_STEPS }).map((_, i) => {
                const num = i + 1;
                const done = step > num;
                const active = step === num;
                return (
                  <div key={num} className="flex items-center flex-1">
                    <button
                      onClick={() => num < step && setStep(num)}
                      className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all shrink-0',
                        done ? 'bg-primary text-white cursor-pointer' : active ? 'bg-primary text-white ring-4 ring-primary/30' : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {done ? <Check className="w-5 h-5" /> : num}
                    </button>
                    {i < TOTAL_STEPS - 1 && (
                      <div className={cn('h-1 flex-1 mx-2 rounded-full transition-all', done ? 'bg-primary' : 'bg-muted')} />
                    )}
                  </div>
                );
              })}
            </div>
            <p className="text-center text-sm text-muted-foreground font-medium">
              {t('Passo', 'Step', 'Paso', 'Étape')} {step} {t('de', 'of', 'de', 'sur')} {TOTAL_STEPS} — <span className="text-foreground font-semibold">{stepTitles[step - 1]}</span>
            </p>
          </div>

          {/* Mini summary bar */}
          {step > 1 && (
            <div className="flex flex-wrap gap-2 mb-6 p-3 bg-muted/50 rounded-xl text-sm">
              <span className="text-muted-foreground">{t('Selecionado:', 'Selected:', 'Seleccionado:', 'Sélectionné:')}</span>
              <span className="font-medium">{selectedPeople} {selectedPeople === 1 ? t('pessoa', 'person', 'persona', 'personne') : t('pessoas', 'people', 'personas', 'personnes')} · €{selectedPackage.price}</span>
              {step > 2 && <span className="font-medium">· {selectedHouseData?.name}</span>}
              {step > 3 && checkInDate && <span className="font-medium">· {format(checkInDate, 'dd/MM/yyyy')}</span>}
              {step > 3 && selectedExtras.length > 0 && <span className="font-medium">· {selectedExtras.length} {t('extras', 'extras', 'extras', 'extras')}</span>}
            </div>
          )}

          {/* Step 1 — Pessoas */}
          {step === 1 && (
            <Card className="p-8 border-primary/20 animate-fade-in-up">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Users className="w-6 h-6 text-primary" />
                {t('Selecione o número de pessoas', 'Select number of people', 'Seleccione el número de personas', 'Sélectionnez le nombre de personnes')}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {packages.map((pkg) => (
                  <button
                    key={pkg.people}
                    onClick={() => { setSelectedPeople(pkg.people); setTimeout(() => setStep(2), 300); }}
                    className={cn(
                      'p-6 rounded-xl border-2 transition-all hover:scale-105',
                      selectedPeople === pkg.people
                        ? 'border-primary bg-primary/10 shadow-elegant'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div className="text-center">
                      <Users className={cn('w-8 h-8 mx-auto mb-2', selectedPeople === pkg.people ? 'text-primary' : 'text-muted-foreground')} />
                      <p className="font-semibold text-lg mb-1">
                        {pkg.people} {pkg.people === 1 ? t('pessoa', 'person', 'persona', 'personne') : t('pessoas', 'people', 'personas', 'personnes')}
                      </p>
                      <p className="text-2xl font-bold text-primary">€{pkg.price}</p>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          )}

          {/* Step 2 — Casa */}
          {step === 2 && (
            <Card className="p-8 border-secondary/20 animate-fade-in-up">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Home className="w-6 h-6 text-secondary" />
                {t('Selecione a acomodação', 'Select accommodation', 'Seleccione el alojamiento', "Sélectionnez l'hébergement")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {houses.map((house) => {
                  const IconComponent = house.icon;
                  return (
                    <button
                      key={house.id}
                      onClick={() => { setSelectedHouse(house.id); setTimeout(() => setStep(3), 300); }}
                      className={cn(
                        'p-6 rounded-xl border-2 transition-all hover:scale-[1.02] text-left',
                        selectedHouse === house.id
                          ? 'border-secondary bg-secondary/10 shadow-elegant'
                          : 'border-border hover:border-secondary/50'
                      )}
                    >
                      <div className="flex items-start gap-4">
                        <div className={cn('p-3 rounded-lg', selectedHouse === house.id ? 'bg-secondary/20' : 'bg-muted')}>
                          <IconComponent className={cn('w-6 h-6', selectedHouse === house.id ? 'text-secondary' : 'text-muted-foreground')} />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-lg">{house.name}</p>
                          <p className={cn('text-sm mb-2', selectedHouse === house.id ? 'text-secondary' : 'text-muted-foreground')}>
                            {t(house.taglinePt, house.taglineEn, house.taglineEs, house.taglineFr)}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            {t(house.highlightPt, house.highlightEn, house.highlightEs, house.highlightFr)}
                          </p>
                        </div>
                        {selectedHouse === house.id && <Check className="w-5 h-5 text-secondary shrink-0" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Step 3 — Extras */}
          {step === 3 && (
            <Card className="p-8 border-accent/20 animate-fade-in-up">
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <Euro className="w-6 h-6 text-accent" />
                {t('Experiências extras', 'Extra experiences', 'Experiencias extras', 'Expériences supplémentaires')}
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                {t('Opcional — adicione e escolha quantas pessoas participam.', 'Optional — add and choose how many people participate.', 'Opcional — añade y elige cuántas personas participan.', 'Optionnel — ajoutez et choisissez combien de personnes participent.')}
              </p>
              <div className="space-y-4">
                {extras.map((extra) => {
                  const isSelected = selectedExtras.includes(extra.id);
                  const currentQty = extraQty[extra.id] ?? 1;
                  return (
                    <div
                      key={extra.id}
                      className={cn(
                        'p-4 rounded-xl border-2 transition-all cursor-pointer',
                        isSelected ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/50'
                      )}
                      onClick={() => toggleExtra(extra.id)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Checkbox id={extra.id} checked={isSelected} onCheckedChange={() => toggleExtra(extra.id)} />
                          <Label htmlFor={extra.id} className="cursor-pointer font-medium text-base">
                            {t(extra.namePt, extra.nameEn, extra.nameEs, extra.nameFr)}
                          </Label>
                        </div>
                        <div className="flex items-center gap-1 text-lg font-bold text-accent">
                          <Euro className="w-4 h-4" />
                          {getExtraPrice(extra.id)}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 pl-7" onClick={e => e.stopPropagation()}>
                        {QTY_OPTIONS.map(qty => (
                          <button
                            key={qty}
                            onClick={e => setQty(extra.id, qty, e)}
                            className={cn(
                              'px-3 py-1 rounded-md text-sm font-semibold border transition-all',
                              currentQty === qty
                                ? 'bg-accent text-white border-accent'
                                : 'border-border text-muted-foreground hover:border-accent/60'
                            )}
                          >
                            {qty}x · €{extra.prices[qty]}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Step 4 — Data + Resumo */}
          {step === 4 && (
            <div className="space-y-6 animate-fade-in-up">
              <Card className="p-8 border-primary/20">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <CalendarIcon className="w-6 h-6 text-primary" />
                  {t('Data de check-in', 'Check-in date', 'Fecha de check-in', "Date d'arrivée")}
                </h3>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn('w-full md:w-[300px] justify-start text-left font-normal', !checkInDate && 'text-muted-foreground')}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkInDate ? format(checkInDate, 'dd/MM/yyyy') : <span>{t('Selecione a data', 'Pick a date', 'Seleccione la fecha', 'Choisissez une date')}</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={checkInDate} onSelect={setCheckInDate} disabled={(date) => date < new Date()} initialFocus className="p-3 pointer-events-auto" />
                  </PopoverContent>
                </Popover>
              </Card>

              {/* Resumo */}
              <Card className="p-8 bg-gradient-sunset border-none text-white">
                <h3 className="text-xl font-bold mb-4">{t('Resumo da Reserva', 'Booking Summary', 'Resumen de Reserva', 'Résumé de la Réservation')}</h3>
                <div className="space-y-2 mb-6 text-white/90 text-sm">
                  <div className="flex justify-between">
                    <span>{t('Pacote', 'Package', 'Paquete', 'Forfait')} ({selectedPeople} {selectedPeople === 1 ? t('pessoa', 'person', 'persona', 'personne') : t('pessoas', 'people', 'personas', 'personnes')})</span>
                    <span className="font-semibold">€{selectedPackage.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('Acomodação', 'Accommodation', 'Alojamiento', 'Hébergement')}</span>
                    <span className="font-semibold">{selectedHouseData?.name}</span>
                  </div>
                  {checkInDate && (
                    <div className="flex justify-between">
                      <span>Check-in</span>
                      <span className="font-semibold">{format(checkInDate, 'dd/MM/yyyy')}</span>
                    </div>
                  )}
                  {selectedExtras.map(id => {
                    const ex = extras.find(e => e.id === id);
                    if (!ex) return null;
                    return (
                      <div key={id} className="flex justify-between">
                        <span>{t(ex.namePt, ex.nameEn, ex.nameEs, ex.nameFr)} ({extraQty[id] ?? 1}x)</span>
                        <span className="font-semibold">€{getExtraPrice(id)}</span>
                      </div>
                    );
                  })}
                  <div className="border-t border-white/30 pt-3 mt-3 flex justify-between text-lg font-bold">
                    <span>{t('Total', 'Total', 'Total', 'Total')}</span>
                    <span className="text-2xl">€{totalPrice}</span>
                  </div>
                </div>
                <Button
                  onClick={handleBooking}
                  size="lg"
                  className="w-full bg-white text-primary hover:bg-white/90 py-6 text-lg font-semibold shadow-elegant hover:scale-105 active:scale-95 transition-all"
                >
                  {t('Reservar via WhatsApp', 'Book via WhatsApp', 'Reservar por WhatsApp', 'Réserver via WhatsApp')} →
                </Button>
                <div className="mt-6 pt-4 border-t border-white/20 space-y-2 text-sm text-white/80">
                  <div className="flex items-start gap-2"><Check className="w-4 h-4 mt-0.5 shrink-0" /><p>{t('Inclui: Hospedagem, motorista privado, dois passeios de lancha, visitas guiadas.', 'Includes: Accommodation, private driver, two boat tours, guided visits.', 'Incluye: Alojamiento, conductor privado, dos paseos en lancha, visitas guiadas.', 'Comprend: Hébergement, chauffeur privé, deux excursions en bateau, visites guidées.')}</p></div>
                  <div className="flex items-start gap-2"><Check className="w-4 h-4 mt-0.5 shrink-0" /><p>{t('Valores em euros, baseados no câmbio atual.', 'Prices in euros, based on current exchange rate.', 'Precios en euros, basados en el tipo de cambio actual.', 'Prix en euros, basés sur le taux de change actuel.')}</p></div>
                </div>
              </Card>
            </div>
          )}

          {/* Navigation buttons */}
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
              <Button onClick={() => setStep(s => Math.min(TOTAL_STEPS, s + 1))} className="gap-2 bg-primary text-white hover:bg-primary/90">
                {t('Próximo', 'Next', 'Siguiente', 'Suivant')}
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
