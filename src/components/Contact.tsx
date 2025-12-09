import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Mail, MapPin, Phone } from 'lucide-react';
import { toast } from 'sonner';

export function Contact() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const message = `${t('Nome', 'Name', 'Nombre')}: ${formData.name}\n${t('Email', 'Email', 'Correo')}: ${formData.email}\n${t('Mensagem', 'Message', 'Mensaje')}: ${formData.message}`;
    const whatsappUrl = `https://wa.me/5524999880848?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
    toast.success(
      t(
        'Redirecionando para WhatsApp...',
        'Redirecting to WhatsApp...',
        'Redirigiendo a WhatsApp...'
      )
    );
    
    setFormData({ name: '', email: '', message: '' });
  };

  const openWhatsApp = () => {
    window.open('https://wa.me/5524999880848', '_blank');
  };

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-primary text-2xl">■</span>
            <h2 className="section-title">
              {t('Contato', 'Contact', 'Contacto')}
            </h2>
            <span className="text-primary text-2xl">■</span>
          </div>
          <p className="section-subtitle">
            {t(
              'Entre em contato e comece a planejar sua viagem dos sonhos',
              'Get in touch and start planning your dream trip',
              'Ponte en contacto y comienza a planificar tu viaje de ensueño'
            )}
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="p-6 border-primary/20 hover-lift">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-ocean rounded-xl">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    {t('Telefone / WhatsApp', 'Phone / WhatsApp', 'Teléfono / WhatsApp')}
                  </h3>
                  <p className="text-muted-foreground">+55 24 999880848</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-primary/20 hover-lift">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-ocean rounded-xl">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Email</h3>
                  <p className="text-muted-foreground">contato@thebestofangra.com</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-primary/20 hover-lift">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-ocean rounded-xl">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    {t('Localização', 'Location', 'Ubicación')}
                  </h3>
                  <p className="text-muted-foreground">Angra dos Reis, Rio de Janeiro, Brasil</p>
                </div>
              </div>
            </Card>

            <Button
              onClick={openWhatsApp}
              size="lg"
              className="w-full bg-gradient-ocean text-white hover:opacity-90 py-6 text-lg shadow-elegant"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              {t('Fale com nossa equipe', 'Contact our team', 'Habla con nuestro equipo')}
            </Button>
          </div>

          {/* Contact Form */}
          <Card className="p-8 border-primary/20">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('Nome', 'Name', 'Nombre')}
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t('Seu nome', 'Your name', 'Tu nombre')}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder={t('seu@email.com', 'your@email.com', 'tu@correo.com')}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('Mensagem', 'Message', 'Mensaje')}
                </label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={t(
                    'Conte-nos sobre sua viagem dos sonhos...',
                    'Tell us about your dream trip...',
                    'Cuéntanos sobre tu viaje de ensueño...'
                  )}
                  rows={5}
                  required
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-primary hover:bg-primary-glow text-white py-6 text-lg"
              >
                {t('Enviar Mensagem', 'Send Message', 'Enviar Mensaje')} →
              </Button>
            </form>
          </Card>
        </div>
      </div>

      {/* WhatsApp Fixed Button */}
      <button
        onClick={openWhatsApp}
        className="fixed bottom-6 right-6 bg-[#25D366] hover:bg-[#20BA5A] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all z-50 animate-bounce"
        aria-label="WhatsApp"
      >
        <MessageCircle className="w-8 h-8" />
      </button>
    </section>
  );
}
