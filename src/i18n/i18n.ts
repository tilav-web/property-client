import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";
import type { ILanguage } from "@/interfaces/language/language.interface";

const DEFAULT_LANGUAGE: ILanguage = "uz";
const FALLBACK_LANGUAGE: ILanguage = "en";

const translationLoaders: Record<ILanguage, () => Promise<{ default: object }>> =
  {
    en: () => import("./en.json"),
    ru: () => import("./ru.json"),
    uz: () => import("./uz.json"),
  };

const i18n = createInstance();

function getInitialLanguage(): ILanguage {
  if (typeof window === "undefined") {
    return DEFAULT_LANGUAGE;
  }

  const storedLanguage = window.localStorage.getItem("language");

  if (storedLanguage === "uz" || storedLanguage === "ru" || storedLanguage === "en") {
    return storedLanguage;
  }

  return DEFAULT_LANGUAGE;
}

async function loadLanguageResources(language: ILanguage) {
  const resources = await translationLoaders[language]();

  return resources.default;
}

export async function ensureLanguageResources(language: ILanguage) {
  if (i18n.hasResourceBundle(language, "translation")) {
    return;
  }

  const resources = await loadLanguageResources(language);

  i18n.addResourceBundle(language, "translation", resources, true, true);
}

const initialLanguage = getInitialLanguage();
const initialResources = {
  [initialLanguage]: {
    translation: await loadLanguageResources(initialLanguage),
  },
};

if (initialLanguage !== FALLBACK_LANGUAGE) {
  initialResources[FALLBACK_LANGUAGE] = {
    translation: await loadLanguageResources(FALLBACK_LANGUAGE),
  };
}

await i18n.use(initReactI18next).init({
  lng: initialLanguage,
  fallbackLng: FALLBACK_LANGUAGE,
  supportedLngs: ["uz", "ru", "en"],
  ns: ["translation"],
  defaultNS: "translation",
  resources: initialResources,
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

export default i18n;
