import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useUserStore } from "@/stores/user.store";
import { useChatStore } from "@/stores/chat.store";
import { chatService } from "@/services/chat.service";
import type { IConversation } from "@/interfaces/chat/conversation.interface";
import MessagePanel from "@/pages/messages/_components/message-panel";
import AnonymousAiChat from "./_components/anonymous-ai-chat";

export default function AiChatPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useUserStore((s) => s.user);
  const upsertConversation = useChatStore((s) => s.upsertConversation);
  const setActive = useChatStore((s) => s.setActive);
  const conversations = useChatStore((s) => s.conversations);

  const [conversation, setConversation] = useState<IConversation | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Anonim foydalanuvchi uchun authenticated flow ishlamaydi —
    // alohida AnonymousAiChat komponenti ishlaydi.
    if (!user?._id) return;

    let cancelled = false;
    (async () => {
      try {
        const conv = await chatService.openAiConversation();
        if (cancelled) return;
        upsertConversation(conv);
        setActive(conv._id);
        setConversation(conv);
      } catch (err) {
        console.error("Failed to open AI conversation", err);
        if (!cancelled)
          setError(
            t("pages.ai_chat.error_load", "AI suhbatini ochib bo'lmadi"),
          );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user?._id, upsertConversation, setActive, t]);

  useEffect(() => {
    if (!conversation?._id) return;
    const fresh = conversations.find((c) => c._id === conversation._id);
    if (fresh && fresh !== conversation) setConversation(fresh);
  }, [conversations, conversation]);

  const handleBack = () => navigate(-1);

  const backButton = (
    <button
      type="button"
      onClick={handleBack}
      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
    >
      <ArrowLeft size={16} />
      {t("common.back", "Orqaga")}
    </button>
  );

  // Anonymous (login bo'lmagan) foydalanuvchi
  if (!user?._id) {
    return (
      <div className="-mx-4 sm:mx-0 sm:py-4">
        <div className="px-4 sm:px-0 mb-2 sm:mb-3">{backButton}</div>
        <div className="flex h-[calc(100vh-115px)] sm:h-[calc(100vh-150px)] overflow-hidden border border-gray-200 bg-white sm:rounded-xl sm:shadow-sm">
          <AnonymousAiChat onBack={handleBack} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <p className="text-base font-medium text-gray-900">{error}</p>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-4 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          {t("common.back", "Orqaga")}
        </button>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-gray-500">
        <Loader2 size={28} className="animate-spin text-blue-500" />
        <p className="text-sm">
          {t("pages.ai_chat.loading", "AI yordamchi yuklanmoqda...")}
        </p>
      </div>
    );
  }

  return (
    <div className="-mx-4 sm:mx-0 sm:py-4">
      <div className="px-4 sm:px-0 mb-2 sm:mb-3">{backButton}</div>
      <div className="flex h-[calc(100vh-115px)] sm:h-[calc(100vh-150px)] overflow-hidden border border-gray-200 bg-white sm:rounded-xl sm:shadow-sm">
        <div className="flex w-full flex-col">
          <MessagePanel conversation={conversation} onBack={handleBack} />
        </div>
      </div>
    </div>
  );
}
