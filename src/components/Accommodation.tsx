import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { accommodations, type AccommodationData } from '@/data/accommodations';
import { HouseCard } from './accommodation/HouseCard';
import { HouseDetailModal } from './accommodation/HouseDetailModal';

export function Accommodation() {
  const { t } = useLanguage();
  const [selectedHouse, setSelectedHouse] = useState<AccommodationData | null>(null);

  return (
    <section id="accommodation" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-primary text-2xl">■</span>
            <h2 className="section-title">
              {t('Hospedagem', 'Accommodation', 'Alojamiento', 'Hébergement')}
            </h2>
            <span className="text-primary text-2xl">■</span>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t(
              'Escolha entre 4 acomodações exclusivas, cada uma com seu charme único e conforto incomparável.',
              'Choose from 4 exclusive accommodations, each with its unique charm and unmatched comfort.',
              'Elija entre 4 alojamientos exclusivos, cada uno con su encanto único y confort incomparable.',
              'Choisissez parmi 4 hébergements exclusifs, chacun avec son charme unique et son confort incomparable.'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {accommodations.map((house, index) => (
            <div
              key={house.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <HouseCard
                house={house}
                onViewDetails={setSelectedHouse}
              />
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-gradient-ocean p-6 rounded-xl text-white max-w-3xl mx-auto">
            <p className="text-lg font-semibold italic">
              {t(
                '"Conforto, privacidade e vista para o mar — o refúgio perfeito em Angra."',
                '"Comfort, privacy, and ocean views — the perfect retreat in Angra."',
                '"Comodidad, privacidad y vista al mar — el refugio perfecto en Angra."',
                '"Confort, intimité et vue sur la mer — la retraite parfaite à Angra."'
              )}
            </p>
          </div>
        </div>
      </div>

      <HouseDetailModal
        house={selectedHouse}
        open={!!selectedHouse}
        onClose={() => setSelectedHouse(null)}
      />
    </section>
  );
}