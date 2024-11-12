import { View, Text, TextInput, TouchableOpacity, Alert, Modal, SafeAreaView } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { router } from 'expo-router'
import { useState } from 'react'
import { useTransactions } from '../../hooks/useTransaction'
import { useSettings } from '../../hooks/useSetting'
import { createThemedStyles, darkColors, lightColors } from '../../theme'
import { useTranslation } from '../../contexts/LanguageContext'
import { FontAwesome } from '@expo/vector-icons'
import { EXPENSE_CATEGORIES } from '../../utils/categories'
import { CURRENCY_CONFIG } from '../../utils/currency'

export default function ExpenseScreen() {
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const { addTransaction, transactions } = useTransactions()
  const { isDarkMode, settings } = useSettings()
  const styles = createThemedStyles(isDarkMode)
  const colors = isDarkMode ? darkColors : lightColors
  const { t } = useTranslation()

  const currentBalance = transactions.reduce((total, transaction) => {
    return transaction.type === 'income' 
      ? total + transaction.amount 
      : total - transaction.amount
  }, 0)

  const handleSave = () => {
    const numAmount = Number(amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert(t('common.error'), t('common.pleaseEnterAmount'))
      return
    }

    if (!selectedCategory) {
      Alert.alert(t('common.error'), t('common.pleaseSelectCategory'))
      return
    }

    if (!note.trim()) {
      Alert.alert(t('common.error'), t('common.pleaseEnterNote'))
      return
    }

    if (currentBalance < numAmount) {
      Alert.alert(
        t('common.insufficientBalance'),
        t('common.balanceNotEnough', {
          balance: currentBalance.toLocaleString(),
          amount: numAmount.toLocaleString()
        })
      )
      return
    }

    addTransaction({
      amount: numAmount,
      type: 'expense',
      date: new Date(),
      note: note.trim(),
      category: selectedCategory
    })
    
    router.back()
  }

  const selectedCategoryData = EXPENSE_CATEGORIES.find(c => c.id === selectedCategory)

  // Thêm hàm format placeholder
  const getAmountPlaceholder = () => {
    return `${t('fields.enterAmount')} (${CURRENCY_CONFIG[settings.currency].symbol})`
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <View className="p-4">
        <View style={{ backgroundColor: colors.border }} className="w-16 h-1 rounded-full mx-auto mb-6" />
        <Text style={styles.text} className="text-2xl font-bold mb-6">{t('screens.home.expense')}</Text>
        
        <View className="space-y-4">
          <View>
            <Text style={styles.secondaryText} className="mb-1">
              {t('fields.amount')} ({CURRENCY_CONFIG[settings.currency].symbol})
            </Text>
            <TextInput
              style={[styles.border, { 
                color: colors.text, 
                backgroundColor: colors.surface,
                borderColor: colors.border 
              }]}
              className="rounded-lg p-3"
              placeholder={getAmountPlaceholder()}
              placeholderTextColor={colors.secondaryText}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
          </View>

          <View>
            <Text style={styles.secondaryText} className="mb-1">{t('fields.category')}</Text>
            <TouchableOpacity
              style={[styles.border, { 
                backgroundColor: colors.surface,
                borderColor: colors.border 
              }]}
              className="rounded-lg p-3 flex-row items-center"
              onPress={() => setShowCategoryModal(true)}
            >
              {selectedCategoryData ? (
                <>
                  <View 
                    style={{ backgroundColor: selectedCategoryData.color }} 
                    className="w-8 h-8 rounded-full items-center justify-center mr-2"
                  >
                    <FontAwesome name={selectedCategoryData.icon} size={16} color="white" />
                  </View>
                  <Text style={styles.text}>{t(`categories.${selectedCategoryData.id}`)}</Text>
                </>
              ) : (
                <Text style={styles.secondaryText}>{t('fields.selectCategory')}</Text>
              )}
            </TouchableOpacity>
          </View>

          <View>
            <Text style={styles.secondaryText} className="mb-1">{t('fields.note')}</Text>
            <TextInput
              style={[styles.border, { 
                color: colors.text, 
                backgroundColor: colors.surface,
                borderColor: colors.border 
              }]}
              className="rounded-lg p-3"
              placeholder={t('fields.addNote')}
              placeholderTextColor={colors.secondaryText}
              value={note}
              onChangeText={setNote}
            />
          </View>

          <TouchableOpacity 
            style={{ backgroundColor: colors.error }}
            className="p-4 rounded-lg mt-6"
            onPress={handleSave}
          >
            <Text className="text-white text-center font-bold">{t('common.save')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={showCategoryModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View style={{ backgroundColor: colors.overlay }} className="flex-1">
          <View style={{ backgroundColor: colors.background }} className="rounded-t-3xl absolute bottom-0 w-full p-4">
            <View style={{ backgroundColor: colors.border }} className="w-16 h-1 rounded-full mx-auto mb-4" />
            <Text style={styles.text} className="text-xl font-bold mb-4">{t('fields.selectCategory')}</Text>
            
            <View className="flex-row flex-wrap justify-between">
              {EXPENSE_CATEGORIES.map(category => (
                <TouchableOpacity
                  key={category.id}
                  style={{ 
                    backgroundColor: selectedCategory === category.id 
                      ? colors.primaryLight 
                      : colors.surface 
                  }}
                  className="w-[30%] p-3 rounded-xl mb-4 items-center"
                  onPress={() => {
                    setSelectedCategory(category.id)
                    setShowCategoryModal(false)
                  }}
                >
                  <View 
                    style={{ backgroundColor: category.color }} 
                    className="w-12 h-12 rounded-full items-center justify-center mb-2"
                  >
                    <FontAwesome name={category.icon} size={24} color="white" />
                  </View>
                  <Text style={styles.text} className="text-center text-sm">{t(`categories.${category.id}`)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}