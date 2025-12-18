import React, { createContext, useContext, useState } from 'react';

type Language = 'pt' | 'en' | 'es' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (pt: string, en: string, es: string, fr?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('pt');

  const t = (pt: string, en: string, es: string, fr?: string) => {
    switch (language) {
      case 'en':
        return en;
      case 'es':
        return es;
      case 'fr':
        return fr || en;
      default:
        return pt;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
