import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";
import type { ILanguage } from "@/interfaces/language/language.interface";
import en from "./en.json";
import ru from "./ru.json";
import uz from "./uz.json";

const DEFAULT_LANGUAGE: ILanguage = "en";
const FALLBACK_LANGUAGE: ILanguage = "en";

const i18n = createInstance();
const resources = {
  en: { translation: en },
  ru: { translation: ru },
  uz: { translation: uz },
} as const;

function getInitialLanguage(): ILanguage {
  if (typeof window === "undefined") {
    return DEFAULT_LANGUAGE;
  }

  const storedLanguage = window.localStorage.getItem("language");

  if (
    storedLanguage === "uz" ||
    storedLanguage === "ru" ||
    storedLanguage === "en"
  ) {
    return storedLanguage;
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

const initialLanguage = getInitialLanguage();
export const i18nReady = i18n.use(initReactI18next).init({
  lng: initialLanguage,
  fallbackLng: FALLBACK_LANGUAGE,
  supportedLngs: ["en", "ru", "uz"],
  ns: ["translation"],
  defaultNS: "translation",
  resources,
  initImmediate: false,
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

export default i18n;
