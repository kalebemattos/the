import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: 'pt', label: 'PT' },
    { code: 'en', label: 'EN' },
    { code: 'es', label: 'ES' },
  ] as const;

  return (
    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full p-1">
      <Globe className="w-4 h-4 text-white ml-2" />
      {languages.map((lang) => (
        <Button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          variant="ghost"
          size="sm"
          className={`rounded-full px-3 py-1 text-sm transition-all ${
            language === lang.code
              ? 'bg-white text-primary font-semibold'
              : 'text-white hover:bg-white/20'
          }`}
        >
          {lang.label}
        </Button>
      ))}
    </div>
  );
}
