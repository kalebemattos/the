import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from '@/components/ui/card';
import { Home, Users, Utensils, Waves } from 'lucide-react';
import accommodationImage from '@/assets/day1-accommodation.jpg';

export function Accommodation() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Home,
      title: t('2 Quartos Completos', '2 Full Bedrooms', '2 Habitaciones Completas'),
    },
    {
      icon: Users,
      title: t('Sofá-cama na Sala', 'Sofa Bed in Living Room', 'Sofá cama en Sala'),
    },
    {
      icon: Utensils,
      title: t('Cozinha Equipada', 'Equipped Kitchen', 'Cocina Equipada'),
    },
    {
      icon: Waves,
      title: t('Piscina e Churrasqueira', 'Pool & BBQ Area', 'Piscina y Parrilla'),
    },
  ];

  return (
    <section id="accommodation" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-primary text-2xl">■</span>
            <h2 className="section-title">
              {t('Hospedagem', 'Accommodation', 'Alojamiento')}
            </h2>
            <span className="text-primary text-2xl">■</span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div className="animate-scale-in">
            <img
              src={accommodationImage}
              alt="Accommodation"
              className="rounded-2xl shadow-card hover-lift w-full h-[400px] object-cover"
            />
          </div>

          <div className="space-y-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t(
                'Apartamentos completos com garagem, 2 quartos, sofá-cama na sala, banheiro, cozinha equipada e área gourmet comunitária com piscina e churrasqueira. Alguns apartamentos contam com hidromassagem privativa.',
                'Complete apartments with parking, 2 bedrooms, sofa bed in the living room, bathroom, equipped kitchen, and communal gourmet area with pool and BBQ. Some apartments feature private hot tubs.',
                'Apartamentos completos con garaje, 2 habitaciones, sofá cama en sala, baño, cocina equipada y área gourmet comunitaria con piscina y parrilla. Algunos apartamentos cuentan con hidromasaje privado.'
              )}
            </p>

            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <Card key={index} className="p-4 hover-lift border-primary/20">
                  <feature.icon className="w-6 h-6 text-primary mb-2" />
                  <p className="text-sm font-medium">{feature.title}</p>
                </Card>
              ))}
            </div>

            <div className="bg-gradient-ocean p-6 rounded-xl text-white">
              <p className="text-lg font-semibold italic">
                {t(
                  '"Conforto, privacidade e vista para o mar — o refúgio perfeito em Angra."',
                  '"Comfort, privacy, and ocean views — the perfect retreat in Angra."',
                  '"Comodidad, privacidad y vista al mar — el refugio perfecto en Angra."'
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
