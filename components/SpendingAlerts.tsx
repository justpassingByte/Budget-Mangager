import { View, Text, TouchableOpacity } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { useSettings } from '../hooks/useSetting'
import { createThemedStyles, darkColors, lightColors } from '../theme'
import { useTranslation } from '../contexts/LanguageContext'
import { convertCurrency, formatCurrency } from '@/utils/currency'

type Alert = {
  type: 'warning' | 'danger';
  message: string;
};

type Props = {
  alerts: Alert[];
  onDismiss: (index: number) => void;
};

export default function SpendingAlerts({ alerts, onDismiss }: Props) {
  const { isDarkMode, settings } = useSettings();
  const styles = createThemedStyles(isDarkMode);
  const colors = isDarkMode ? darkColors : lightColors;
  const { t } = useTranslation();

  return (
    <View className="mb-4">
      {alerts.map((alert, index) => (
        <View
          key={index}
          style={[
            styles.card,
            { 
              borderLeftWidth: 4,
              borderLeftColor: alert.type === 'danger' 
                ? colors.error
                : colors.warning
            }
          ]}
          className="flex-row items-center p-4 mb-2 rounded-lg"
        >
          <View className="flex-row items-center flex-1">
            <FontAwesome 
              name={alert.type === 'danger' ? 'exclamation-circle' : 'exclamation-triangle'} 
              size={16} 
              color={alert.type === 'danger' ? colors.error : colors.warning}
              style={{ marginRight: 8 }}
            />
            <Text style={styles.text} className="flex-1 mr-2">
              {alert.message}
            </Text>
          </View>
          
          <TouchableOpacity
            onPress={() => onDismiss(index)}
            className="p-2"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <FontAwesome 
              name="times" 
              size={16} 
              color={colors.secondaryText}
            />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}