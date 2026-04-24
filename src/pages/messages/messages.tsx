import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MessageSquare } from "lucide-react";
import { useUserStore } from "@/stores/user.store";
import { useChatStore } from "@/stores/chat.store";
import ConversationList from "./_components/conversation-list";
import MessagePanel from "./_components/message-panel";
import { cn } from "@/lib/utils";

export default function MessagesPage() {
  const { t } = useTranslation();
  const user = useUserStore((s) => s.user);
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const targetId = params.get("c");

  const {
    conversations,
    loadingConversations,
    loadConversations,
    activeConversationId,
    setActive,
  } = useChatStore();

  const [mobilePanel, setMobilePanel] = useState<"list" | "panel">("list");

  useEffect(() => {
    if (!user?._id) {
      navigate("/auth/login");
      return;
    }
    loadConversations();
  }, [user?._id, loadConversations, navigate]);

  // URL param ?c=<id> active conversation ni boshqaradi
  useEffect(() => {
    if (targetId && targetId !== activeConversationId) {
      setActive(targetId);
      setMobilePanel("panel");
    }
    if (!targetId && activeConversationId) {
      setActive(null);
    }
  }, [targetId, activeConversationId, setActive]);

  const active = useMemo(
    () => conversations.find((c) => c._id === activeConversationId) ?? null,
    [conversations, activeConversationId],
  );

  const handleSelect = (id: string) => {
    const next = new URLSearchParams(params);
    next.set("c", id);
    setParams(next);
    setMobilePanel("panel");
  };

  const handleBack = () => {
    const next = new URLSearchParams(params);
    next.delete("c");
    setParams(next);
    setMobilePanel("list");
  };

  return (
    <div className="container mx-auto max-w-6xl px-0 sm:px-4 py-0 sm:py-4">
      <div className="flex h-[calc(100vh-65px)] overflow-hidden border border-gray-200 bg-white sm:rounded-xl sm:shadow-sm">
        {/* Left: conversation list */}
        <aside
          className={cn(
            "w-full border-r border-gray-200 lg:w-80 lg:flex-shrink-0",
            mobilePanel === "panel" ? "hidden lg:block" : "block",
          )}
        >
          <div className="flex items-center gap-2 border-b bg-white px-4 py-4">
            <MessageSquare size={18} className="text-blue-500" />
            <h1 className="text-base font-semibold text-gray-900">
              {t("pages.messages.title", { defaultValue: "Xabarlar" })}
            </h1>
          </div>
          <div className="h-[calc(100%-57px)] overflow-y-auto">
            {loadingConversations && !conversations.length ? (
              <div className="p-6 text-center text-sm text-gray-500">
                {t("common.loading")}
              </div>
            ) : (
              <ConversationList
                conversations={conversations}
                activeId={activeConversationId}
                onSelect={handleSelect}
              />
            )}
          </div>
        </aside>

        {/* Right: panel */}
        <main
          className={cn(
            "min-w-0 flex-1",
            mobilePanel === "list" ? "hidden lg:block" : "block",
          )}
        >
          {active ? (
            <MessagePanel conversation={active} onBack={handleBack} />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center text-gray-500">
              <MessageSquare size={40} className="text-gray-300" />
              <p className="text-sm">
                {t("pages.messages.select_prompt", {
                  defaultValue: "Chapdan suhbatni tanlang",
                })}
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
