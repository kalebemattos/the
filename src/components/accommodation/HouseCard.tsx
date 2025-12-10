import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Home, ChevronRight, Waves, Sparkles } from 'lucide-react';
import type { AccommodationData } from '@/data/accommodations';

interface HouseCardProps {
  house: AccommodationData;
  onViewDetails: (house: AccommodationData) => void;
}

export function HouseCard({ house, onViewDetails }: HouseCardProps) {
  const { language, t } = useLanguage();

  const getLocalizedText = (text: { pt: string; en: string; es: string }) => {
    return text[language];
  };

  const getHighlightIcon = () => {
    if (house.id === 'casa-101') return Sparkles;
    if (house.id === 'casa-102') return Waves;
    return Home;
  };

  const HighlightIcon = getHighlightIcon();

  return (
    <Card className="group overflow-hidden border-primary/20 hover-lift bg-card/80 backdrop-blur-sm">
      <div className="relative h-48 bg-gradient-ocean flex items-center justify-center overflow-hidden">
        {house.coverImage ? (
          <img 
            src={house.coverImage} 
            alt={getLocalizedText(house.name)}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
            <Home className="w-16 h-16 text-white/80 group-hover:scale-110 transition-transform duration-300" />
          </>
        )}
        {house.highlight && (
          <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground z-10">
            <HighlightIcon className="w-3 h-3 mr-1" />
            {getLocalizedText(house.highlight)}
          </Badge>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-4 z-10">
          <h3 className="text-xl font-display font-bold text-foreground">
            {getLocalizedText(house.name)}
          </h3>
        </div>
      </div>
      
      <CardContent className="p-5 space-y-4">
        <p className="text-sm font-medium text-primary italic">
          "{getLocalizedText(house.tagline)}"
        </p>
        
        <p className="text-sm text-muted-foreground line-clamp-2">
          {getLocalizedText(house.description)}
        </p>

        <div className="flex flex-wrap gap-1">
          {house.features.slice(0, 3).map((feature, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {getLocalizedText(feature)}
            </Badge>
          ))}
          {house.features.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{house.features.length - 3}
            </Badge>
          )}
        </div>

        <Button
          onClick={() => onViewDetails(house)}
          variant="outline"
          className="w-full group/btn border-primary/30 hover:bg-primary hover:text-primary-foreground"
        >
          {t('Ver Detalhes', 'View Details', 'Ver Detalles')}
          <ChevronRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
}
