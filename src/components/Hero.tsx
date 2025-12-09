import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import heroImage from '@/assets/hero-angra.jpg';
import { LanguageToggle } from './LanguageToggle';

// ⚠️ IMPORTANTE: TROQUE ESTE CAMINHO PELO DA SUA LOGO!
import myLogoImage from '@/assets/minha-logo.png'; 

export function Hero() {
  const { t } = useLanguage();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-hero" />
      </div>

      {/* Logo - Top Left */}
      <div className="absolute top-6 left-6 z-30">
        <div className="bg-white/12 backdrop-blur-sm rounded-lg p-15 border border-white/15 hover:bg-white/15 transition-all">
          
          {/* Componente da Logo (Imagem) */}
          <img 
            src={myLogoImage} 
            alt="Logo da Agência Angra" 
            className="h-12
             w-auto filter drop-shadow-md" 
          />
          
        </div>
      </div>

      {/* Language Toggle - Top Right */}
      <div className="absolute top-6 right-6 z-20">
        <LanguageToggle />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <div className="animate-fade-in-up">
          
          {/* Título Principal */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="text-secondary text-3xl">■</span>
            <h1 className="hero-title">
              THE BEST OF ANGRA
            </h1>
            <span className="text-secondary text-3xl">■</span>
          </div>
          
          {/* Subtítulo 1 */}
          <p className="hero-subtitle text-xl md:text-2xl mb-4 max-w-3xl mx-auto">
            {t(
              'Experiência de 10 dias no paraíso brasileiro',
              '10-Day Experience in the Brazilian Paradise',
              'Experiencia de 10 días en el paraíso brasileño'
            )}
          </p>
          
          {/* Citação/Mensagem de Marketing */}
          <p className="text-lg md:text-xl text-white/80 mb-12 max-w-2xl mx-auto italic">
            {t(
              '"Entre ilhas e montanhas, Angra dos Reis é o cenário perfeito para viver dias inesquecíveis."',
              '"Between islands and mountains, Angra dos Reis is the perfect setting for unforgettable days."',
              '"Entre islas y montañas, Angra dos Reis es el escenario perfecto para vivir días inolvidables."'
            )}
          </p>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => scrollToSection('itinerary')}
              size="lg"
              className="bg-primary hover:bg-primary-glow text-white px-8 py-6 text-lg shadow-elegant transition-all hover:scale-105"
            >
              {t('Ver Roteiro Completo', 'View Full Itinerary', 'Ver Itinerario Completo')} →
            </Button>
            <Button
              onClick={() => scrollToSection('packages')}
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-6 text-lg transition-all hover:scale-105"
            >
              {t('Reservar Agora', 'Book Now', 'Reservar Ahora')}
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white" />
        </div>
      </div>
    </section>
  );
}