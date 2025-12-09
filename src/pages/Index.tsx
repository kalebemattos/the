import { LanguageProvider } from '@/contexts/LanguageContext';
import { Hero } from '@/components/Hero';
import { Accommodation } from '@/components/Accommodation';
import { Itinerary } from '@/components/Itinerary';
import { Extras } from '@/components/Extras';
import { Packages } from '@/components/Packages';
import { Gallery } from '@/components/Gallery';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <LanguageProvider>
      <div className="min-h-screen">
        <Hero />
        <Accommodation />
        <Itinerary />
        <Extras />
        <Packages />
        <Gallery />
        <Contact />
        <Footer />
      </div>
    </LanguageProvider>
  );
};

export default Index;
