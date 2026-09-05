import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Mail, MapPin, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export function Contact() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Save to Supabase contacts table
    try {
      await supabase.from('contacts').insert({
        name: formData.name,
        email: formData.email || null,
        phone: formData.phone || null,
        message: formData.message || null,
        status: 'new',
      });
    } catch {
      // silently ignore — still open WhatsApp
    }

    const msg = `${t('Nome', 'Name', 'Nombre', 'Nom')}: ${formData.name}\n${t('Email', 'Email', 'Correo', 'Email')}: ${formData.email}\n${formData.phone ? 'Tel: ' + formData.phone + '\n' : ''}${t('Mensagem', 'Message', 'Mensaje', 'Message')}: ${formData.message}`;
    const whatsappUrl = `https://wa.me/5524999999999?text=${encodeURIComponent(msg)}`;
    window.open(whatsappUrl, '_blank');
    toast.success(
      t(
        'Redirecionando para WhatsApp...',
        'Redirecting to WhatsApp...',
        'Redirigiendo a WhatsApp...',
        'Redirection vers WhatsApp...'
      )
    );

    setFormData({ name: '', email: '', phone: '', message: '' });
    setSubmitting(false);
  };

  const openWhatsApp = () => {
    window.open('https://wa.me/5524999999999', '_blank');
  };

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-primary text-2xl">■</span>
            <h2 className="section-title">
              {t('Contato', 'Contact', 'Contacto', 'Contact')}
            </h2>
            <span className="text-primary text-2xl">■</span>
          </div>
          <p className="section-subtitle">
            {t(
              'Entre em contato e comece a planejar sua viagem dos sonhos',
              'Get in touch and start planning your dream trip',
              'Ponte en contacto y comienza a planificar tu viaje de ensueño',
              'Contactez-nous et commencez à planifier votre voyage de rêve'
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
                    {t('Telefone / WhatsApp', 'Phone / WhatsApp', 'Teléfono / WhatsApp', 'Téléphone / WhatsApp')}
                  </h3>
                  <p className="text-muted-foreground">+55 24 99999-9999</p>
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
                    {t('Localização', 'Location', 'Ubicación', 'Emplacement')}
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
              {t('Fale com nossa equipe', 'Contact our team', 'Habla con nuestro equipo', 'Contactez notre équipe')}
            </Button>
          </div>

          {/* Contact Form */}
          <Card className="p-8 border-primary/20">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('Nome', 'Name', 'Nombre', 'Nom')}
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t('Seu nome', 'Your name', 'Tu nombre', 'Votre nom')}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder={t('seu@email.com', 'your@email.com', 'tu@correo.com', 'votre@email.com')}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('Telefone / WhatsApp', 'Phone / WhatsApp', 'Teléfono / WhatsApp', 'Téléphone / WhatsApp')}
                </label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+55 00 00000-0000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('Mensagem', 'Message', 'Mensaje', 'Message')}
                </label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={t(
                    'Conte-nos sobre sua viagem dos sonhos...',
                    'Tell us about your dream trip...',
                    'Cuéntanos sobre tu viaje de ensueño...',
                    'Parlez-nous de votre voyage de rêve...'
                  )}
                  rows={5}
                  required
                />
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={submitting}
                className="w-full bg-primary hover:bg-primary-glow text-white py-6 text-lg"
              >
                {t('Enviar Mensagem', 'Send Message', 'Enviar Mensaje', 'Envoyer le Message')} →
              </Button>
            </form>
          </Card>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        {/* Instagram */}
        <button
          onClick={() => window.open('https://www.instagram.com/thebestofangra', '_blank')}
          className="bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-90 text-white p-3 rounded-full shadow-2xl hover:scale-110 transition-all animate-bounce"
          style={{ animationDelay: '0.15s' }}
          aria-label="Instagram"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </button>

        {/* WhatsApp */}
        <button
          onClick={openWhatsApp}
          className="bg-[#25D366] hover:bg-[#20BA5A] text-white p-3 rounded-full shadow-2xl hover:scale-110 transition-all animate-bounce"
          aria-label="WhatsApp"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
}
