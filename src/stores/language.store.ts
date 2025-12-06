import type { ILanguage } from "@/interfaces/language/language.interface";
import { handleStorage } from "@/utils/handle-storage";
import { create } from "zustand";

interface LanguageState {
  language: ILanguage;
  setLanguage: (language: ILanguage) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: "uz",
  setLanguage: (language: ILanguage) =>
    set((state) => {
      state.language = language;
      handleStorage({ key: "language", value: language });
      return { ...state };
    }),
}));
