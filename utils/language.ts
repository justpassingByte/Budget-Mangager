interface LanguageConfig {
  name: string;  // Tên ngôn ngữ
  nativeName: string;  // Tên trong ngôn ngữ đó
  code: string;  // Mã ngôn ngữ
  flag: string;  // Emoji cờ
}

export const LANGUAGE_CONFIG: Record<string, LanguageConfig> = {
  vi: {
    name: 'Vietnamese',
    nativeName: 'Tiếng Việt',
    code: 'vi',
    flag: '🇻🇳'
  },
  en: {
    name: 'English',
    nativeName: 'English',
    code: 'en',
    flag: '🇬🇧'
  },
  zh: {
    name: 'Chinese',
    nativeName: '中文',
    code: 'zh',
    flag: '🇨🇳'
  },
  ja: {
    name: 'Japanese',
    nativeName: '日本語',
    code: 'ja',
    flag: '🇯🇵'
  },
  ko: {
    name: 'Korean',
    nativeName: '한국어',
    code: 'ko',
    flag: '🇰🇷'
  },
  fr: {
    name: 'French',
    nativeName: 'Français',
    code: 'fr',
    flag: '🇫🇷'
  },
  de: {
    name: 'German',
    nativeName: 'Deutsch',
    code: 'de',
    flag: '🇩🇪'
  }
}; 