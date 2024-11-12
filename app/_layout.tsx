import '../global.css'
import { Stack } from 'expo-router';
import { TransactionProvider } from '../hooks/useTransaction';
import { SettingsProvider } from '../hooks/useSetting';
import { PaperProvider, MD3DarkTheme, MD3LightTheme, adaptNavigationTheme } from 'react-native-paper';
import { ThemeProvider } from '@react-navigation/native';
import { useSettings } from '../hooks/useSetting';
import { darkColors, lightColors } from '../theme';
import { LanguageProvider } from '@/contexts/LanguageContext';

function AppContent() {
  const { isDarkMode } = useSettings();

  const paperTheme = {
    ...(isDarkMode ? MD3DarkTheme : MD3LightTheme),
    colors: {
      ...(isDarkMode ? MD3DarkTheme.colors : MD3LightTheme.colors),
      ...(isDarkMode ? darkColors : lightColors),
    },
  };

  const { DarkTheme, LightTheme } = adaptNavigationTheme({
    reactNavigationLight: paperTheme,
    reactNavigationDark: paperTheme,
  });

  const navigationTheme = isDarkMode ? DarkTheme : LightTheme;

  return (
    <PaperProvider theme={paperTheme}>
      <ThemeProvider value={navigationTheme}>
        <TransactionProvider>
          <Stack screenOptions={{
            contentStyle: { backgroundColor: isDarkMode ? darkColors.background : lightColors.background }
          }}>
            <Stack.Screen 
              name="(tabs)" 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="(modals)/income" 
              options={{
                presentation: 'modal',
                headerShown: false,
                animation: 'slide_from_bottom',
              }}
            />
            <Stack.Screen 
              name="(modals)/expense" 
              options={{
                presentation: 'modal',
                headerShown: false,
                animation: 'slide_from_bottom',
              }}
            />
          </Stack>
        </TransactionProvider>
      </ThemeProvider>
    </PaperProvider>
  );
}

export default function AppLayout() {
  return (
    <LanguageProvider>
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
    </LanguageProvider>
  );
}