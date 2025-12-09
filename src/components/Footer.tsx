import { useLanguage } from '@/contexts/LanguageContext';
import { Instagram, Facebook, Mail } from 'lucide-react';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gradient-ocean text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Logo & Description */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">■</span>
              <h3 className="text-2xl font-bold">The Best of Angra</h3>
              <span className="text-2xl">■</span>
            </div>
            <p className="text-white/80 leading-relaxed">
              {t(
                'Experiências únicas no paraíso brasileiro. Transformando sonhos em memórias inesquecíveis.',
                'Unique experiences in the Brazilian paradise. Turning dreams into unforgettable memories.',
                'Experiencias únicas en el paraíso brasileño. Transformando sueños en recuerdos inolvidables.'
              )}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">
              {t('Links Rápidos', 'Quick Links', 'Enlaces Rápidos')}
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#accommodation" className="text-white/80 hover:text-white transition-colors">
                  {t('Hospedagem', 'Accommodation', 'Alojamiento')}
                </a>
              </li>
              <li>
                <a href="#itinerary" className="text-white/80 hover:text-white transition-colors">
                  {t('Roteiro', 'Itinerary', 'Itinerario')}
                </a>
              </li>
              <li>
                <a href="#packages" className="text-white/80 hover:text-white transition-colors">
                  {t('Pacotes', 'Packages', 'Paquetes')}
                </a>
              </li>
              <li>
                <a href="#contact" className="text-white/80 hover:text-white transition-colors">
                  {t('Contato', 'Contact', 'Contacto')}
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg font-semibold mb-4">
              {t('Redes Sociais', 'Social Media', 'Redes Sociales')}
            </h4>
            <div className="flex gap-4">
              <a
                href="https://instagram.com/thebestofangra"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="https://facebook.com/thebestofangra"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="mailto:contato@thebestofangra.com"
                className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all hover:scale-110"
                aria-label="Email"
              >
                <Mail className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/20 text-center">
          <p className="text-xl font-semibold italic mb-2">
            {t(
              'Descubra. Sinta. Viva.',
              'Discover. Feel. Live.',
              'Descubre. Siente. Vive.'
            )}
          </p>
          <p className="text-white/80">
            {t(
              'The Best of Angra — onde a beleza nunca acaba.',
              'The Best of Angra — where beauty never ends.',
              'The Best of Angra — donde la belleza nunca termina.'
            )}
          </p>
          <p className="text-white/60 text-sm mt-4">
            © 2025 The Best of Angra. {t('Todos os direitos reservados.', 'All rights reserved.', 'Todos los derechos reservados.')}
          </p>
        </div>
      </div>
    </footer>
  );
}
