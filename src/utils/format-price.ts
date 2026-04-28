import {
  CURRENCIES,
  CurrencyCode,
  DEFAULT_CURRENCY,
  type CurrencyMeta,
} from "@/constants/currencies";

export function getCurrencyMeta(
  code: string | undefined | null
): CurrencyMeta {
  if (!code) return CURRENCIES[DEFAULT_CURRENCY];
  const upper = code.toUpperCase() as CurrencyCode;
  return CURRENCIES[upper] ?? CURRENCIES[DEFAULT_CURRENCY];
}

export function isSupportedCurrency(
  code: string | undefined | null
): code is CurrencyCode {
  if (!code) return false;
  return (Object.values(CurrencyCode) as string[]).includes(code.toUpperCase());
}

export function getCurrencySymbol(code: string | undefined | null): string {
  return getCurrencyMeta(code).symbol;
}

export function formatPrice(
  amount: number | null | undefined,
  code: string | undefined | null,
  opts: { locale?: string; withSymbol?: boolean } = {}
): string {
  if (amount === null || amount === undefined || Number.isNaN(amount)) return "";
  const meta = getCurrencyMeta(code);
  const locale = opts.locale ?? meta.locale;
  const withSymbol = opts.withSymbol ?? true;

  if (withSymbol) {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: meta.code,
      minimumFractionDigits: meta.decimals,
      maximumFractionDigits: meta.decimals,
    }).format(amount);
  }

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: meta.decimals,
    maximumFractionDigits: meta.decimals,
  }).format(amount);
}

/**
 * Konvertatsiya: barcha kurslar `base` ga nisbatan saqlangan deb qabul qilamiz
 * (1 base = X). amount * (rates[to] / rates[from]).
 *
 * Kurslar yetarli emas yoki noto'g'ri bo'lsa, asl summani qaytaradi.
 */
export function convertPrice(
  amount: number,
  from: string | undefined | null,
  to: string | undefined | null,
  rates: Partial<Record<string, number>> | null | undefined
): number {
  if (!rates || !from || !to) return amount;
  const fromKey = from.toUpperCase();
  const toKey = to.toUpperCase();
  if (fromKey === toKey) return amount;

  const fromRate = rates[fromKey];
  const toRate = rates[toKey];
  if (
    typeof fromRate !== "number" ||
    typeof toRate !== "number" ||
    fromRate <= 0 ||
    toRate <= 0
  ) {
    return amount;
  }

  return amount * (toRate / fromRate);
}
