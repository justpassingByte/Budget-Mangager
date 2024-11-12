import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Modal, Dimensions, Alert, Pressable } from 'react-native'
import { useState, useMemo, useEffect, useCallback } from 'react'
import { useTransactions } from '../../hooks/useTransaction'
import { FontAwesome } from '@expo/vector-icons'
import { BarChart } from 'react-native-chart-kit' 
import SpendingAlerts from '@/components/SpendingAlerts'
import { PieChart } from 'react-native-chart-kit'
import { EXPENSE_CATEGORIES } from '../../utils/categories'
import { useSettings } from '../../hooks/useSetting';
import { createThemedStyles, darkColors, lightColors } from '../../theme';
import { useTranslation } from '../../contexts/LanguageContext';
import { convertCurrency, formatCurrency } from '@/utils/currency'

type FilterPeriod = 'day' | 'week' | 'month' | 'year'

export default function StatisticsScreen() {
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>('day')
  const [showFilterModal, setShowFilterModal] = useState(false)
  const { transactions, deleteTransaction } = useTransactions()
  const [alerts, setAlerts] = useState<{ type: 'warning' | 'danger', message: string }[]>([])
  const { isDarkMode, settings, convertAmount, formatAmount } = useSettings();
  const styles = createThemedStyles(isDarkMode);
  const colors = isDarkMode ? darkColors : lightColors;
  const { t, currentLanguage } = useTranslation();

  const filteredTransactions = useMemo(() => {
    const now = new Date()
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date)
      
      switch (filterPeriod) {
        case 'day':
          return transactionDate.toDateString() === now.toDateString()
        case 'week':
          const weekAgo = new Date(now)
          weekAgo.setDate(now.getDate() - 7)
          return transactionDate >= weekAgo
        case 'month':
          return (
            transactionDate.getMonth() === now.getMonth() &&
            transactionDate.getFullYear() === now.getFullYear()
          )
        case 'year':
          return transactionDate.getFullYear() === now.getFullYear()
        default:
          return true
      }
    })
  }, [filterPeriod, transactions])
  
  const totalIncome = useMemo(() => {
    return filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => {
        const convertedAmount = convertAmount(t.amount, 'VND', settings.currency)
        return sum + convertedAmount
      }, 0)
  }, [filteredTransactions, settings.currency])
    
  const totalExpense = useMemo(() => {
    return filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => {
        const convertedAmount = convertAmount(t.amount, 'VND', settings.currency)
        return sum + convertedAmount
      }, 0)
  }, [filteredTransactions, settings.currency])

  const getCompareLabel = () => {
    switch (filterPeriod) {
      case 'day':
        return [t('screens.statistics.compare.today'), t('screens.statistics.compare.yesterday')]
      case 'week':
        return [t('screens.statistics.compare.thisWeek'), t('screens.statistics.compare.lastWeek')]
      case 'month':
        return [t('screens.statistics.compare.thisMonth'), t('screens.statistics.compare.lastMonth')]
      case 'year':
        return [t('screens.statistics.compare.thisYear'), t('screens.statistics.compare.lastYear')]
      default:
        return [t('screens.statistics.compare.current'), t('screens.statistics.compare.previous')]
    }
  }

  const compareData = useMemo(() => {
    const now = new Date()
    let currentPeriodData: typeof transactions = []
    let previousPeriodData: typeof transactions = []

    switch (filterPeriod) {
      case 'day':
        // Hôm nay
        currentPeriodData = transactions.filter(t => {
          const date = new Date(t.date)
          return date.toDateString() === now.toDateString()
        })
        
        // Hôm qua
        const yesterday = new Date(now)
        yesterday.setDate(yesterday.getDate() - 1)
        previousPeriodData = transactions.filter(t => {
          const date = new Date(t.date)
          return date.toDateString() === yesterday.toDateString()
        })
        break

      case 'week':
        // Tuần này
        const weekStart = new Date(now)
        weekStart.setDate(now.getDate() - now.getDay())
        currentPeriodData = transactions.filter(t => {
          const date = new Date(t.date)
          return date >= weekStart && date <= now
        })
        
        // Tuần trước
        const lastWeekStart = new Date(weekStart)
        lastWeekStart.setDate(lastWeekStart.getDate() - 7)
        const lastWeekEnd = new Date(weekStart)
        lastWeekEnd.setDate(lastWeekEnd.getDate() - 1)
        previousPeriodData = transactions.filter(t => {
          const date = new Date(t.date)
          return date >= lastWeekStart && date <= lastWeekEnd
        })
        break

      case 'month':
        // Tháng này
        currentPeriodData = transactions.filter(t => {
          const date = new Date(t.date)
          return date.getMonth() === now.getMonth() && 
                 date.getFullYear() === now.getFullYear()
        })
        
        // Tháng trước
        const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1
        const lastMonthYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear()
        previousPeriodData = transactions.filter(t => {
          const date = new Date(t.date)
          return date.getMonth() === lastMonth && 
                 date.getFullYear() === lastMonthYear
        })
        break

      case 'year':
        // Năm nay
        currentPeriodData = transactions.filter(t => {
          const date = new Date(t.date)
          return date.getFullYear() === now.getFullYear()
        })
        
        // Năm trước
        previousPeriodData = transactions.filter(t => {
          const date = new Date(t.date)
          return date.getFullYear() === now.getFullYear() - 1
        })
        break
    }

    const currentIncome = currentPeriodData
      .filter(t => t.type === 'income')
      .reduce((sum, t) => {
        const convertedAmount = convertAmount(t.amount, 'VND', settings.currency)
        return sum + convertedAmount
      }, 0)
    
    const currentExpense = currentPeriodData
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => {
        const convertedAmount = convertAmount(t.amount, 'VND', settings.currency)
        return sum + convertedAmount
      }, 0)

    const previousIncome = previousPeriodData
      .filter(t => t.type === 'income')
      .reduce((sum, t) => {
        const convertedAmount = convertAmount(t.amount, 'VND', settings.currency)
        return sum + convertedAmount
      }, 0)
    
    const previousExpense = previousPeriodData
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => {
        const convertedAmount = convertAmount(t.amount, 'VND', settings.currency)
        return sum + convertedAmount
      }, 0)

    return {
      current: { income: currentIncome, expense: currentExpense },
      previous: { income: previousIncome, expense: previousExpense }
    }
  }, [filterPeriod, transactions, settings.currency])

  const calculateAlerts = useMemo(() => {
    const newAlerts: { type: 'warning' | 'danger', message: string }[] = []
    
    // Cảnh báo chi tiêu trong ngày
    const todayExpenses = filteredTransactions
      .filter(t => {
        const today = new Date()
        const transDate = new Date(t.date)
        return t.type === 'expense' && 
               transDate.toDateString() === today.toDateString()
      })
      .reduce((sum, t) => sum + convertAmount(t.amount, 'VND', settings.currency), 0)

    const averageDailyExpense = totalExpense / 30

    if (todayExpenses > averageDailyExpense * 2) {
      newAlerts.push({
        type: 'danger',
        message: t('common.alerts.highSpending', {
          today: formatCurrency(todayExpenses, settings.currency),
          average: formatCurrency(Math.round(averageDailyExpense), settings.currency),
          currency: settings.currency
        })
      })
    }

    // Cảnh báo tỷ lệ chi tiêu/thu nhập
    const expenseRatio = totalExpense / (totalIncome || 1)
    if (expenseRatio > 0.8) {
      newAlerts.push({
        type: expenseRatio > 0.9 ? 'danger' : 'warning',
        message: t('common.alerts.highExpenseRatio', {
          ratio: Math.min(expenseRatio * 100, 100).toFixed(1),
          period: filterPeriod === 'month' 
            ? t('common.time.month').toLowerCase() 
            : t('common.time.period').toLowerCase()
        })
      })
    }

    // Cảnh báo chi tiêu tăng đột biến
    if (compareData.current.expense > compareData.previous.expense * 1.5 && compareData.previous.expense > 0) {
      newAlerts.push({
        type: 'warning',
        message: t('common.alerts.suddenExpenseIncrease', {
          current: getCompareLabel()[0].toLowerCase(),
          increase: Math.min(
            ((compareData.current.expense / compareData.previous.expense - 1) * 100),
            999
          ).toFixed(0),
          previous: getCompareLabel()[1].toLowerCase()
        })
      })
    }

    return newAlerts
  }, [filteredTransactions, totalExpense, totalIncome, compareData, filterPeriod, settings.currency, t])

  useEffect(() => {
    setAlerts(calculateAlerts)
  }, [calculateAlerts])

  const handleDismissAlert = (index: number) => {
    setAlerts(current => current.filter((_, i) => i !== index))
  }

  const getFilterLabel = (period: FilterPeriod = filterPeriod) => {
    switch (period) {
      case 'day':
        return t('screens.statistics.compare.today')
      case 'week':
        return t('screens.statistics.compare.thisWeek')
      case 'month':
        return t('screens.statistics.compare.thisMonth')
      case 'year':
        return t('screens.statistics.compare.thisYear')
      default:
        return t('screens.statistics.compare.current')
    }
  }

  const chartData = useMemo(() => {
    const labels = getCompareLabel()
    return {
      labels: labels,
      datasets: [
        {
          data: [
            compareData.current.income,
            compareData.previous.income,
          ],
          color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
          label: t('screens.home.income')
        },
        {
          data: [
            compareData.current.expense,
            compareData.previous.expense,
          ],
          color: (opacity = 1) => `rgba(231, 76, 60, ${opacity})`,
          label: t('screens.home.expense')
        }
      ],
      legend: [
        t('screens.home.income'),
        t('screens.home.expense')
      ]
    }
  }, [compareData, filterPeriod, t])

  const chartConfig = {
    backgroundGradientFrom: colors.background,
    backgroundGradientTo: colors.background,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(${isDarkMode ? '255, 255, 255' : '0, 0, 0'}, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(${isDarkMode ? '255, 255, 255' : '0, 0, 0'}, ${opacity})`,
    barPercentage: 0.6,
    propsForLabels: {
      fontSize: 12,
      color: colors.text
    }
  }

  const pieChartData = useMemo(() => {
    const expensesByCategory = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, transaction) => {
        const category = transaction.category
        acc[category] = (acc[category] || 0) + transaction.amount
        return acc
      }, {} as Record<string, number>)

    return Object.entries(expensesByCategory).map(([categoryId, amount]) => {
      const category = EXPENSE_CATEGORIES.find(c => c.id === categoryId)
      return {
        name: category ? t(category.nameKey) : t('categories.others'),
        amount,
        color: category?.color || '#D4D4D4',
        legendFontColor: '#7F7F7F',
        legendFontSize: 12
      }
    })
  }, [filteredTransactions, t])

  const handleDeleteTransaction = (transactionId: string) => {
    Alert.alert(
      t('common.confirmDelete'),
      t('screens.statistics.deleteTransactionConfirm'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel'
        },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => deleteTransaction(transactionId)
        }
      ]
    )
  }

  const handleDelete = useCallback((transaction: Transaction) => {
    deleteTransaction(transaction.id);
  }, [deleteTransaction]);

  const handleLongPress = useCallback((transaction: Transaction) => {
    Alert.alert(
      t('common.confirmDelete'),
      t('screens.statistics.deleteTransactionConfirm'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel'
        },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => handleDelete(transaction)
        }
      ]
    );
  }, [t, handleDelete]);

  const renderTransaction = useCallback((transaction: Transaction) => {
    return (
      <Text style={styles.secondaryText} className="text-sm">
        {transaction.note === '_NO_NOTE_' ? t('common.noNote') : transaction.note}
      </Text>
    );
  }, [t]);

  return (
    <SafeAreaView style={[styles.container]}>
      <View style={[{ backgroundColor: colors.surface }, styles.border]} className="p-4 flex-row justify-between items-center">
        <Text style={styles.text} className="text-xl font-bold">
          {t('screens.statistics.title')}
        </Text>
        <TouchableOpacity 
          style={[{ backgroundColor: colors.background }]}
          className="flex-row items-center px-4 py-2 rounded-full"
          onPress={() => setShowFilterModal(true)}
        >
          <Text style={styles.text} className="mr-2">{getFilterLabel()}</Text>
          <FontAwesome name="chevron-down" size={12} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 p-4">
        <SpendingAlerts 
          alerts={alerts}
          onDismiss={handleDismissAlert}
        />

        <View className="flex-row justify-between mb-4">
          <View style={[styles.card]} className="p-4 rounded-xl w-[48%]">
            <Text style={styles.secondaryText}>
              {t('screens.home.income')}
            </Text>
            <Text style={{ color: colors.success }} className="font-bold text-lg">
              {formatCurrency(totalIncome, settings.currency)}
            </Text>
          </View>
          
          <View style={[styles.card]} className="p-4 rounded-xl w-[48%]">
            <Text style={styles.secondaryText}>
              {t('screens.home.expense')}
            </Text>
            <Text style={{ color: colors.error }} className="font-bold text-lg">
              {formatCurrency(totalExpense, settings.currency)}
            </Text>
          </View>
        </View>

        <View style={[styles.card]} className="rounded-xl p-4 mb-4">
          <Text style={styles.text} className="font-bold text-lg mb-4">
            {t('screens.statistics.compare.title')}
          </Text>
          <BarChart
            data={chartData}
            width={Dimensions.get('window').width - 32}
            height={220}
            chartConfig={chartConfig}
            verticalLabelRotation={0}
            showValuesOnTopOfBars
            fromZero
            yAxisLabel=""
            yAxisSuffix=""
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
          <View className="flex-row justify-between mt-4">
            <View>
              <Text className="font-medium text-gray-800 mb-2">{getCompareLabel()[0]}</Text>
              <View className="bg-gray-50 p-2 rounded-lg">
                <Text className="text-green-500">
                  {t('screens.home.income')}: {formatCurrency(compareData.current.income, settings.currency)}
                </Text>
                <Text className="text-red-500">
                  {t('screens.home.expense')}: {formatCurrency(compareData.current.expense, settings.currency)}
                </Text>
                <Text className="font-medium mt-1">
                  {t('screens.statistics.balance')}: {formatCurrency(compareData.current.income - compareData.current.expense, settings.currency)}
                </Text>
              </View>
            </View>
            <View>
              <Text className="font-medium text-gray-800 mb-2">{getCompareLabel()[1]}</Text>
              <View className="bg-gray-50 p-2 rounded-lg">
                <Text className="text-green-500">
                  {t('screens.home.income')}: {formatCurrency(compareData.previous.income, settings.currency)}
                </Text>
                <Text className="text-red-500">
                  {t('screens.home.expense')}: {formatCurrency(compareData.previous.expense, settings.currency)}
                </Text>
                <Text className="font-medium mt-1">
                  {t('screens.statistics.balance')}: {formatCurrency(compareData.previous.income - compareData.previous.expense, settings.currency)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.card]} className="rounded-xl p-4 mb-4">
          <Text style={styles.text} className="font-bold text-lg mb-4">
            {t('screens.statistics.expenseDistribution')}
          </Text>
          {pieChartData.length > 0 ? (
            <PieChart
              data={pieChartData}
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

        <View style={[styles.card]} className="rounded-xl p-4 mb-4">
          <Text style={styles.text} className="font-bold text-lg mb-4">
            {t('screens.statistics.transactionDetails')}
          </Text>
          {filteredTransactions.length === 0 ? (
            <View className="py-8 items-center">
              <FontAwesome name="inbox" size={48} color={colors.secondaryText} />
              <Text style={styles.secondaryText} className="mt-4 text-center">
                {t('screens.statistics.noTransactions')}
              </Text>
            </View>
          ) : (
            filteredTransactions.map(transaction => {
              const category = EXPENSE_CATEGORIES.find(c => c.id === transaction.category)
              
              return (
                <TouchableOpacity 
                  key={transaction.id} 
                  style={[styles.border]}
                  className="flex-row justify-between items-center py-4 border-b"
                  onLongPress={() => handleLongPress(transaction)}
                >
                  <View className="flex-row items-center">
                    {transaction.type === 'expense' && category && (
                      <View 
                        style={{ backgroundColor: category.color }} 
                        className="w-10 h-10 rounded-full items-center justify-center mr-3"
                      >
                        <FontAwesome name={category.icon} size={18} color="white" />
                      </View>
                    )}
                    {transaction.type === 'income' && (
                      <View 
                        style={{ backgroundColor: colors.success }} 
                        className="w-10 h-10 rounded-full items-center justify-center mr-3"
                      >
                        <FontAwesome name="money" size={18} color="white" />
                      </View>
                    )}
                    
                    <View className="flex-1">
                      <View className="flex-row items-center">
                        <Text style={styles.text} className="font-medium flex-1">
                          {transaction.type === 'expense' 
                            ? t(category?.nameKey || 'categories.others')
                            : t('screens.statistics.income')
                          }
                        </Text>
                        <Text style={[
                          transaction.type === 'income' 
                            ? { color: colors.success }
                            : { color: colors.error },
                          { fontSize: 16, fontWeight: 'bold' }
                        ]}>
                          {transaction.type === 'income' ? '+' : '-'}
                          {formatCurrency(convertAmount(transaction.amount, 'VND', settings.currency), settings.currency)}
                        </Text>
                      </View>
                      
                      <View className="flex-row justify-between mt-1">
                        <Text style={styles.secondaryText} className="text-sm">
                          {renderTransaction(transaction)}
                        </Text>
                        <Text style={styles.secondaryText} className="text-sm">
                          {new Date(transaction.date).toLocaleDateString(
                            currentLanguage === 'en' ? 'en-US' : 
                            currentLanguage === 'zh' ? 'zh-CN' :
                            currentLanguage === 'ko' ? 'ko-KR' : 'vi-VN',
                            { 
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            }
                          )}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              )
            })
          )}
        </View>
      </ScrollView>

      <Modal
        visible={showFilterModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <TouchableOpacity 
          className="flex-1 bg-black/50"
          activeOpacity={1}
          onPress={() => setShowFilterModal(false)}
        >
          <View className="bg-white rounded-t-3xl absolute bottom-0 w-full">
            <View className="w-16 h-1 bg-gray-300 rounded-full mx-auto my-3" />
            {(['day', 'week', 'month', 'year'] as FilterPeriod[]).map((period) => (
              <TouchableOpacity
                key={period}
                className="p-4 border-b border-gray-100"
                onPress={() => {
                  setFilterPeriod(period)
                  setShowFilterModal(false)
                }}
              >
                <Text className={`text-center text-lg ${
                  filterPeriod === period ? 'text-blue-500 font-bold' : 'text-gray-600'
                }`}>
                  {getFilterLabel(period)}
                </Text>
              </TouchableOpacity>
            ))}
            <View className="h-8" />
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  )
}