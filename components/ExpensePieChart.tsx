import { View, Text, Dimensions } from 'react-native'
import { PieChart } from 'react-native-chart-kit'
import { EXPENSE_CATEGORIES } from '../utils/categories'

import { useTranslation } from '../contexts/LanguageContext'
import { Transaction } from '@/type'

type Props = {
  transactions: Transaction[]
}

export default function ExpensesPieChart({ transactions }: Props) {
  const { t } = useTranslation()

  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      const category = transaction.category
      acc[category] = (acc[category] || 0) + transaction.amount
      return acc
    }, {} as Record<string, number>)

  const chartData = Object.entries(expensesByCategory).map(([categoryId, amount]) => {
    const category = EXPENSE_CATEGORIES.find(c => c.id === categoryId)
    
    return {
      name: category ? t(`categories.${category.id}`) : '',
      amount,
      color: category?.color || '#000000',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12
    }
  })

  return (
    <View className="mt-4">
      <Text className="text-lg font-bold mb-2">
        {t('screens.statistics.categoryAnalysis')}
      </Text>
      {chartData.length > 0 ? (
        <PieChart
          data={chartData}
          width={Dimensions.get('window').width - 32}
          height={220}
          chartConfig={{
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      ) : (
        <Text className="text-gray-500 text-center">
          {t('screens.statistics.noExpenseData')}
        </Text>
      )}
    </View>
  )
}