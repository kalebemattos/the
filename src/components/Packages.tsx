import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Users, Check, Euro, Calendar as CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export function Packages() {
  const { t } = useLanguage();
  const [selectedPeople, setSelectedPeople] = useState<number>(1);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [checkInDate, setCheckInDate] = useState<Date>();

  const packages = [
    { people: 1, price: 3000 },
    { people: 2, price: 4000 },
    { people: 4, price: 5000 },
    { people: 5, price: 5700 },
    { people: 6, price: 6000 },
  ];

  const extras = [
    { id: 'diving', namePt: 'Mergulho Subaquático', nameEn: 'Scuba Diving', nameEs: 'Buceo Submarino', price: 150 },
    { id: 'rio', namePt: 'Cristo Redentor & Pão de Açúcar', nameEn: 'Christ the Redeemer & Sugarloaf', nameEs: 'Cristo Redentor y Pan de Azúcar', price: 200 },
    { id: 'aquarium', namePt: 'AquaRio / BioParque', nameEn: 'AquaRio / BioParque', nameEs: 'AquaRio / BioParque', price: 100 },
    { id: 'paragliding', namePt: 'Voo de Parapente', nameEn: 'Paragliding Flight', nameEs: 'Vuelo de Parapente', price: 250 },
  ];

  const selectedPackage = packages.find(p => p.people === selectedPeople) || packages[0];
  const extrasTotal = selectedExtras.reduce((sum, extraId) => {
    const extra = extras.find(e => e.id === extraId);
    return sum + (extra?.price || 0);
  }, 0);
  const totalPrice = selectedPackage.price + extrasTotal;

  const toggleExtra = (extraId: string) => {
    setSelectedExtras(prev =>
      prev.includes(extraId)
        ? prev.filter(id => id !== extraId)
        : [...prev, extraId]
    );
  };

  // --- ALTERAÇÃO COMPLETA DO HANDLEBOOKING ---
  const handleBooking = () => {
    const dateText = checkInDate
      ? format(checkInDate, 'dd/MM/yyyy')
      : t('(data a definir)', '(date to be defined)', '(fecha por definir)');

    const selectedExtrasText =
      selectedExtras.length > 0
        ? extras
            .filter(e => selectedExtras.includes(e.id))
            .map(e => `${t(e.namePt, e.nameEn, e.nameEs)} (€${e.price})`)
            .join(', ')
        : t('Nenhum extra selecionado', 'No extras selected', 'Ningún extra seleccionado');

    const message = t(
      // PT
      `Olá! Gostaria de reservar o pacote.\n\n` +
      `📅 Data de check-in: ${dateText}\n` +
      `👥 Número de pessoas: ${selectedPeople}\n` +
      `✨ Experiências extras: ${selectedExtrasText}\n` +
      `💶 Valor total: €${totalPrice}\n\n` +
      `Pode verificar a disponibilidade?`,

      // EN
      `Hello! I would like to book the package.\n\n` +
      `📅 Check-in date: ${dateText}\n` +
      `👥 Number of people: ${selectedPeople}\n` +
      `✨ Extra experiences: ${selectedExtrasText}\n` +
      `💶 Total price: €${totalPrice}\n\n` +
      `Can you confirm availability?`,

      // ES
      `¡Hola! Me gustaría reservar el paquete.\n\n` +
      `📅 Fecha de check-in: ${dateText}\n` +
      `👥 Número de personas: ${selectedPeople}\n` +
      `✨ Experiencias extras: ${selectedExtrasText}\n` +
      `💶 Precio total: €${totalPrice}\n\n` +
      `¿Puede confirmar disponibilidad?`
    );

    const whatsappUrl = `https://wa.me/5524999880848?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    toast.success(
      t(
        'Redirecionando para WhatsApp...',
        'Redirecting to WhatsApp...',
        'Redirigiendo a WhatsApp...'
      )
    );
  };
  // --- FIM DAS ALTERAÇÕES ---

  return (
    <section id="packages" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-secondary text-2xl">■</span>
            <h2 className="section-title">
              {t('Pacotes e Valores', 'Packages & Prices', 'Paquetes y Precios')}
            </h2>
            <span className="text-secondary text-2xl">■</span>
          </div>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Número de Pessoas */}
          <Card className="p-8 mb-8 border-primary/20">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" />
              {t('Selecione o Número de Pessoas', 'Select Number of People', 'Seleccione el Número de Personas')}
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {packages.map((pkg) => (
                <button
                  key={pkg.people}
                  onClick={() => setSelectedPeople(pkg.people)}
                  className={`p-6 rounded-xl border-2 transition-all hover:scale-105 ${
                    selectedPeople === pkg.people
                      ? 'border-primary bg-primary/10 shadow-elegant'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="text-center">
                    <Users
                      className={`w-8 h-8 mx-auto mb-2 ${
                        selectedPeople === pkg.people ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    />
                    <p className="font-semibold text-lg mb-1">
                      {pkg.people}{' '}
                      {pkg.people === 1
                        ? t('pessoa', 'person', 'persona')
                        : t('pessoas', 'people', 'personas')}
                    </p>
                    <p className="text-2xl font-bold text-primary">€{pkg.price}</p>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Data de Check-in */}
          <Card className="p-8 mb-8 border-accent/20">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <CalendarIcon className="w-6 h-6 text-accent" />
              {t('Data de Check-in', 'Check-in Date', 'Fecha de Check-in')}
            </h3>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full md:w-[300px] justify-start text-left font-normal',
                    !checkInDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkInDate ? (
                    format(checkInDate, 'dd/MM/yyyy')
                  ) : (
                    <span>{t('Selecione a data', 'Pick a date', 'Seleccione la fecha')}</span>
                  )}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={checkInDate}
                  onSelect={setCheckInDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </Card>

          {/* Extras */}
          <Card className="p-8 mb-8 border-accent/20">
            <h3 className="text-xl font-semibold mb-6">
              {t('Adicione Experiências Extras', 'Add Extra Experiences', 'Añade Experiencias Extras')}
            </h3>

            <div className="space-y-4">
              {extras.map((extra) => (
                <div
                  key={extra.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-accent/50 transition-all cursor-pointer"
                  onClick={() => toggleExtra(extra.id)}
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id={extra.id}
                      checked={selectedExtras.includes(extra.id)}
                      onCheckedChange={() => toggleExtra(extra.id)}
                    />
                    <Label htmlFor={extra.id} className="cursor-pointer font-medium">
                      {t(extra.namePt, extra.nameEn, extra.nameEs)}
                    </Label>
                  </div>
                  <div className="flex items-center gap-2 text-lg font-semibold text-accent">
                    <Euro className="w-5 h-5" />
                    {extra.price}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Resumo */}
          <Card className="p-8 bg-gradient-sunset border-none text-white">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">
                  {t('Valor Total', 'Total Price', 'Precio Total')}
                </h3>
                <div className="flex items-center gap-2 text-4xl font-bold">
                  <Euro className="w-8 h-8" />
                  {totalPrice}
                </div>
                <p className="text-white/80 mt-2">
                  {selectedPeople}{' '}
                  {selectedPeople === 1
                    ? t('pessoa', 'person', 'persona')
                    : t('pessoas', 'people', 'personas')}
                  {selectedExtras.length > 0 && ` + ${selectedExtras.length} ${t('extras', 'extras', 'extras')}`}
                </p>
              </div>

              <Button
                onClick={handleBooking}
                size="lg"
                className="bg-white text-primary hover:bg-white/90 px-12 py-6 text-lg font-semibold shadow-elegant hover:scale-105 transition-all"
              >
                {t('Reservar Agora', 'Book Now', 'Reservar Ahora')} →
              </Button>
            </div>

            <div className="mt-8 pt-6 border-t border-white/20">
              <div className="space-y-2 text-sm text-white/90">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p>
                    {t(
                      'Inclui: Hospedagem completa, motorista privado, dois passeios de lancha, visitas guiadas e roteiros culturais e naturais.',
                      'Includes: Full accommodation, private driver, two boat tours, guided tours, and cultural and natural itineraries.',
                      'Incluye: Alojamiento completo, conductor privado, dos paseos en lancha, visitas guiadas e itinerarios culturales y naturales.'
                    )}
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p>
                    {t(
                      'Valores em euros, baseados no câmbio atual.',
                      'Prices in euros, based on current exchange rate.',
                      'Precios en euros, basados en el tipo de cambio actual.'
                    )}
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p>
                    {t(
                      'Assistência completa para compra de passagens aéreas Europa–Rio–Europa.',
                      'Complete assistance for purchasing Europe–Rio–Europe airline tickets.',
                      'Asistencia completa para la compra de boletos aéreos Europa–Río–Europa.'
                    )}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
