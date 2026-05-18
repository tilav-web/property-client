export const CurrencyCode = {
  MYR: "MYR",
  UZS: "UZS",
  USD: "USD",
  IDR: "IDR",
  SGD: "SGD",
  THB: "THB",
} as const;

export type CurrencyCode = (typeof CurrencyCode)[keyof typeof CurrencyCode];

export interface CurrencyMeta {
  code: CurrencyCode;
  numericCode: number;
  symbol: string;
  name: string;
  decimals: number;
  locale: string;
  country: string;
}

export type CurrencyRateMap = Partial<Record<CurrencyCode, number>>;

export const CURRENCIES: Record<CurrencyCode, CurrencyMeta> = {
  [CurrencyCode.MYR]: {
    code: CurrencyCode.MYR,
    numericCode: 458,
    symbol: "RM",
    name: "Malaysian Ringgit",
    decimals: 2,
    locale: "ms-MY",
    country: "MY",
  },
  [CurrencyCode.UZS]: {
    code: CurrencyCode.UZS,
    numericCode: 860,
    symbol: "so'm",
    name: "Uzbekistani Som",
    decimals: 0,
    locale: "uz-UZ",
    country: "UZ",
  },
  [CurrencyCode.USD]: {
    code: CurrencyCode.USD,
    numericCode: 840,
    symbol: "$",
    name: "US Dollar",
    decimals: 2,
    locale: "en-US",
    country: "US",
  },
  [CurrencyCode.IDR]: {
    code: CurrencyCode.IDR,
    numericCode: 360,
    symbol: "Rp",
    name: "Indonesian Rupiah",
    decimals: 0,
    locale: "id-ID",
    country: "ID",
  },
  [CurrencyCode.SGD]: {
    code: CurrencyCode.SGD,
    numericCode: 702,
    symbol: "S$",
    name: "Singapore Dollar",
    decimals: 2,
    locale: "en-SG",
    country: "SG",
  },
  [CurrencyCode.THB]: {
    code: CurrencyCode.THB,
    numericCode: 764,
    symbol: "฿",
    name: "Thai Baht",
    decimals: 2,
    locale: "th-TH",
    country: "TH",
  },
};

/**
 * ENV'dan default currency'ni o'qiydi. Aniqlanmagan bo'lsa VITE_COUNTRY'ga
 * qarab tanlaydi (UZ -> UZS, MY -> MYR), hech narsa berilmasa UZS.
 *
 * Bu helper country.ts'siz ham ishlatilishi kerak (circular dependency'dan
 * saqlanish uchun). UI komponentlarda esa COUNTRY_CONFIG.defaultCurrency
 * tavsiya etiladi.
 */
function resolveDefaultCurrency(): CurrencyCode {
  const raw = (import.meta.env?.VITE_DEFAULT_CURRENCY as string | undefined)
    ?.toUpperCase();
  const valid = Object.values(CurrencyCode) as string[];
  if (raw && valid.includes(raw)) return raw as CurrencyCode;
  const country = (import.meta.env?.VITE_COUNTRY as string | undefined)
    ?.toUpperCase();
  if (country === "MY") return CurrencyCode.MYR;
  return CurrencyCode.UZS;
}

export const DEFAULT_CURRENCY: CurrencyCode = resolveDefaultCurrency();

export const SUPPORTED_CURRENCIES: CurrencyCode[] = Object.values(CurrencyCode);

export const DEFAULT_EXCHANGE_RATES: CurrencyRateMap = {
  [CurrencyCode.USD]: 1,
  [CurrencyCode.MYR]: 4.7,
  [CurrencyCode.UZS]: 12600,
  [CurrencyCode.IDR]: 16500,
  [CurrencyCode.SGD]: 1.34,
  [CurrencyCode.THB]: 36,
};
