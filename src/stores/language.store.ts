import type { ILanguage } from "@/interfaces/language/language.interface";
import { handleStorage } from "@/utils/handle-storage";
import { create } from "zustand";

interface LanguageState {
  language: ILanguage;
  setLanguage: (language: ILanguage) => void;
}

const getStoredLanguage = (): ILanguage => {
  if (typeof window === "undefined") {
    return "uz";
  }

  const storedLanguage = handleStorage({ key: "language" });

  if (storedLanguage === "uz" || storedLanguage === "ru" || storedLanguage === "en") {
    return storedLanguage;
  }

  return "uz";
};

export const useLanguageStore = create<LanguageState>((set) => ({
  language: getStoredLanguage(),
  setLanguage: (language: ILanguage) =>
    set((state) => {
      state.language = language;
      handleStorage({ key: "language", value: language });
      return { ...state };
    }),
}));
