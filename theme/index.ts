import { StyleSheet } from 'react-native';

// Colors
export const lightColors = {
  primary: '#007AFF',
  background: '#FFFFFF',
  surface: '#F3F4F6',
  text: '#1F2937',
  secondaryText: '#6B7280',
  border: '#E5E7EB',
  card: '#FFFFFF',
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  iconBackground: '#F3F4F6',
};

export const darkColors = {
  primary: '#60A5FA',
  background: '#1F2937',
  surface: '#374151',
  text: '#F9FAFB',
  secondaryText: '#D1D5DB',
  border: '#4B5563',
  card: '#374151',
  success: '#34D399',
  error: '#F87171',
  warning: '#FBBF24',
  iconBackground: '#374151',
};

// Spacing
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Typography
export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  h3: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  body: {
    fontSize: 16,
  },
  caption: {
    fontSize: 14,
  },
};

// Common Styles
export const createThemedStyles = (isDark: boolean) => {
  const colors = isDark ? darkColors : lightColors;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 16,
    },
    iconBackground: {
      backgroundColor: colors.iconBackground,
    },
    text: {
      color: colors.text,
    },
    secondaryText: {
      color: colors.secondaryText,
    },
    border: {
      borderColor: colors.border,
    },
    // Common layout styles
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    center: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    spaceBetween: {
      justifyContent: 'space-between',
    },
  });
};

// Theme getter
export const getTheme = (isDark: boolean) => ({
  colors: isDark ? darkColors : lightColors,
  spacing,
  typography,
  styles: createThemedStyles(isDark),
});

// Types
export type Theme = ReturnType<typeof getTheme>;
export type ThemeColors = typeof lightColors;