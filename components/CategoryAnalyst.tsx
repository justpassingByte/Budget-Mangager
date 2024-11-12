import { View, Text, Dimensions } from 'react-native'
import { PieChart } from 'react-native-chart-kit'
import { useTranslation } from '../contexts/LanguageContext'
import { useSettings } from '../hooks/useSetting'
import { createThemedStyles, darkColors, lightColors } from '../theme'
import { formatCurrency } from '../utils/currency'

type Props = {
  categoryData: {
    name: string
    amount: number
    color: string
    percentage: number
  }[]
  totalExpense: number
}

export default function CategoryAnalysis({ categoryData, totalExpense }: Props) {
  const { t } = useTranslation()
  const { isDarkMode, settings } = useSettings()
  const styles = createThemedStyles(isDarkMode)
  const colors = isDarkMode ? darkColors : lightColors

  const chartConfig = {
    backgroundGradientFrom: colors.background,
    backgroundGradientTo: colors.background,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => colors.text,
  }

  return (
    <View style={[styles.card]} className="rounded-xl p-4 shadow-sm mb-4">
      <Text style={styles.text} className="font-bold text-lg mb-4">
        {t('screens.statistics.categoryAnalysis')}
      </Text>
      
      <PieChart
        data={categoryData}
        width={Dimensions.get('window').width - 32}
        height={220}
        chartConfig={chartConfig}
        accessor="amount"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />

      <View className="mt-4">
        {categoryData.map((item, index) => (
          <View 
            key={index} 
            style={[styles.border]} 
            className="flex-row justify-between items-center py-2"
          >
            <View className="flex-row items-center">
              <View 
                style={{ backgroundColor: item.color }} 
                className="w-3 h-3 rounded-full mr-2" 
              />
              <Text style={styles.text}>
                {t(`categories.${item.name}`)}
              </Text>
            </View>
            <View>
              <Text style={styles.text} className="font-medium">
                {formatCurrency(item.amount, settings.currency)}
              </Text>
              <Text style={styles.secondaryText} className="text-right text-sm">
                {item.percentage.toFixed(1)}%
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  )
}