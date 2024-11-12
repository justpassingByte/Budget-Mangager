import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

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
}

const defaultSettings: Settings = {
  darkMode: false,
  currency: 'VND',
  language: 'vi',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('settings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Lỗi khi tải settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<Settings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
      await AsyncStorage.setItem('settings', JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('Lỗi khi cập nhật settings:', error);
    }
  };

  const setCurrency = async (newCurrency: string) => {
    try {
      const updatedSettings = { ...settings, currency: newCurrency };
      setSettings(updatedSettings);
      await AsyncStorage.setItem('settings', JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('Lỗi khi cập nhật tiền tệ:', error);
    }
  };

  const setLanguage = async (newLanguage: string) => {
    try {
      const updatedSettings = { ...settings, language: newLanguage };
      setSettings(updatedSettings);
      await AsyncStorage.setItem('settings', JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('Lỗi khi cập nhật ngôn ngữ:', error);
    }
  };

  const toggleDarkMode = async () => {
    try {
      const updatedSettings = { ...settings, darkMode: !settings.darkMode };
      setSettings(updatedSettings);
      await AsyncStorage.setItem('settings', JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('Lỗi khi thay đổi dark mode:', error);
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        isDarkMode: settings.darkMode,
        isLoading,
        updateSettings,
        resetSettings: loadSettings,
        toggleDarkMode,
        setCurrency,
        setLanguage,
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