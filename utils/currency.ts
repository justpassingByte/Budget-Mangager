interface CurrencyConfig {
  symbol: string;
  position: 'before' | 'after';
  space: boolean;
  rate: number; // Tỉ giá so với VND
  name: string; // Tên đầy đủ của tiền tệ
}

export const CURRENCY_CONFIG: Record<string, CurrencyConfig> = {
  VND: {
    symbol: '₫',
    position: 'after',
    space: true,
    rate: 1,
    name: 'Việt Nam Đồng'
  },
  USD: {
    symbol: '$',
    position: 'before',
    space: false,
    rate: 1/24500,
    name: 'US Dollar'
  },
  EUR: {
    symbol: '€',
    position: 'after',
    space: true,
    rate: 1/26500,
    name: 'Euro'
  },
  JPY: {
    symbol: '¥',
    position: 'before',
    space: false,
    rate: 1/164,
    name: 'Japanese Yen'
  },
  GBP: {
    symbol: '£',
    position: 'before',
    space: false,
    rate: 1/31000,
    name: 'British Pound'
  },
  AUD: {
    symbol: 'A$',
    position: 'before',
    space: false,
    rate: 1/16000,
    name: 'Australian Dollar'
  },
  CAD: {
    symbol: 'C$',
    position: 'before',
    space: false,
    rate: 1/18000,
    name: 'Canadian Dollar'
  },
  SGD: {
    symbol: 'S$',
    position: 'before',
    space: false,
    rate: 1/18200,
    name: 'Singapore Dollar'
  },
  NZD: {
    symbol: 'NZ$',
    position: 'before',
    space: false,
    rate: 1/14800,
    name: 'New Zealand Dollar'
  },
  CNY: {
    symbol: '¥',
    position: 'before',
    space: false,
    rate: 1/3400,
    name: 'Chinese Yuan'
  },
  HKD: {
    symbol: 'HK$',
    position: 'before',
    space: false,
    rate: 1/3100,
    name: 'Hong Kong Dollar'
  },
  KRW: {
    symbol: '₩',
    position: 'before',
    space: false,
    rate: 1/18.5,
    name: 'Korean Won'
  },
  INR: {
    symbol: '₹',
    position: 'before',
    space: false,
    rate: 1/294,
    name: 'Indian Rupee'
  },
  THB: {
    symbol: '฿',
    position: 'before',
    space: false,
    rate: 1/690,
    name: 'Thai Baht'
  },
  IDR: {
    symbol: 'Rp',
    position: 'before',
    space: false,
    rate: 1/1.6,
    name: 'Indonesian Rupiah'
  },
  MYR: {
    symbol: 'RM',
    position: 'before',
    space: false,
    rate: 1/5200,
    name: 'Malaysian Ringgit'
  },
  PHP: {
    symbol: '₱',
    position: 'before',
    space: false,
    rate: 1/440,
    name: 'Philippine Peso'
  },
  TWD: {
    symbol: 'NT$',
    position: 'before',
    space: false,
    rate: 1/770,
    name: 'Taiwan Dollar'
  },
  CHF: {
    symbol: 'Fr',
    position: 'after',
    space: true,
    rate: 1/27500,
    name: 'Swiss Franc'
  },
  SEK: {
    symbol: 'kr',
    position: 'after',
    space: true,
    rate: 1/2300,
    name: 'Swedish Krona'
  }

};

export function convertCurrency(amount: number, fromCurrency: string, toCurrency: string): number {
  // Nếu cùng loại tiền tệ thì không cần chuyển đổi
  if (fromCurrency === toCurrency) return amount;

  const fromConfig = CURRENCY_CONFIG[fromCurrency];
  const toConfig = CURRENCY_CONFIG[toCurrency];

  if (!fromConfig || !toConfig) {
    console.error('Currency not found:', { fromCurrency, toCurrency });
    return amount;
  }

  // Chuyển đổi về VND trước
  const amountInVND = amount * (1 / fromConfig.rate);
  
  // Sau đó chuyển từ VND sang tiền tệ đích
  return amountInVND * toConfig.rate;
}

export function formatCurrency(amount: number, currency: string): string {
  const config = CURRENCY_CONFIG[currency];
  if (!config) {
    console.error('Currency not found:', currency);
    return amount.toLocaleString('vi-VN') + ' ₫';
  }

  // Format số theo locale phù hợp
  const locale = {
    VND: 'vi-VN',
    USD: 'en-US',
    EUR: 'de-DE',
    JPY: 'ja-JP',
    GBP: 'en-GB',
    // Thêm các locale khác nếu cần
  }[currency] || 'vi-VN';

  // Làm tròn số và format
  const roundedAmount = Math.round(amount * 100) / 100;
  const formattedAmount = roundedAmount.toLocaleString(locale, {
    minimumFractionDigits: currency === 'VND' ? 0 : 2,
    maximumFractionDigits: currency === 'VND' ? 0 : 2,
  });

  // Thêm ký hiệu tiền tệ theo vị trí
  if (config.position === 'before') {
    return `${config.symbol}${config.space ? ' ' : ''}${formattedAmount}`;
  }
  return `${formattedAmount}${config.space ? ' ' : ''}${config.symbol}`;
} 