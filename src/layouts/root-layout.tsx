import { ensureLanguageResources } from "@/i18n/i18n";
import { userService } from "@/services/user.service";
import { useLanguageStore } from "@/stores/language.store";
import { useLikeStore } from "@/stores/like.store";
import { useSaveStore } from "@/stores/save.store";
import { useUserStore } from "@/stores/user.store";
import { handleStorage } from "@/utils/handle-storage";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import { useRealtime } from "@/hooks/use-realtime";
import { useChatStore } from "@/stores/chat.store";
import { useNotificationStore } from "@/stores/notification.store";
import FloatingChatButton from "@/components/common/floating-chat-button";
import type { ILanguage } from "@/interfaces/language/language.interface";

const SUPPORTED_LANGUAGES: ILanguage[] = ["uz", "ru", "en", "ms"];

const isSupportedLanguage = (language: unknown): language is ILanguage =>
  typeof language === "string" &&
  SUPPORTED_LANGUAGES.includes(language as ILanguage);

export default function RootLayout() {
  const { setUser, user, logout } = useUserStore();
  const { language, setLanguage } = useLanguageStore();
  const { fetchLikedProperties, likedProperties } = useLikeStore();
  const { savedProperties, fetchSavedProperties } = useSaveStore();

  useRealtime();
  const loadConversations = useChatStore((s) => s.loadConversations);
  const loadNotifications = useNotificationStore((s) => s.loadInitial);

  useEffect(() => {
    if (!user?._id) return;
    loadConversations();
    loadNotifications();
  }, [user?._id, loadConversations, loadNotifications]);

  const { i18n } = useTranslation();

  useEffect(() => {
    const storedLanguage = handleStorage({ key: "language" });
    const resolvedLanguage = storedLanguage ?? user?.lan ?? "en";

    if (!isSupportedLanguage(resolvedLanguage)) {
      return;
    }

    if (document.documentElement.lang !== resolvedLanguage) {
      document.documentElement.lang = resolvedLanguage;
    }

    if (language !== resolvedLanguage) {
      setLanguage(resolvedLanguage);
    }

    if (i18n.language !== resolvedLanguage) {
      void ensureLanguageResources(resolvedLanguage).then(() =>
        i18n.changeLanguage(resolvedLanguage),
      );
    }
  }, [i18n, language, setLanguage, user?.lan]);

  useEffect(() => {
    let isMounted = true;

    if (user || user === null) return;

    void (async () => {
      try {
        const data = await userService.findMe();
        if (isMounted) {
          setUser(data);
        }
      } catch {
        if (isMounted) {
          logout();
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [logout, setUser, user]);

  useEffect(() => {
    if (user?._id && !likedProperties.length) {
      fetchLikedProperties();
    }
    if (user?._id && !savedProperties.length) {
      fetchSavedProperties();
    }
  }, [
    fetchLikedProperties,
    fetchSavedProperties,
    likedProperties.length,
    savedProperties.length,
    user?._id,
  ]);

  return (
    <>
      <Outlet />
      <FloatingChatButton />
    </>
  );
}
