import { CurrencyCode } from "./currencies";

export type CountryCode = "UZ" | "MY";
export type LanguageCode = "uz" | "ru" | "en" | "ms";

interface CountryDefaults {
  currency: CurrencyCode;
  language: LanguageCode;
  supportedLanguages: LanguageCode[];
  mapCenter: [number, number];
  mapZoom: number;
  phoneCountryCode: string;
  brandName: string;
}

const SUPPORTED_LANGUAGE_CODES: ReadonlyArray<LanguageCode> = [
  "uz",
  "ru",
  "en",
  "ms",
];

const COUNTRY_DEFAULTS: Record<CountryCode, CountryDefaults> = {
  UZ: {
    currency: "UZS",
    language: "uz",
    supportedLanguages: ["uz", "ru", "en"],
    mapCenter: [41.2995, 69.2401], // Toshkent
    mapZoom: 12,
    phoneCountryCode: "+998",
    // UZ deploy uybos.uz brendi bilan ishlaydi
    brandName: "Uybos",
  },
  MY: {
    currency: "MYR",
    language: "en",
    supportedLanguages: ["en", "ms"],
    mapCenter: [3.139, 101.6869], // Kuala Lumpur
    mapZoom: 12,
    phoneCountryCode: "+60",
    brandName: "Amaar Properties",
  },
};

function readEnv(key: string): string | undefined {
  const value = import.meta.env?.[key];
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function resolveCountry(): CountryCode {
  const raw = readEnv("VITE_COUNTRY")?.toUpperCase();
  if (raw === "UZ" || raw === "MY") return raw;
  // Default — Malaysia (asosiy bozor). Aniq UZ deploy uchun
  // .env'da VITE_COUNTRY=UZ majburiy.
  return "MY";
}

function resolveCurrency(fallback: CurrencyCode): CurrencyCode {
  const raw = readEnv("VITE_DEFAULT_CURRENCY")?.toUpperCase();
  const valid: CurrencyCode[] = ["UZS", "MYR", "USD", "IDR", "SGD", "THB"];
  if (raw && (valid as string[]).includes(raw)) return raw as CurrencyCode;
  return fallback;
}

function resolveLanguage(fallback: LanguageCode): LanguageCode {
  const raw = readEnv("VITE_DEFAULT_LANGUAGE")?.toLowerCase();
  if (raw && SUPPORTED_LANGUAGE_CODES.includes(raw as LanguageCode)) {
    return raw as LanguageCode;
  }
  return fallback;
}

function resolveSupportedLanguages(fallback: LanguageCode[]): LanguageCode[] {
  const raw = readEnv("VITE_SUPPORTED_LANGUAGES");
  if (!raw) return fallback;
  const parsed = raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter((s): s is LanguageCode =>
      SUPPORTED_LANGUAGE_CODES.includes(s as LanguageCode),
    );
  return parsed.length > 0 ? parsed : fallback;
}

function resolveMapCenter(fallback: [number, number]): [number, number] {
  const raw = readEnv("VITE_DEFAULT_MAP_CENTER");
  if (!raw) return fallback;
  const parts = raw.split(",").map((s) => Number(s.trim()));
  if (parts.length !== 2 || !parts.every(Number.isFinite)) return fallback;
  return [parts[0], parts[1]];
}

function resolveMapZoom(fallback: number): number {
  const raw = readEnv("VITE_DEFAULT_MAP_ZOOM");
  if (!raw) return fallback;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 && n < 22 ? n : fallback;
}

function resolvePhoneCountryCode(fallback: string): string {
  return readEnv("VITE_PHONE_COUNTRY_CODE") ?? fallback;
}

const COUNTRY: CountryCode = resolveCountry();
const defaults = COUNTRY_DEFAULTS[COUNTRY];

/**
 * Mamlakatga xos default qiymatlar. Komponentlarda hardcode o'rniga
 * shu yerdan import qiling:
 *
 *   import { COUNTRY_CONFIG } from "@/constants/country";
 *   <YandexMap center={COUNTRY_CONFIG.mapCenter} />
 */
export const COUNTRY_CONFIG = {
  country: COUNTRY,
  defaultCurrency: resolveCurrency(defaults.currency),
  defaultLanguage: resolveLanguage(defaults.language),
  supportedLanguages: resolveSupportedLanguages(defaults.supportedLanguages),
  mapCenter: resolveMapCenter(defaults.mapCenter),
  mapZoom: resolveMapZoom(defaults.mapZoom),
  phoneCountryCode: resolvePhoneCountryCode(defaults.phoneCountryCode),
  brandName: readEnv("VITE_BRAND_NAME") ?? defaults.brandName,
} as const;
