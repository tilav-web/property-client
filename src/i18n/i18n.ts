import i18n, { type BackendModule } from "i18next";
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

export async function ensureLanguageResources(language: ILanguage) {
  if (i18n.hasResourceBundle(language, "translation")) {
    return;
  }

  const resources = await translationLoaders[language]();

  i18n.addResourceBundle(
    language,
    "translation",
    resources.default,
    true,
    true
  );
}

const resourcesBackend: BackendModule = {
  type: "backend",
  init: () => {},
  read: async (language, _namespace, callback) => {
    try {
      if (language !== "uz" && language !== "ru" && language !== "en") {
        callback(null, {});
        return;
      }

      const resources = await translationLoaders[language]();
      callback(null, resources.default);
    } catch (error) {
      callback(error as Error, false);
    }
  },
};

const initialLanguage = getInitialLanguage();

await ensureLanguageResources(initialLanguage);

if (initialLanguage !== FALLBACK_LANGUAGE) {
  await ensureLanguageResources(FALLBACK_LANGUAGE);
}

await i18n.use(resourcesBackend).use(initReactI18next).init({
  lng: initialLanguage,
  fallbackLng: FALLBACK_LANGUAGE,
  supportedLngs: ["uz", "ru", "en"],
  ns: ["translation"],
  defaultNS: "translation",
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

export default i18n;
