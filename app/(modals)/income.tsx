import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native'
import { router } from 'expo-router'
import { useState } from 'react'
import { useTransactions } from '../../hooks/useTransaction'
import { useSettings } from '../../hooks/useSetting'
import { createThemedStyles, darkColors, lightColors } from '../../theme'
import { useTranslation } from '../../contexts/LanguageContext'
import { StatusBar } from 'expo-status-bar'
import { CURRENCY_CONFIG } from '@/utils/currency'

export default function IncomeScreen() {
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const { addTransaction } = useTransactions()
  const { isDarkMode, settings } = useSettings()
  const styles = createThemedStyles(isDarkMode)
  const colors = isDarkMode ? darkColors : lightColors
  const { t } = useTranslation()

  const getAmountPlaceholder = () => {
    return `${t('screens.income.enterAmount')} (${CURRENCY_CONFIG[settings.currency].symbol})`
  }

  const handleSave = () => {
    const numAmount = Number(amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert(
        t('common.error'), 
        t('common.invalidAmount')
      )
      return
    }

    if (!note.trim()) {
      Alert.alert(
        t('common.error'), 
        t('common.pleaseEnterNote')
      )
      return
    }

    addTransaction({
      amount: Number(amount),
      type: 'income',
      date: new Date(),
      note: note.trim(),
      category: 'income'
    })
    
    router.back()
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <View className="p-4">
        <View 
          style={{ backgroundColor: colors.border }} 
          className="w-16 h-1 rounded-full mx-auto mb-6" 
        />
        <Text style={styles.text} className="text-2xl font-bold mb-6">
          {t('screens.income.title')}
        </Text>
        
        <View className="space-y-4">
          <View>
            <Text style={styles.secondaryText} className="mb-1">
              {t('screens.income.amount')} ({CURRENCY_CONFIG[settings.currency].symbol})
            </Text>
            <TextInput
              style={[styles.border, { color: colors.text, backgroundColor: colors.surface }]}
              className="rounded-lg p-3"
              placeholder={getAmountPlaceholder()}
              placeholderTextColor={colors.secondaryText}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
          </View>

          <View>
            <Text style={styles.secondaryText} className="mb-1">
              {t('screens.income.note')}
            </Text>
            <TextInput
              style={[styles.border, { color: colors.text, backgroundColor: colors.surface }]}
              className="rounded-lg p-3"
              placeholder={t('screens.income.addNote')}
              placeholderTextColor={colors.secondaryText}
              value={note}
              onChangeText={setNote}
            />
          </View>

          <TouchableOpacity 
            style={{ backgroundColor: colors.success }}
            className="p-4 rounded-lg mt-6"
            onPress={handleSave}
          >
            <Text className="text-white text-center font-bold">
              {t('screens.income.save')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}