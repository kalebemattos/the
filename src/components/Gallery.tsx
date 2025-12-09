import { useLanguage } from '@/contexts/LanguageContext';
import heroImage from '@/assets/hero-angra.jpg';
import day2 from '@/assets/day2-boat-tour.jpg';
import day3 from '@/assets/day3-waterfall.jpg';
import day4 from '@/assets/day4-beach.jpg';
import day5 from '@/assets/day5-paraty.jpg';
import day7 from '@/assets/day7-relaxation.jpg';
import day9 from '@/assets/day9-sunset-boat.jpg';

export function Gallery() {
  const { t } = useLanguage();

  const images = [
    { src: heroImage, alt: 'Angra dos Reis Aerial View' },
    { src: day2, alt: 'Boat Tour' },
    { src: day3, alt: 'Waterfall' },
    { src: day4, alt: 'Beach' },
    { src: day5, alt: 'Paraty' },
    { src: day7, alt: 'Relaxation' },
    { src: day9, alt: 'Sunset' },
  ];

  return (
    <section id="gallery" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-accent text-2xl">■</span>
            <h2 className="section-title">
              {t('Galeria de Experiências', 'Experience Gallery', 'Galería de Experiencias')}
            </h2>
            <span className="text-accent text-2xl">■</span>
          </div>
          <p className="section-subtitle">
            {t(
              'Imagens que capturam a essência do paraíso',
              'Images that capture the essence of paradise',
              'Imágenes que capturan la esencia del paraíso'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
          {images.map((image, index) => (
            <div
              key={index}
              className={`group relative overflow-hidden rounded-2xl shadow-card hover-lift cursor-pointer ${
                index === 0 ? 'md:col-span-2 md:row-span-2' : ''
              }`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className={`w-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                  index === 0 ? 'h-[500px]' : 'h-[250px]'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
