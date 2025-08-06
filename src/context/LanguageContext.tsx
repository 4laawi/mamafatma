'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'fr' | 'ar';

interface LanguageContextProps {
  lang: Language;
  setLang: (lang: Language) => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Language>('ar');
  const isRTL = lang === 'ar';

  return (
    <LanguageContext.Provider value={{ lang, setLang, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 