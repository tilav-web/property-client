import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useUserStore } from "@/stores/user.store";
import { useChatStore } from "@/stores/chat.store";
import { chatService } from "@/services/chat.service";
import AnonymousAiChat from "./_components/anonymous-ai-chat";

/**
 * /ai-chat sahifasi:
 *  - Anonim foydalanuvchi: AnonymousAiChat (login shart emas, history client'da)
 *  - Login foydalanuvchi: AI suhbatni ochib /messages?c=<id>'ga redirect qiladi.
 *    Telegram-style: AI bot conversation list'da pinned bo'ladi va xuddi
 *    boshqa chat kabi ochiladi.
 */
export default function AiChatPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialPrompt = searchParams.get("prompt") ?? "";
  const user = useUserStore((s) => s.user);
  const upsertConversation = useChatStore((s) => s.upsertConversation);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?._id) return;

    let cancelled = false;
    (async () => {
      try {
        const conv = await chatService.openAiConversation();
        if (cancelled) return;
        upsertConversation(conv);
        const initial = initialPrompt
          ? `&prompt=${encodeURIComponent(initialPrompt)}`
          : "";
        navigate(`/messages?c=${conv._id}${initial}`, { replace: true });
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
  }, [user?._id, upsertConversation, navigate, initialPrompt, t]);

  const handleBack = () => navigate(-1);

  // Anonim foydalanuvchi
  if (!user?._id) {
    return (
      <div className="-mx-4 sm:mx-0 sm:py-4">
        <div className="flex h-[calc(100vh-65px)] sm:h-[calc(100vh-115px)] overflow-hidden bg-white sm:rounded-xl sm:border sm:border-gray-200">
          <AnonymousAiChat onBack={handleBack} initialPrompt={initialPrompt} />
        </div>
      </div>
    );
  }

  // Login user — redirect kutilmoqda
  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <p className="text-base font-medium text-foreground">{error}</p>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          <ArrowLeft size={16} />
          {t("common.back", "Orqaga")}
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-muted-foreground">
      <Loader2 size={28} className="animate-spin text-primary" />
      <p className="text-sm">
        {t("pages.ai_chat.loading", "AI yordamchi yuklanmoqda...")}
      </p>
    </div>
  );
}
