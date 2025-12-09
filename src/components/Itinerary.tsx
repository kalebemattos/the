import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from '@/components/ui/card';
import { Calendar, Anchor, Droplets, Umbrella, Castle, Church, Palmtree, ShoppingBag, Sunset, Heart } from 'lucide-react';
import day1 from '@/assets/day1-accommodation.jpg';
import day2 from '@/assets/day2-boat-tour.jpg';
import day3 from '@/assets/day3-waterfall.jpg';
import day4 from '@/assets/day4-beach.jpg';
import day5 from '@/assets/day5-paraty.jpg';
import day6 from '@/assets/day6-monuments.jpg';
import day7 from '@/assets/day7-relaxation.jpg';
import day8 from '@/assets/day8-culture.jpg';
import day9 from '@/assets/day9-sunset-boat.jpg';
import day10 from '@/assets/day10-farewell.jpg';

export function Itinerary() {
  const { t } = useLanguage();

  const days = [
    {
      icon: Calendar,
      image: day1,
      titlePt: 'Chegada & Acomodação',
      titleEn: 'Check-in & Rest',
      titleEs: 'Llegada y Acomodación',
      descPt: 'Chegada a Angra dos Reis, check-in no apartamento e tempo para descanso e adaptação.',
      descEn: 'Arrival in Angra dos Reis, apartment check-in, and time for rest and adaptation.',
      descEs: 'Llegada a Angra dos Reis, check-in en apartamento y tiempo para descanso y adaptación.',
    },
    {
      icon: Anchor,
      image: day2,
      titlePt: 'Passeio de Lancha - Ilhas Paradisíacas',
      titleEn: 'Private Boat Tour - Paradise Islands',
      titleEs: 'Paseo en Lancha - Islas Paradisíacas',
      descPt: 'Explore as ilhas mais famosas de Angra dos Reis com lancha privativa. Águas cristalinas, praias desertas e cenários de tirar o fôlego.',
      descEn: 'Explore the most famous islands of Angra dos Reis with a private speedboat. Crystal clear waters, deserted beaches, and breathtaking scenery.',
      descEs: 'Explora las islas más famosas de Angra dos Reis con lancha privada. Aguas cristalinas, playas desiertas y paisajes impresionantes.',
    },
    {
      icon: Droplets,
      image: day3,
      titlePt: 'Cachoeira & Natureza',
      titleEn: 'Waterfalls & Nature',
      titleEs: 'Cascada y Naturaleza',
      descPt: 'Conexão com a natureza em cachoeiras deslumbrantes cercadas pela Mata Atlântica. Banhos refrescantes e trilhas ecológicas.',
      descEn: 'Connection with nature at stunning waterfalls surrounded by the Atlantic Forest. Refreshing baths and ecological trails.',
      descEs: 'Conexión con la naturaleza en cascadas impresionantes rodeadas por la Mata Atlántica. Baños refrescantes y senderos ecológicos.',
    },
    {
      icon: Umbrella,
      image: day4,
      titlePt: 'Dia de Praia',
      titleEn: 'Beach Day',
      titleEs: 'Día de Playa',
      descPt: 'Relaxe nas praias mais bonitas da região. Areia branca, águas calmas e todo o conforto para um dia perfeito à beira-mar.',
      descEn: 'Relax on the most beautiful beaches in the region. White sand, calm waters, and all the comfort for a perfect day by the sea.',
      descEs: 'Relájate en las playas más hermosas de la región. Arena blanca, aguas tranquilas y toda la comodidad para un día perfecto junto al mar.',
    },
    {
      icon: Castle,
      image: day5,
      titlePt: 'Passeio em Paraty',
      titleEn: 'Paraty Historical Tour',
      titleEs: 'Paseo en Paraty',
      descPt: 'Visite a charmosa cidade histórica de Paraty. Arquitetura colonial, ruas de pedra e cultura rica em cada esquina.',
      descEn: 'Visit the charming historical town of Paraty. Colonial architecture, cobblestone streets, and rich culture on every corner.',
      descEs: 'Visita el encantador pueblo histórico de Paraty. Arquitectura colonial, calles empedradas y cultura rica en cada esquina.',
    },
    {
      icon: Church,
      image: day6,
      titlePt: 'Monumentos & Cultura',
      titleEn: 'Monuments & Culture',
      titleEs: 'Monumentos y Cultura',
      descPt: 'Visite locais históricos e monumentos que contam a rica história da região. Igrejas coloniais e patrimônios culturais.',
      descEn: 'Visit historical sites and monuments that tell the rich history of the region. Colonial churches and cultural heritage.',
      descEs: 'Visita sitios históricos y monumentos que cuentan la rica historia de la región. Iglesias coloniales y patrimonio cultural.',
    },
    {
      icon: Palmtree,
      image: day7,
      titlePt: 'Praia & Relax - Águas Quentes',
      titleEn: 'Beach & Relaxation - Warm Waters',
      titleEs: 'Playa y Relax - Aguas Cálidas',
      descPt: 'Dia livre para curtir praias de águas quentes e relaxar em cenários paradisíacos. Descanso total e renovação de energias.',
      descEn: 'Free day to enjoy warm water beaches and relax in paradisiacal settings. Total rest and energy renewal.',
      descEs: 'Día libre para disfrutar de playas de aguas cálidas y relajarse en escenarios paradisíacos. Descanso total y renovación de energías.',
    },
    {
      icon: ShoppingBag,
      image: day8,
      titlePt: 'Passeios Culturais',
      titleEn: 'Cultural Tours',
      titleEs: 'Paseos Culturales',
      descPt: 'Imersão cultural com visitas a mercados locais, artesanato regional e experiências autênticas com a cultura brasileira.',
      descEn: 'Cultural immersion with visits to local markets, regional handicrafts, and authentic experiences with Brazilian culture.',
      descEs: 'Inmersión cultural con visitas a mercados locales, artesanía regional y experiencias auténticas con la cultura brasileña.',
    },
    {
      icon: Sunset,
      image: day9,
      titlePt: 'Passeio de Lancha 2 - Pôr do Sol',
      titleEn: 'Sunset Boat Tour',
      titleEs: 'Paseo en Lancha 2 - Atardecer',
      descPt: 'Segundo passeio de lancha para apreciar o espetacular pôr do sol entre as ilhas. Momento mágico e inesquecível.',
      descEn: 'Second boat tour to enjoy the spectacular sunset among the islands. Magical and unforgettable moment.',
      descEs: 'Segundo paseo en lancha para apreciar la espectacular puesta de sol entre las islas. Momento mágico e inolvidable.',
    },
    {
      icon: Heart,
      image: day10,
      titlePt: 'Dia Livre & Despedida',
      titleEn: 'Free Day & Farewell',
      titleEs: 'Día Libre y Despedida',
      descPt: 'Último dia para aproveitar livremente, fazer compras de lembranças e se despedir do paraíso. Check-out com coração cheio de memórias.',
      descEn: 'Last day to enjoy freely, shop for souvenirs, and say goodbye to paradise. Check-out with a heart full of memories.',
      descEs: 'Último día para disfrutar libremente, comprar recuerdos y despedirse del paraíso. Check-out con el corazón lleno de memorias.',
    },
  ];

  return (
    <section id="itinerary" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-primary text-2xl">■</span>
            <h2 className="section-title">
              {t('Roteiro Principal - 10 Dias', 'Main Itinerary - 10 Days', 'Itinerario Principal - 10 Días')}
            </h2>
            <span className="text-primary text-2xl">■</span>
          </div>
          <p className="section-subtitle">
            {t(
              'Uma jornada cuidadosamente planejada para você viver o melhor de Angra dos Reis',
              'A carefully planned journey to experience the best of Angra dos Reis',
              'Un viaje cuidadosamente planificado para vivir lo mejor de Angra dos Reis'
            )}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {days.map((day, index) => {
            const Icon = day.icon;
            return (
              <Card
                key={index}
                className="group relative overflow-hidden hover-lift cursor-pointer border-primary/20"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={day.image}
                    alt={`Day ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  
                  {/* Day Number Badge */}
                  <div className="absolute top-4 left-4 bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg shadow-lg">
                    {index + 1}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-lg">
                      {t(day.titlePt, day.titleEn, day.titleEs)}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(day.descPt, day.descEn, day.descEs)}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <p className="text-xl md:text-2xl font-semibold gradient-text italic">
            {t(
              '"Angra dos Reis é mais do que um destino — é uma memória que fica."',
              '"Angra dos Reis is more than a destination — it\'s a memory that stays."',
              '"Angra dos Reis es más que un destino — es una memoria que perdura."'
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
