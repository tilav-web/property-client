import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronUp, Home } from "lucide-react";
import type { IConversation } from "@/interfaces/chat/conversation.interface";
import { useChatStore } from "@/stores/chat.store";
import { useUserStore } from "@/stores/user.store";
import { chatService } from "@/services/chat.service";
import { socketManager } from "@/lib/socket";
import { useConversationSubscription } from "@/hooks/use-realtime";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import MessageBubble from "./message-bubble";
import MessageInput from "./message-input";

interface Props {
  conversation: IConversation;
  onBack?: () => void;
}

function getLocalizedTitle(
  title: IConversation["property"] extends infer P
    ? P extends { title?: infer T }
      ? T
      : undefined
    : undefined,
  lang: string,
): string {
  if (!title) return "";
  if (typeof title === "string") return title;
  if (typeof title === "object" && title !== null) {
    const rec = title as Record<string, string | undefined>;
    return rec[lang] ?? rec.en ?? rec.uz ?? rec.ru ?? "";
  }
  return "";
}

export default function MessagePanel({ conversation, onBack }: Props) {
  const { t, i18n } = useTranslation();
  const me = useUserStore((s) => s.user);
  const peer = conversation.participants.find((p) => p._id !== me?._id);
  const peerName = peer
    ? `${peer.first_name ?? ""} ${peer.last_name ?? ""}`.trim() ||
      (typeof peer.email === "string" ? peer.email : peer.email?.value) ||
      "User"
    : "User";
  const initials = peerName
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const {
    messagesByConversation,
    loadInitialMessages,
    loadOlderMessages,
    typingByConversation,
    appendLocalMessage,
  } = useChatStore();

  const bucket = messagesByConversation[conversation._id];
  const messages = bucket?.items ?? [];
  const hasMore = Boolean(bucket?.nextCursor);
  const typingSet = typingByConversation[conversation._id];
  const isPeerTyping = Boolean(
    peer && typingSet && typingSet.has(peer._id),
  );

  useConversationSubscription(conversation._id);

  const scrollerRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    loadInitialMessages(conversation._id);
  }, [conversation._id, loadInitialMessages]);

  // Mark as read when active + focused
  useEffect(() => {
    if (!conversation._id) return;
    const mark = async () => {
      try {
        await chatService.markRead(conversation._id);
      } catch {
        // ignore
      }
      const socket = socketManager.instance;
      socket?.emit("chat:mark_read", { conversationId: conversation._id });
    };
    mark();
  }, [conversation._id, messages.length]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (!autoScroll) return;
    const el = scrollerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length, autoScroll]);

  const handleScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const distanceFromBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight;
    setAutoScroll(distanceFromBottom < 80);
  };

  const handleSend = async (body: string) => {
    try {
      const res = await chatService.sendText(conversation._id, body);
      // Optimistic: REST javobidan keyin socket ham emit qiladi — duplikat oldini
      // olish uchun faqat bucket'da yo'q bo'lsagina qo'shiladi.
      appendLocalMessage({
        _id: res._id,
        conversation: conversation._id,
        sender: me?._id ?? "",
        type: "text",
        body,
        metadata: null,
        readBy: me?._id ? [me._id] : [],
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error("send failed:", err);
    }
  };

  const handleTyping = (typing: boolean) => {
    const socket = socketManager.instance;
    socket?.emit("chat:typing", {
      conversationId: conversation._id,
      typing,
    });
  };

  const propertyTitle = getLocalizedTitle(
    conversation.property?.title,
    i18n.language,
  );

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b bg-white px-4 py-3">
        {onBack && (
          <button
            onClick={onBack}
            className="rounded-md p-1 text-gray-500 hover:bg-gray-100 lg:hidden"
          >
            <ArrowLeft size={18} />
          </button>
        )}
        <Avatar className="h-10 w-10">
          <AvatarImage src={peer?.avatar ?? undefined} alt={peerName} />
          <AvatarFallback>{initials || "?"}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-gray-900">
            {peerName}
          </p>
          <p className="truncate text-xs text-gray-500">
            {isPeerTyping
              ? t("pages.messages.typing", { defaultValue: "yozmoqda..." })
              : (typeof peer?.email === "string"
                  ? peer?.email
                  : peer?.email?.value) ?? ""}
          </p>
        </div>
        {conversation.property && (
          <Link
            to={`/property/${conversation.property._id}`}
            className="hidden items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 sm:inline-flex"
          >
            <Home size={12} />
            <span className="max-w-[180px] truncate">
              {propertyTitle ||
                t("pages.messages.view_property", {
                  defaultValue: "View listing",
                })}
            </span>
          </Link>
        )}
      </div>

      {/* Messages */}
      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        className="flex-1 space-y-2 overflow-y-auto bg-gray-50 p-4"
      >
        {hasMore && (
          <div className="flex justify-center pb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => loadOlderMessages(conversation._id)}
              disabled={bucket?.loading}
            >
              <ChevronUp size={14} className="mr-1" />
              {t("pages.messages.load_older", {
                defaultValue: "Eskilarni yuklash",
              })}
            </Button>
          </div>
        )}
        {messages.map((m) => (
          <MessageBubble
            key={m._id}
            message={m}
            isMine={m.sender === me?._id}
          />
        ))}
        {isPeerTyping && (
          <div className="px-2 text-xs italic text-gray-500">
            {t("pages.messages.typing", { defaultValue: "yozmoqda..." })}
          </div>
        )}
      </div>

      <MessageInput onSend={handleSend} onTyping={handleTyping} />
    </div>
  );
}
