export interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  country: string;
  decimals?: number;
}

export const supportedCurrencies: Record<string, CurrencyInfo> = {
  USD: {
    code: "USD",
    name: "United States Dollar",
    symbol: "$",
    flag: "🇺🇸",
    country: "United States",
  },
  INR: {
    code: "INR",
    name: "Indian Rupee",
    symbol: "₹",
    flag: "🇮🇳",
    country: "India",
  },
  EUR: {
    code: "EUR",
    name: "Euro",
    symbol: "€",
    flag: "🇪🇺",
    country: "European Union",
  },
  GBP: {
    code: "GBP",
    name: "British Pound",
    symbol: "£",
    flag: "🇬🇧",
    country: "United Kingdom",
  },
  JPY: {
    code: "JPY",
    name: "Japanese Yen",
    symbol: "¥",
    flag: "🇯🇵",
    country: "Japan",
    decimals: 0,
  },
  CAD: {
    code: "CAD",
    name: "Canadian Dollar",
    symbol: "CA$",
    flag: "🇨🇦",
    country: "Canada",
  },
  AUD: {
    code: "AUD",
    name: "Australian Dollar",
    symbol: "AU$",
    flag: "🇦🇺",
    country: "Australia",
  },
  CHF: {
    code: "CHF",
    name: "Swiss Franc",
    symbol: "CHF",
    flag: "🇨🇭",
    country: "Switzerland",
  },
  CNY: {
    code: "CNY",
    name: "Chinese Yuan",
    symbol: "¥",
    flag: "🇨🇳",
    country: "China",
  },
  SGD: {
    code: "SGD",
    name: "Singapore Dollar",
    symbol: "SG$",
    flag: "🇸🇬",
    country: "Singapore",
  },
  NZD: {
    code: "NZD",
    name: "New Zealand Dollar",
    symbol: "NZ$",
    flag: "🇳🇿",
    country: "New Zealand",
  },
  HKD: {
    code: "HKD",
    name: "Hong Kong Dollar",
    symbol: "HK$",
    flag: "🇭🇰",
    country: "Hong Kong",
  },
  KRW: {
    code: "KRW",
    name: "South Korean Won",
    symbol: "₩",
    flag: "🇰🇷",
    country: "South Korea",
    decimals: 0,
  },
  MXN: {
    code: "MXN",
    name: "Mexican Peso",
    symbol: "Mex$",
    flag: "🇲🇽",
    country: "Mexico",
  },
  BRL: {
    code: "BRL",
    name: "Brazilian Real",
    symbol: "R$",
    flag: "🇧🇷",
    country: "Brazil",
  },
  ZAR: {
    code: "ZAR",
    name: "South African Rand",
    symbol: "R",
    flag: "🇿🇦",
    country: "South Africa",
  },
  SEK: {
    code: "SEK",
    name: "Swedish Krona",
    symbol: "kr",
    flag: "🇸🇪",
    country: "Sweden",
  },
  NOK: {
    code: "NOK",
    name: "Norwegian Krone",
    symbol: "kr",
    flag: "🇳🇴",
    country: "Norway",
  },
  DKK: {
    code: "DKK",
    name: "Danish Krone",
    symbol: "kr.",
    flag: "🇩🇰",
    country: "Denmark",
  },
  PLN: {
    code: "PLN",
    name: "Polish Zloty",
    symbol: "zł",
    flag: "🇵🇱",
    country: "Poland",
  },
  THB: {
    code: "THB",
    name: "Thai Baht",
    symbol: "฿",
    flag: "🇹🇭",
    country: "Thailand",
  },
  IDR: {
    code: "IDR",
    name: "Indonesian Rupiah",
    symbol: "Rp",
    flag: "🇮🇩",
    country: "Indonesia",
    decimals: 0,
  },
  MYR: {
    code: "MYR",
    name: "Malaysian Ringgit",
    symbol: "RM",
    flag: "🇲🇾",
    country: "Malaysia",
  },
  PHP: {
    code: "PHP",
    name: "Philippine Peso",
    symbol: "₱",
    flag: "🇵🇭",
    country: "Philippines",
  },
  CZK: {
    code: "CZK",
    name: "Czech Koruna",
    symbol: "Kč",
    flag: "🇨🇿",
    country: "Czech Republic",
  },
  HUF: {
    code: "HUF",
    name: "Hungarian Forint",
    symbol: "Ft",
    flag: "🇭🇺",
    country: "Hungary",
    decimals: 0,
  },
  ILS: {
    code: "ILS",
    name: "Israeli Shekel",
    symbol: "₪",
    flag: "🇮🇱",
    country: "Israel",
  },
  TRY: {
    code: "TRY",
    name: "Turkish Lira",
    symbol: "₺",
    flag: "🇹🇷",
    country: "Turkey",
  },
  RON: {
    code: "RON",
    name: "Romanian Leu",
    symbol: "lei",
    flag: "🇷🇴",
    country: "Romania",
  },
  ISK: {
    code: "ISK",
    name: "Icelandic Krona",
    symbol: "kr",
    flag: "🇮🇸",
    country: "Iceland",
    decimals: 0,
  },
};

