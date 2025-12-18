import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from '@/components/ui/card';
import { Fish, Mountain, Waves, Wind } from 'lucide-react';

export function Extras() {
  const { t } = useLanguage();

  const extras = [
    {
      icon: Fish,
      titlePt: 'Mergulho Subaquático',
      titleEn: 'Scuba Diving',
      titleEs: 'Buceo Submarino',
      titleFr: 'Plongée Sous-Marine',
      descPt: 'Explore o fundo do mar de Angra dos Reis com equipamento profissional e instrutor certificado. Vida marinha exuberante e águas cristalinas.',
      descEn: 'Explore the seabed of Angra dos Reis with professional equipment and certified instructor. Exuberant marine life and crystal clear waters.',
      descEs: 'Explora el fondo del mar de Angra dos Reis con equipo profesional e instructor certificado. Vida marina exuberante y aguas cristalinas.',
      descFr: 'Explorez les fonds marins d\'Angra dos Reis avec équipement professionnel et instructeur certifié. Vie marine exubérante et eaux cristallines.',
    },
    {
      icon: Mountain,
      titlePt: 'Cristo Redentor e Pão de Açúcar',
      titleEn: 'Christ the Redeemer & Sugarloaf',
      titleEs: 'Cristo Redentor y Pan de Azúcar',
      titleFr: 'Christ Rédempteur et Pain de Sucre',
      descPt: 'Passeio completo pelos cartões-postais do Rio de Janeiro. Vista panorâmica da cidade maravilhosa dos pontos turísticos mais famosos do mundo.',
      descEn: 'Complete tour of Rio de Janeiro\'s postcards. Panoramic view of the marvelous city from the world\'s most famous tourist attractions.',
      descEs: 'Tour completo por las postales de Río de Janeiro. Vista panorámica de la ciudad maravillosa desde las atracciones turísticas más famosas del mundo.',
      descFr: 'Visite complète des cartes postales de Rio de Janeiro. Vue panoramique de la ville merveilleuse depuis les attractions touristiques les plus célèbres du monde.',
    },
    {
      icon: Waves,
      titlePt: 'AquaRio / BioParque do Rio',
      titleEn: 'AquaRio / Rio BioParque',
      titleEs: 'AquaRio / BioParque de Río',
      titleFr: 'AquaRio / BioParque de Rio',
      descPt: 'Visite o maior aquário marinho da América do Sul ou o incrível BioParque. Experiências educativas e encantadoras com a fauna brasileira.',
      descEn: 'Visit the largest marine aquarium in South America or the incredible BioParque. Educational and charming experiences with Brazilian fauna.',
      descEs: 'Visita el acuario marino más grande de América del Sur o el increíble BioParque. Experiencias educativas y encantadoras con la fauna brasileña.',
      descFr: 'Visitez le plus grand aquarium marin d\'Amérique du Sud ou l\'incroyable BioParque. Expériences éducatives et charmantes avec la faune brésilienne.',
    },
    {
      icon: Wind,
      titlePt: 'Voo Duplo de Parapente',
      titleEn: 'Tandem Paragliding Flight',
      titleEs: 'Vuelo Tándem de Parapente',
      titleFr: 'Vol en Parapente Biplace',
      descPt: 'Voe sobre as praias e ilhas de Angra dos Reis. Aventura radical com vista aérea inesquecível, acompanhado de instrutor experiente.',
      descEn: 'Fly over the beaches and islands of Angra dos Reis. Radical adventure with unforgettable aerial view, accompanied by an experienced instructor.',
      descEs: 'Vuela sobre las playas e islas de Angra dos Reis. Aventura radical con vista aérea inolvidable, acompañado de instructor experimentado.',
      descFr: 'Survolez les plages et les îles d\'Angra dos Reis. Aventure radicale avec une vue aérienne inoubliable, accompagné d\'un instructeur expérimenté.',
    },
  ];

  return (
    <section id="extras" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-accent text-2xl">■</span>
            <h2 className="section-title">
              {t('Opcionais', 'Extras', 'Opcionales', 'Options')}
            </h2>
            <span className="text-accent text-2xl">■</span>
          </div>
          <p className="section-subtitle">
            {t(
              'Personalize sua experiência e viva ainda mais o paraíso',
              'Customize your experience and live the paradise even more',
              'Personaliza tu experiencia y vive aún más el paraíso',
              'Personnalisez votre expérience et vivez encore plus le paradis'
            )}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {extras.map((extra, index) => {
            const Icon = extra.icon;
            return (
              <Card
                key={index}
                className="group p-6 hover-lift cursor-pointer border-accent/20 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-ocean opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
                
                <div className="relative z-10">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-gradient-ocean rounded-xl">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl mb-2">
                        {t(extra.titlePt, extra.titleEn, extra.titleEs, extra.titleFr)}
                      </h3>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {t(extra.descPt, extra.descEn, extra.descEs, extra.descFr)}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
