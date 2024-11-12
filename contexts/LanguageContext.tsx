import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations } from '../translations';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Language = 'vi' | 'en' | 'zh' | 'ko' | 'ja' | 'fr';

type LanguageContextType = {
  t: (key: string, params?: Record<string, any>) => string;
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState('vi');

  useEffect(() => {
    // Load saved language
    AsyncStorage.getItem('language').then((lang) => {
      if (lang) setCurrentLanguage(lang);
    });
  }, []);

  const setLanguage = async (lang: Language) => {
    setCurrentLanguage(lang);
    await AsyncStorage.setItem('language', lang);
  };

  const t = useCallback((key: string, params?: Record<string, any>) => {
    const keys = key.split('.');
    let value = translations[currentLanguage];
    
    for (const k of keys) {
      value = value?.[k];
      if (!value) break;
    }
    
    if (!value) return key;
    
    if (params) {
      return Object.entries(params).reduce((str, [key, value]) => {
        return str.replace(`{${key}}`, value.toString());
      }, value);
    }
    
    return value;
  }, [currentLanguage]);

  return (
    <LanguageContext.Provider value={{ t, currentLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}; 