export const currencyList: CurrencyInfo[] = Object.values(supportedCurrencies);

export interface PopularPair {
  from: string;
  to: string;
  label: string;
}

export const popularPairs: PopularPair[] = [
  { from: "USD", to: "INR", label: "USD to INR" },
  { from: "EUR", to: "USD", label: "EUR to USD" },
  { from: "GBP", to: "USD", label: "GBP to USD" },
  { from: "USD", to: "EUR", label: "USD to EUR" },
  { from: "USD", to: "CAD", label: "USD to CAD" },
  { from: "USD", to: "JPY", label: "USD to JPY" },
  { from: "AUD", to: "USD", label: "AUD to USD" },
  { from: "USD", to: "GBP", label: "USD to GBP" },
];

export const quickAmountChips = [10, 50, 100, 500, 1000, 5000];

// Reliable fallback rates relative to USD (updated benchmark)
export const fallbackUsdRates: Record<string, number> = {
  USD: 1,
  INR: 96.33,
  EUR: 0.8908,
  GBP: 0.7575,
  JPY: 154.2,
  CAD: 1.424,
  AUD: 1.4411,
  CHF: 0.8266,
  CNY: 6.7046,
  SGD: 1.298,
  NZD: 1.582,
  HKD: 7.847,
  KRW: 1378.0,
  MXN: 18.25,
  BRL: 5.221,
  ZAR: 17.65,
  SEK: 10.12,
  NOK: 10.45,
  DKK: 6.658,
  PLN: 3.82,
  THB: 34.6,
  IDR: 15600,
  MYR: 4.38,
  PHP: 56.4,
  CZK: 21.8,
  HUF: 328.89,
  ILS: 3.72,
  TRY: 34.2,
  RON: 4.43,
  ISK: 138.5,
};

export function getCurrencyInfo(code: string): CurrencyInfo {
  return (
    supportedCurrencies[code.toUpperCase()] || {
      code: code.toUpperCase(),
      name: code.toUpperCase(),
      symbol: code.toUpperCase(),
      flag: "🌐",
      country: "Global",
    }
  );
}

export function formatCurrencyValue(
  value: number,
  currencyCode: string,
  compact = false
): string {
  const info = getCurrencyInfo(currencyCode);
  const maxDecimals = info.decimals !== undefined ? info.decimals : 2;

  if (compact && value >= 1000000) {
    return `${info.symbol}${(value / 1000000).toFixed(2)}M`;
  }
  if (compact && value >= 1000) {
    return `${info.symbol}${(value / 1000).toFixed(1)}k`;
  }

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: maxDecimals,
    maximumFractionDigits: maxDecimals,
  }).format(value);
}
