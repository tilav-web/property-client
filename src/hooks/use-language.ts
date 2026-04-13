import { useUserStore } from "@/stores/user.store";
import { handleStorage } from "@/utils/handle-storage";

export const useCurrentLanguage = () => {
  const { user } = useUserStore();
  const lanValue = handleStorage({ key: "language" });

  const getCurrentLanguage = (): "uz" | "ru" | "en" | "ms" => {
    if (user?.lan && ["uz", "ru", "en", "ms"].includes(user.lan)) {
      return user.lan as "uz" | "ru" | "en" | "ms";
    }
    if (lanValue && ["uz", "ru", "en", "ms"].includes(lanValue)) {
      return lanValue as "uz" | "ru" | "en" | "ms";
    }
    return "en";
  };

  const getLocalizedText = (text: {
    uz: string;
    ru: string;
    en: string;
  }): string => {
    const lang = getCurrentLanguage();
    return text?.[lang] || text?.en || "";
  };

  return {
    currentLanguage: getCurrentLanguage(),
    getLocalizedText,
  };
};
