import React, { useState } from 'react';
import { View, Switch, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Text } from 'react-native-paper';
import { useSettings } from '../../hooks/useSetting';
import { FontAwesome } from '@expo/vector-icons';
import { createThemedStyles, darkColors, lightColors } from '../../theme';
import { CURRENCY_CONFIG } from '../../utils/currency';
import { LANGUAGE_CONFIG } from '../../utils/language';
import { useTranslation } from '../../contexts/LanguageContext';

const currencies = Object.keys(CURRENCY_CONFIG);

export default function Setting() {
    const {
        settings,
        isDarkMode,
        toggleDarkMode,
        setCurrency,
        setLanguage
    } = useSettings();
    const { t, setLanguage: setAppLanguage } = useTranslation();
    const styles = createThemedStyles(isDarkMode);
    const colors = isDarkMode ? darkColors : lightColors;
    const [showCurrencyModal, setShowCurrencyModal] = useState(false);
    const [showLanguageModal, setShowLanguageModal] = useState(false);

    const renderCurrencyOption = (currency: string, index: number) => (
        <TouchableOpacity
            key={currency}
            style={[
                styles.border,
                { borderBottomWidth: index === Object.keys(CURRENCY_CONFIG).length - 1 ? 0 : 1 }
            ]}
            className="py-4 px-6 active:bg-gray-100"
            onPress={async () => {
                await setCurrency(currency);
                setShowCurrencyModal(false);
            }}
        >
            <View className="flex-row items-center justify-between relative">
                <View className="flex-row items-center flex-1">
                    <Text
                        style={[
                            styles.text,
                            { fontSize: 17 },
                            currency === settings.currency && { color: colors.primary }
                        ]}
                        className="min-w-[50]"
                    >
                        {currency}
                    </Text>
                    <Text style={[styles.secondaryText, { fontSize: 15 }]} className="ml-3 flex-1">
                        {CURRENCY_CONFIG[currency].name}
                    </Text>
                </View>

                <View className="flex-row items-center">
                    <Text style={[styles.secondaryText, { fontSize: 15 }]} className="mr-4">
                        {CURRENCY_CONFIG[currency].symbol}
                    </Text>
                    {currency === settings.currency && (
                        <FontAwesome name="check" size={18} color={colors.primary} />
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderLanguageOption = (languageCode: string, index: number) => {
        const language = LANGUAGE_CONFIG[languageCode];
        return (
            <TouchableOpacity
                key={languageCode}
                style={[
                    styles.border,
                    { borderBottomWidth: index === Object.keys(LANGUAGE_CONFIG).length - 1 ? 0 : 1 }
                ]}
                className="py-4 px-6 active:bg-gray-100"
                onPress={async () => {
                    await setLanguage(languageCode);
                    setAppLanguage(languageCode);
                    setShowLanguageModal(false);
                }}
            >
                <View className="flex-row items-center justify-between relative">
                    <View className="flex-row items-center flex-1">
                        <Text className="text-2xl mr-3">{language.flag}</Text>
                        <View>
                            <Text
                                style={[
                                    styles.text,
                                    { fontSize: 17 },
                                    languageCode === settings.language && { color: colors.primary }
                                ]}
                            >
                                {language.nativeName}
                            </Text>
                            <Text style={[styles.secondaryText, { fontSize: 13 }]}>
                                {language.name}
                            </Text>
                        </View>
                    </View>

                    {languageCode === settings.language && (
                        <FontAwesome name="check" size={18} color={colors.primary} />
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    const renderCurrencyModal = () => (
        <Modal
            visible={showCurrencyModal}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowCurrencyModal(false)}
            statusBarTranslucent
        >
            <TouchableOpacity
                className="flex-1 justify-end"
                style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                activeOpacity={1}
                onPress={() => setShowCurrencyModal(false)}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={(e) => e.stopPropagation()}
                >
                    <View
                        style={[styles.card]}
                        className="w-full rounded-t-3xl overflow-hidden"
                    >
                        {/* Modal Header */}
                        <View className="pt-6 pb-4 px-6">
                            <View style={{ backgroundColor: colors.border }} className="w-12 h-1 rounded-full mx-auto mb-6" />
                            <Text
                                style={[styles.text, { fontSize: 20 }]}
                                className="font-semibold text-center"
                            >
                                {t('selectCurrency')}
                            </Text>
                        </View>

                        {/* Currency List with ScrollView */}
                        <ScrollView
                            className="max-h-[70vh]"
                            showsVerticalScrollIndicator={false}
                        >
                            <View className="mb-6">
                                {Object.keys(CURRENCY_CONFIG).map((currency, index) =>
                                    renderCurrencyOption(
                                        currency,
                                        index === Object.keys(CURRENCY_CONFIG).length - 1
                                    )
                                )}
                            </View>
                        </ScrollView>
                    </View>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );

    const renderLanguageModal = () => (
        <Modal
            visible={showLanguageModal}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowLanguageModal(false)}
            statusBarTranslucent
        >
            <TouchableOpacity
                className="flex-1 justify-end"
                style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                activeOpacity={1}
                onPress={() => setShowLanguageModal(false)}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={(e) => e.stopPropagation()}
                >
                    <View
                        style={[styles.card]}
                        className="w-full rounded-t-3xl overflow-hidden"
                    >
                        <View className="pt-6 pb-4 px-6">
                            <View style={{ backgroundColor: colors.border }} className="w-12 h-1 rounded-full mx-auto mb-6" />
                            <Text
                                style={[styles.text, { fontSize: 20 }]}
                                className="font-semibold text-center"
                            >
                                {t('selectLanguage')}
                            </Text>
                        </View>

                        <ScrollView className="max-h-[70vh]" showsVerticalScrollIndicator={false}>
                            <View className="mb-6">
                                {Object.keys(LANGUAGE_CONFIG).map((code, index) =>
                                    renderLanguageOption(code, index)
                                )}
                            </View>
                        </ScrollView>
                    </View>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );

    return (
        <ScrollView style={styles.container} className="pt-14">
            <View className="px-6 py-4">
                {/* Header */}
                <Text style={styles.text} className="text-3xl font-bold mb-8">
                    {t('settings.title')}
                </Text>

                {/* Settings Group */}
                <View style={[styles.card]} className="mb-8">
                    {/* Dark Mode Toggle */}
                    <TouchableOpacity
                        className="flex-row items-center justify-between p-5 border-b"
                        style={styles.border}
                        onPress={toggleDarkMode}
                    >
                        <View className="flex-row items-center">
                            <View style={[styles.iconBackground]} className="w-12 h-12 rounded-full items-center justify-center mr-4">
                                <FontAwesome name="moon-o" size={24} color={colors.text} />
                            </View>
                            <View>
                                <Text style={styles.text} className="text-lg font-semibold mb-1">
                                    {t('settings.darkMode')}
                                </Text>
                                <Text style={styles.secondaryText}>
                                    {isDarkMode ? t('settings.on') : t('settings.off')}
                                </Text>
                            </View>
                        </View>
                        <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
                    </TouchableOpacity>

                    {/* Currency Selector */}
                    <TouchableOpacity
                        className="flex-row items-center justify-between p-5 border-b"
                        style={styles.border}
                        onPress={() => setShowCurrencyModal(true)}
                    >
                        <View className="flex-row items-center">
                            <View style={[styles.iconBackground]} className="w-12 h-12 rounded-full items-center justify-center mr-4">
                                <FontAwesome name="money" size={24} color={colors.text} />
                            </View>
                            <View>
                                <Text style={styles.text} className="text-lg font-semibold mb-1">
                                    {t('settings.currency')}
                                </Text>
                                <Text style={styles.secondaryText}>
                                    {settings.currency} - {CURRENCY_CONFIG[settings.currency].symbol}
                                </Text>
                            </View>
                        </View>
                        <FontAwesome name="angle-right" size={24} color={colors.secondaryText} />
                    </TouchableOpacity>

                    {/* Language Selector */}
                    <TouchableOpacity
                        className="flex-row items-center justify-between p-5"
                        onPress={() => setShowLanguageModal(true)}
                    >
                        <View className="flex-row items-center">
                            <View style={[styles.iconBackground]} className="w-12 h-12 rounded-full items-center justify-center mr-4">
                                <FontAwesome name="language" size={24} color={colors.text} />
                            </View>
                            <View>
                                <Text style={styles.text} className="text-lg font-semibold mb-1">
                                    {t('settings.language')}
                                </Text>
                                <Text style={styles.secondaryText}>
                                    {LANGUAGE_CONFIG[settings.language].flag} {LANGUAGE_CONFIG[settings.language].nativeName}
                                </Text>
                            </View>
                        </View>
                        <FontAwesome name="angle-right" size={24} color={colors.secondaryText} />
                    </TouchableOpacity>
                </View>

                {/* Reference */}
                <Text style={styles.secondaryText} className="text-sm mb-4 uppercase">
                    {t('settings.reference')}
                </Text>
                <View style={[styles.card]} className="mb-8">
                    {/* About */}
                    <TouchableOpacity className="p-5 flex-row items-center justify-between border-b" style={styles.border}>
                        <View className="flex-row items-center">
                            <View style={[styles.iconBackground]} className="w-12 h-12 rounded-full items-center justify-center mr-4">
                                <FontAwesome name="info" size={24} color={colors.text} />
                            </View>
                            <View>
                                <Text style={styles.text} className="text-lg font-semibold mb-1">
                                    {t('settings.about.title')}
                                </Text>
                                <Text style={styles.secondaryText} className="text-base">
                                    {t('settings.about.description')}
                                </Text>
                            </View>
                        </View>
                        <FontAwesome name="angle-right" size={24} color={colors.secondaryText} />
                    </TouchableOpacity>

                    {/* Help */}
                    <TouchableOpacity className="p-5 flex-row items-center justify-between">
                        <View className="flex-row items-center">
                            <View style={[styles.iconBackground]} className="w-12 h-12 rounded-full items-center justify-center mr-4">
                                <FontAwesome name="question" size={24} color={colors.text} />
                            </View>
                            <View>
                                <Text style={styles.text} className="text-lg font-semibold mb-1">
                                    {t('settings.help.title')}
                                </Text>
                                <Text style={styles.secondaryText} className="text-base">
                                    {t('settings.help.description')}
                                </Text>
                            </View>
                        </View>
                        <FontAwesome name="angle-right" size={24} color={colors.secondaryText} />
                    </TouchableOpacity>
                </View>
                {/* Modals */}
                {renderCurrencyModal()}
                {renderLanguageModal()}
            </View>
        </ScrollView>
    );
}
