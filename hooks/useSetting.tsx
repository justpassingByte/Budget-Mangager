import { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import { 
  CURRENCY_CONFIG, 
  convertCurrency, 
  formatCurrency
} from '../utils/currency';

interface Settings {
  darkMode: boolean;
  currency: string;
  language: string;
}

interface SettingsContextType {
  settings: Settings;
  isDarkMode: boolean;
  isLoading: boolean;
  updateSettings: (newSettings: Partial<Settings>) => Promise<void>;
  resetSettings: () => Promise<void>;
  toggleDarkMode: () => Promise<void>;
  setCurrency: (currency: string) => Promise<void>;
  setLanguage: (language: string) => Promise<void>;
  convertAmount: (amount: number, fromCurrency: string) => number;
  formatAmount: (amount: number, fromCurrency: string) => string;
}

const defaultSettings: Settings = {
  darkMode: false,
  currency: 'VND',
  language: 'vi',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('settings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      } else {
        await AsyncStorage.setItem('settings', JSON.stringify(defaultSettings));
      }
    } catch (error) {
      console.error('Lỗi khi tải cài đặt:', error);
    }
  };

  const updateSettings = async (newSettings: Partial<Settings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
      await AsyncStorage.setItem('settings', JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('Lỗi khi cập nhật cài đặt:', error);
    }
  };

  const formatAmount = useCallback((amount: number, fromCurrency: string = 'VND') => {
    const convertedAmount = convertCurrency(amount, fromCurrency, settings.currency);
    return formatCurrency(convertedAmount, settings.currency);
  }, [settings.currency]);

  return (
    <SettingsContext.Provider 
      value={{ 
        settings, 
        isDarkMode: settings.darkMode, 
        isLoading: false, 
        updateSettings, 
        resetSettings: loadSettings, 
        toggleDarkMode: async () => {
          const updatedSettings = { ...settings, darkMode: !settings.darkMode };
          setSettings(updatedSettings);
          await AsyncStorage.setItem('settings', JSON.stringify(updatedSettings));
        },  
        setCurrency: async (currency: string) => {
          const updatedSettings = { ...settings, currency };
          setSettings(updatedSettings);
          await AsyncStorage.setItem('settings', JSON.stringify(updatedSettings));
        }, 
        setLanguage: async (language: string) => {
          const updatedSettings = { ...settings, language };
          setSettings(updatedSettings);
          await AsyncStorage.setItem('settings', JSON.stringify(updatedSettings));
        }, 
        convertAmount: (amount: number, fromCurrency: string) => {
          return convertCurrency(amount, fromCurrency, settings.currency);
        }, 
        formatAmount
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}