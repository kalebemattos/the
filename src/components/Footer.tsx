import { useLanguage } from '@/contexts/LanguageContext';
import { Instagram, Mail, MessageCircle, MapPin, Phone } from 'lucide-react';

export function Footer() {
  const { t } = useLanguage();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-ocean-deep text-white">
      {/* Main content */}
      <div className="container mx-auto px-4 pt-16 pb-10">
        <div className="grid md:grid-cols-12 gap-10 mb-12">

          {/* Brand — 5 cols */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-primary text-xl">■</span>
              <span className="text-2xl font-bold tracking-tight">The Best of Angra</span>
            </div>
            <p className="text-white/60 leading-relaxed text-sm max-w-xs">
              {t(
                'Experiências únicas no paraíso brasileiro. Transformando sonhos em memórias inesquecíveis desde 2020.',
                'Unique experiences in the Brazilian paradise. Turning dreams into unforgettable memories since 2020.',
                'Experiencias únicas en el paraíso brasileño. Transformando sueños en recuerdos inolvidables desde 2020.',
                'Expériences uniques au paradis brésilien. Transformer les rêves en souvenirs inoubliables depuis 2020.'
              )}
            </p>

            {/* Contact info */}
            <div className="mt-6 space-y-2">
              <a href="https://wa.me/5524999999999" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
                <MessageCircle className="w-4 h-4 text-primary shrink-0" />
                +55 24 99999-9999
              </a>
              <a href="mailto:contato@thebestofangra.com"
                className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                contato@thebestofangra.com
              </a>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                Angra dos Reis, Rio de Janeiro, Brasil
              </div>
            </div>
          </div>

          {/* Nav — 3 cols */}
          <div className="md:col-span-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">
              {t('Navegação', 'Navigation', 'Navegación', 'Navigation')}
            </p>
            <ul className="space-y-3">
              {[
                { id: 'accommodation', pt: 'Hospedagem', en: 'Accommodation', es: 'Alojamiento', fr: 'Hébergement' },
                { id: 'itinerary', pt: 'Roteiro', en: 'Itinerary', es: 'Itinerario', fr: 'Itinéraire' },
                { id: 'gallery', pt: 'Galeria', en: 'Gallery', es: 'Galería', fr: 'Galerie' },
                { id: 'packages', pt: 'Pacotes & Valores', en: 'Packages & Prices', es: 'Paquetes y Precios', fr: 'Forfaits & Tarifs' },
                { id: 'contact', pt: 'Contato', en: 'Contact', es: 'Contacto', fr: 'Contact' },
              ].map(item => (
                <li key={item.id}>
                  <button
                    onClick={() => scrollTo(item.id)}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {t(item.pt, item.en, item.es, item.fr)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Social + tagline — 4 cols */}
          <div className="md:col-span-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">
              {t('Siga-nos', 'Follow us', 'Síguenos', 'Suivez-nous')}
            </p>
            <div className="flex gap-3 mb-8">
              <a
                href="https://www.instagram.com/the.best.of.angra/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm"
              >
                <Instagram className="w-4 h-4" />
                @the.best.of.angra
              </a>
            </div>

            <blockquote className="border-l-2 border-primary pl-4">
              <p className="text-white/80 text-sm italic leading-relaxed">
                {t(
                  '"Angra dos Reis é mais do que um destino — é uma memória que fica."',
                  '"Angra dos Reis is more than a destination — it\'s a memory that stays."',
                  '"Angra dos Reis es más que un destino — es una memoria que perdura."',
                  '"Angra dos Reis est plus qu\'une destination — c\'est un souvenir qui reste."'
                )}
              </p>
            </blockquote>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-xs">
            © 2025 The Best of Angra.{' '}
            {t('Todos os direitos reservados.', 'All rights reserved.', 'Todos los derechos reservados.', 'Tous droits réservés.')}
          </p>
          <p className="text-white/20 text-xs">
            {t('Feito com ♥ para quem ama viajar.', 'Made with ♥ for those who love to travel.', 'Hecho con ♥ para quienes aman viajar.', 'Fait avec ♥ pour ceux qui aiment voyager.')}
          </p>
        </div>
      </div>
    </footer>
  );
}
