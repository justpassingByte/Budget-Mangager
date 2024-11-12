import { View, Text } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Transaction } from '../type';
import { useSettings } from '../hooks/useSetting';
import { createThemedStyles, darkColors, lightColors } from '../theme';
import { formatCurrency } from '../utils/currency';
import { useTranslation } from '../contexts/LanguageContext';

interface TransactionItemProps {
  transaction: Transaction;
  isLast: boolean;
  colors: typeof lightColors;
  styles: ReturnType<typeof createThemedStyles>;
}

export const TransactionItem = ({ transaction, isLast, colors, styles }: TransactionItemProps): JSX.Element => {
  const { formatAmount } = useSettings() // Sử dụng formatAmount từ useSettings
  const { t } = useTranslation()
  const iconName = transaction.type === 'income' ? 'arrow-down-circle' : 'arrow-up-circle'
  const iconColor = transaction.type === 'income' ? colors.success : colors.error
  
  return (
    <View style={[
      { backgroundColor: colors.surface },
      !isLast && { borderBottomColor: colors.border, borderBottomWidth: 1 }
    ]} className="flex-row items-center p-4">
      <View style={{ backgroundColor: colors.background }} className="w-10 h-10 rounded-full items-center justify-center mr-4">
        <MaterialCommunityIcons name={iconName} size={24} color={iconColor} />
      </View>
      <View className="flex-1">
        <Text style={styles.text} className="font-medium">
          {transaction.note || t('fields.noNote')}
        </Text>
        <Text style={styles.secondaryText} className="text-sm">
          {new Date(transaction.date).toLocaleDateString()}
        </Text>
      </View>
      <Text style={{ 
        color: transaction.type === 'income' ? colors.success : colors.error,
        fontWeight: 'bold'
      }}>
        {transaction.type === 'income' ? '+' : '-'}
        {formatAmount(transaction.amount)}
      </Text>
    </View>
  )
}