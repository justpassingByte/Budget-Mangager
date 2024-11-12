import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { router } from 'expo-router'
import { useTransactions } from '../../hooks/useTransaction'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { LineChart } from 'react-native-chart-kit'
import type { Transaction } from '../../type'
import { createThemedStyles, darkColors } from '@/theme'
import { useTranslation } from '@/contexts/LanguageContext'
import { TransactionItem } from '../../components/TransactionItem'
import { lightColors } from '@/theme'
import { useSettings } from '@/hooks/useSetting'
import { convertCurrency, formatCurrency } from '@/utils/currency'

export default function HomeScreen(): JSX.Element {
  const { transactions } = useTransactions()
  const { isDarkMode, settings, convertAmount, formatAmount } = useSettings()
  const styles = createThemedStyles(isDarkMode)
  const colors = isDarkMode ? darkColors : lightColors
  const { t } = useTranslation()
  const screenWidth = Dimensions.get('window').width
  
  // Tính toán số dư với tiền tệ hiện tại
  const balance = transactions.reduce((total, transaction) => {
    // Chuyển đổi số tiền từ VND sang currency hiện tại
    const convertedAmount = convertAmount(transaction.amount, 'VND', settings.currency)
    return transaction.type === 'income' ? total + convertedAmount : total - convertedAmount
  }, 0)

  // Tính tổng thu nhập và chi tiêu với tiền tệ hiện tại
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => {
      const convertedAmount = convertAmount(t.amount, 'VND', settings.currency)
      return sum + convertedAmount
    }, 0)
    
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => {
      const convertedAmount = convertAmount(t.amount, 'VND', settings.currency)
      return sum + convertedAmount
    }, 0)

  // Lấy 5 giao dịch gần nhất
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  // Data cho biểu đồ
  const chartData = {
    labels: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
    datasets: [{
      data: [
        totalExpense * 0.2,
        totalExpense * 0.3,
        totalExpense * 0.1,
        totalExpense * 0.5,
        totalExpense * 0.4,
        totalExpense * 0.3,
        totalExpense * 0.2
      ]
    }]
  }

  return (
    <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1">
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <ScrollView className="flex-1">
        <View style={{ backgroundColor: colors.primary }} className="px-6 py-8">
          <Text style={styles.text} className="text-2xl font-bold mb-1">{t('screens.home.greeting')}</Text>
          <Text style={styles.secondaryText}>{t('screens.home.subtitle')}</Text>
        </View>

        <View className="mx-4 -mt-6">
          <View style={{ backgroundColor: colors.surface }} className="rounded-2xl p-6 shadow-lg">
            <Text style={styles.secondaryText} className="text-center mb-2">{t('screens.home.currentBalance')}</Text>
            <Text style={[styles.text, { fontSize: 32 }]} className="text-center font-bold mb-6">
              {formatCurrency(balance, settings.currency)}
            </Text>
            
            <View className="flex-row justify-between">
              <View className="items-center flex-1">
                <Text style={{ color: colors.success }} className="text-lg font-semibold">
                  +{formatCurrency(totalIncome, settings.currency)}
                </Text>
                <Text style={styles.secondaryText} className="mt-1">{t('screens.home.income')}</Text>
              </View>
              
              <View style={{ backgroundColor: colors.border }} className="w-px" />
              
              <View className="items-center flex-1">
                <Text style={{ color: colors.error }} className="text-lg font-semibold">
                  -{formatCurrency(totalExpense, settings.currency)}
                </Text>
                <Text style={styles.secondaryText} className="mt-1">{t('screens.home.expense')}</Text>
              </View>
            </View>
          </View>
        </View>

        <View className="flex-row justify-around mt-8 px-4">
          <TouchableOpacity 
            style={{ backgroundColor: colors.surface }}
            className="items-center p-4 rounded-xl shadow-sm flex-1 mx-2"
            onPress={() => router.push('/income')}
          >
            <View style={{ backgroundColor: colors.successLight }} className="w-12 h-12 rounded-full items-center justify-center mb-2">
              <MaterialCommunityIcons name="plus" size={24} color={colors.success} />
            </View>
            <Text style={styles.text}>{t('screens.home.income')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={{ backgroundColor: colors.surface }}
            className="items-center p-4 rounded-xl shadow-sm flex-1 mx-2"
            onPress={() => router.push('/expense')}
          >
            <View style={{ backgroundColor: colors.errorLight }} className="w-12 h-12 rounded-full items-center justify-center mb-2">
              <MaterialCommunityIcons name="minus" size={24} color={colors.error} />
            </View>
            <Text style={styles.text}>{t('screens.home.expense')}</Text>
          </TouchableOpacity>
        </View>

        <View className="mt-8 px-4">
          <Text style={styles.text} className="text-xl font-bold mb-4">{t('screens.home.expenseChart')}</Text>
          <View style={{ backgroundColor: colors.surface }} className="rounded-xl p-4 shadow-sm">
            <LineChart
              data={chartData}
              width={screenWidth - 48}
              height={220}
              chartConfig={{
                backgroundColor: colors.surface,
                backgroundGradientFrom: colors.surface,
                backgroundGradientTo: colors.surface,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                labelColor: () => colors.text,
                style: {
                  borderRadius: 16
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: colors.primary
                }
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16
              }}
            />
          </View>
        </View>

        <View className="mt-8 px-4 mb-8">
          <Text style={styles.text} className="text-xl font-bold mb-4">{t('screens.home.recentTransactions')}</Text>
          <View style={{ backgroundColor: colors.surface }} className="rounded-xl shadow-sm overflow-hidden">
            {recentTransactions.length === 0 ? (
              <View className="p-4 items-center">
                <MaterialCommunityIcons name="currency-usd-off" size={48} color={colors.secondaryText} />
                <Text style={styles.secondaryText} className="mt-2">{t('screens.home.noTransactions')}</Text>
              </View>
            ) : (
              recentTransactions.map((transaction, index) => (
                <TransactionItem 
                  key={transaction.id} 
                  transaction={transaction}
                  isLast={index === recentTransactions.length - 1}
                  colors={colors}
                  styles={styles}
                />
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

