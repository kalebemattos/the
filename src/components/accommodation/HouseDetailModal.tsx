import { useLanguage } from '@/contexts/LanguageContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  Check,
  Home,
  Heart,
  ImageIcon,
  X,
} from 'lucide-react';
import type { AccommodationData } from '@/data/accommodations';

interface HouseDetailModalProps {
  house: AccommodationData | null;
  open: boolean;
  onClose: () => void;
}

export function HouseDetailModal({ house, open, onClose }: HouseDetailModalProps) {
  const { language, t } = useLanguage();

  if (!house) return null;

  const getLocalizedText = (text: { pt: string; en: string; es: string }) => {
    return text[language];
  };

  const placeholderImages = [1, 2, 3, 4, 5, 6];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl font-display font-bold text-foreground">
                {getLocalizedText(house.name)}
              </DialogTitle>
              <p className="text-lg text-primary italic mt-1">
                {getLocalizedText(house.tagline)}
              </p>
            </div>
            {house.highlight && (
              <Badge className="bg-accent text-accent-foreground">
                {getLocalizedText(house.highlight)}
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Gallery Section */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2 text-foreground">
              <ImageIcon className="w-5 h-5 text-primary" />
              {t('Galeria de Fotos', 'Photo Gallery', 'Galería de Fotos')}
            </h4>
            
            {house.images.length > 0 ? (
              <Carousel className="w-full">
                <CarouselContent>
                  {house.images.map((image, index) => (
                    <CarouselItem key={index} className="md:basis-1/2">
                      <div className="aspect-video rounded-lg overflow-hidden">
                        <img
                          src={image}
                          alt={`${getLocalizedText(house.name)} - ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </Carousel>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {placeholderImages.map((_, index) => (
                  <div
                    key={index}
                    className="aspect-video rounded-lg bg-muted flex items-center justify-center border-2 border-dashed border-muted-foreground/30"
                  >
                    <div className="text-center text-muted-foreground">
                      <Home className="w-8 h-8 mx-auto mb-1 opacity-50" />
                      <span className="text-xs">
                        {t('Foto', 'Photo', 'Foto')} {index + 1}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-3">
            <p className="text-muted-foreground leading-relaxed">
              {getLocalizedText(house.description)}
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">
              {t('Comodidades', 'Amenities', 'Comodidades')}
            </h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {house.features.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>{getLocalizedText(feature)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Ideal For */}
          <div className="bg-gradient-ocean p-5 rounded-xl text-white">
            <div className="flex items-start gap-3">
              <Heart className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">
                  {t('Ideal para', 'Ideal for', 'Ideal para')}
                </p>
                <p className="text-white/90 text-sm">
                  {getLocalizedText(house.idealFor)}
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              <X className="w-4 h-4 mr-2" />
              {t('Fechar', 'Close', 'Cerrar')}
            </Button>
            <Button
              className="flex-1 bg-primary hover:bg-primary/90"
              onClick={() => {
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                  onClose();
                  setTimeout(() => {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                  }, 300);
                }
              }}
            >
              {t('Reservar Agora', 'Book Now', 'Reservar Ahora')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
