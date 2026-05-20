import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";
import type { ILanguage } from "@/interfaces/language/language.interface";
import en from "./en.json";
import ru from "./ru.json";
import uz from "./uz.json";
import ms from "./ms.json";
import { COUNTRY_CONFIG } from "@/constants/country";

const FALLBACK_LANGUAGE: ILanguage = "en";
// DEFAULT_LANGUAGE COUNTRY_CONFIG'dan keladi (UZ -> uz, MY -> en)
const DEFAULT_LANGUAGE: ILanguage =
  (COUNTRY_CONFIG.defaultLanguage as ILanguage) || "en";

const SUPPORTED_LANGUAGES: ILanguage[] = ["en", "ru", "uz", "ms"];

const i18n = createInstance();
const resources = {
  en: { translation: en },
  ru: { translation: ru },
  uz: { translation: uz },
  ms: { translation: ms },
} as const;

function getInitialLanguage(): ILanguage {
  if (typeof window === "undefined") {
    return DEFAULT_LANGUAGE;
  }

  const storedLanguage = window.localStorage.getItem("language");

  if (storedLanguage && SUPPORTED_LANGUAGES.includes(storedLanguage as ILanguage)) {
    return storedLanguage as ILanguage;
  }

  return DEFAULT_LANGUAGE;
}

export async function ensureLanguageResources(language: ILanguage) {
  if (!i18n.hasResourceBundle(language, "translation")) {
    i18n.addResourceBundle(
      language,
      "translation",
      resources[language].translation,
      true,
      true,
    );
  }
}

// ============================================================================
// Country-aware postProcessor
// ----------------------------------------------------------------------------
// Tarjima fayllaridagi matnlar "Malaysia" deb yozilgan (chunki bu MY uchun
// boshlangan). UZ deploy'da `Malaysia` -> `Uzbekistan` avtomatik almashtiriladi.
// Har til uchun mos forma bilan.
//
// Ishlash printsipi: i18next har t() chaqirilganda postProcessor orqali
// natijani o'tkazadi. Bu yerda regex bilan mamlakat nomi almashtiriladi.
// ============================================================================

interface CountryNames {
  en: string;
  ru: string;
  uz: string;
  ms: string;
}

const COUNTRY_NAMES: Record<"UZ" | "MY", CountryNames> = {
  UZ: {
    en: "Uzbekistan",
    ru: "Узбекистан",
    uz: "O'zbekiston",
    ms: "Uzbekistan",
  },
  MY: {
    en: "Malaysia",
    ru: "Малайзия",
    uz: "Malayziya",
    ms: "Malaysia",
  },
};

// Matnlarda eski mamlakat nomi va alternativ shakllarni topib almashtirish
function replaceCountryNames(text: string, language: ILanguage): string {
  // MY deploy'da hech narsa o'zgartirmaymiz (matnlar allaqachon Malaysia bilan)
  if (COUNTRY_CONFIG.country === "MY") return text;

  const targetName = COUNTRY_NAMES[COUNTRY_CONFIG.country][language];

  // Til-specific almashtirish (eski "Malaysia" turlari)
  switch (language) {
    case "en":
    case "ms":
      // "Malaysia" -> "Uzbekistan", "Malaysian" -> "Uzbekistani"
      return text
        .replace(/Malaysian/g, language === "en" ? "Uzbekistani" : targetName)
        .replace(/Malaysia/g, targetName);
    case "ru":
      // Малайзия, Малайзии, Малайзию, Малайзией -> Узбекистан, Узбекистана, ...
      return text
        .replace(/Малайзи[яиюей]/g, (match) => {
          // Eng oddiy: hammasini "Узбекистан" qilib qo'yamiz
          // (grammatika ko'pchilik kontekstda tushuniladi)
          return targetName;
        });
    case "uz":
      // Malayziya, Malayziyada, Malayziya bo'ylab -> O'zbekiston, ...
      return text
        .replace(/Malayziyad?a?/g, targetName)
        .replace(/Malayziya/g, targetName)
        // "Malaysia" inglizcha qoldiqlar
        .replace(/Malaysia/g, targetName);
    default:
      return text;
  }
}

const initialLanguage = getInitialLanguage();
export const i18nReady = i18n
  .use(initReactI18next)
  .use({
    type: "postProcessor",
    name: "country",
    process(value: string, _key: string, options: Record<string, unknown>) {
      if (typeof value !== "string") return value;
      const lng = (options.lng as ILanguage) || initialLanguage;
      return replaceCountryNames(value, lng);
    },
  } as never)
  .init({
    lng: initialLanguage,
    fallbackLng: FALLBACK_LANGUAGE,
    supportedLngs: SUPPORTED_LANGUAGES,
    ns: ["translation"],
    defaultNS: "translation",
    resources,
    initImmediate: false,
    interpolation: { escapeValue: false },
    postProcess: ["country"],
    react: { useSuspense: false },
  });

export default i18n;
