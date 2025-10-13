import { useUserStore } from "@/stores/user.store";
import { handleStorage } from "@/utils/handle-storage";

export const useCurrentLanguage = () => {
  const { user } = useUserStore();
  const lanValue = handleStorage({ key: "lan" });

  const getCurrentLanguage = (): "uz" | "ru" | "en" => {
    if (user?.lan && ["uz", "ru", "en"].includes(user.lan)) {
      return user.lan as "uz" | "ru" | "en";
    }
    if (lanValue && ["uz", "ru", "en"].includes(lanValue)) {
      return lanValue as "uz" | "ru" | "en";
    }
    return "uz";
  };

  const getLocalizedText = (text: {
    uz: string;
    ru: string;
    en: string;
  }): string => {
    const lang = getCurrentLanguage();
    return text?.[lang] || text?.uz || "";
  };

  return {
    currentLanguage: getCurrentLanguage(),
    getLocalizedText,
  };
};
