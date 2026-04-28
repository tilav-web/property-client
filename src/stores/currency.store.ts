import { create } from "zustand";
import {
  CurrencyCode,
  DEFAULT_CURRENCY,
  SUPPORTED_CURRENCIES,
} from "@/constants/currencies";
import { handleStorage } from "@/utils/handle-storage";

const STORAGE_KEY = "display_currency";

const LANG_TO_CURRENCY: Record<string, CurrencyCode> = {
  uz: CurrencyCode.UZS,
  ru: CurrencyCode.UZS,
  ms: CurrencyCode.MYR,
  en: CurrencyCode.USD,
};

const getStoredCurrency = (): CurrencyCode => {
  if (typeof window === "undefined") return DEFAULT_CURRENCY;

  const stored = handleStorage({ key: STORAGE_KEY });
  if (
    stored &&
    (SUPPORTED_CURRENCIES as string[]).includes(stored)
  ) {
    return stored as CurrencyCode;
  }

  // Til orqali avto-aniqlash
  const lang = handleStorage({ key: "language" });
  if (lang && LANG_TO_CURRENCY[lang]) {
    return LANG_TO_CURRENCY[lang];
  }
  return DEFAULT_CURRENCY;
};

interface CurrencyState {
  display: CurrencyCode;
  setDisplay: (code: CurrencyCode) => void;
}

export const useCurrencyStore = create<CurrencyState>((set) => ({
  display: getStoredCurrency(),
  setDisplay: (code) => {
    handleStorage({ key: STORAGE_KEY, value: code });
    set({ display: code });
  },
}));
