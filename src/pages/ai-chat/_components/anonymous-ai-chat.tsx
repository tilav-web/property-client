import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Bot, ExternalLink, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  chatService,
  type AiCompactProperty,
  type AnonymousAiHistoryItem,
} from "@/services/chat.service";
import { formatPrice } from "@/utils/format-price";
import MessageInput from "@/pages/messages/_components/message-input";

interface LocalMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  properties?: AiCompactProperty[];
  noResults?: boolean;
}

interface Props {
  onBack?: () => void;
}

const newId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export default function AnonymousAiChat({ onBack }: Props) {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Welcome xabari
  useEffect(() => {
    setMessages([
      {
        id: newId(),
        role: "assistant",
        content: t(
          "pages.ai_chat.welcome",
          "Salom! Men Amaar Properties AI yordamchisiman. Mulk qidirish uchun oddiy tilda yozing — masalan: \"KLda 2 xonali kvartira\".",
        ),
      },
    ]);
  }, [t]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleSend = useCallback(
    async (text: string) => {
      if (sending) return;
      const userMsg: LocalMessage = {
        id: newId(),
        role: "user",
        content: text,
      };
      const next = [...messages, userMsg];
      setMessages(next);
      setSending(true);

      const history: AnonymousAiHistoryItem[] = next
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => ({ role: m.role, content: m.content }));

      try {
        const reply = await chatService.askAiAnonymous(history);
        setMessages((prev) => [
          ...prev,
          {
            id: newId(),
            role: "assistant",
            content: reply.body,
            properties: reply.properties,
            noResults: reply.noResults,
          },
        ]);
      } catch (err) {
        console.error("AI anonymous reply failed", err);
        toast.error(
          t("pages.ai_chat.send_error", "AI javobi olinmadi, qayta urining"),
        );
        // Failed user message qoldiriladi, yana yuborish mumkin
      } finally {
        setSending(false);
      }
    },
    [messages, sending, t],
  );

  const peerHeader = useMemo(
    () => (
      <div className="flex items-center gap-3 border-b bg-white px-4 py-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 lg:hidden"
            aria-label="Back"
          >
            <ArrowLeft size={18} />
          </button>
        )}
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
          <Bot size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-semibold text-gray-900">
            {t("pages.ai_chat.title", "AI yordamchi")}
          </h2>
          <p className="truncate text-xs text-gray-500">
            {t(
              "pages.ai_chat.anonymous_subtitle",
              "Mehmon rejimi — suhbat saqlanmaydi",
            )}
          </p>
        </div>
      </div>
    ),
    [onBack, t],
  );

  return (
    <div className="flex w-full flex-col">
      {peerHeader}

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto bg-gray-50 px-4 py-4"
      >
        <div className="mx-auto flex max-w-3xl flex-col gap-3">
          {messages.map((m) => (
            <Bubble key={m.id} message={m} />
          ))}
          {sending && (
            <div className="flex items-center gap-2 self-start rounded-2xl bg-white px-4 py-2 shadow-sm border border-gray-100">
              <Loader2 size={14} className="animate-spin text-indigo-500" />
              <span className="text-xs text-gray-500">
                {t("pages.ai_chat.thinking", "AI o'ylayapti...")}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="border-t bg-white">
        <MessageInput onSend={handleSend} disabled={sending} />
      </div>
    </div>
  );
}

function Bubble({ message }: { message: LocalMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm",
          isUser
            ? "rounded-br-md bg-blue-500 text-white"
            : "rounded-bl-md border border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 text-gray-900",
        )}
      >
        {!isUser && (
          <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-indigo-600">
            <Bot size={12} />
            AI
          </div>
        )}
        <p className="whitespace-pre-line leading-relaxed">{message.content}</p>

        {message.properties && message.properties.length > 0 && (
          <div className="mt-3 space-y-2">
            {message.properties.map((p) => (
              <PropertyCard key={p._id} property={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PropertyCard({ property }: { property: AiCompactProperty }) {
  return (
    <Link
      to={`/property/${property._id}`}
      target="_blank"
      rel="noopener"
      className="block overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-md"
    >
      <div className="flex gap-3 p-2">
        {property.photo && (
          <img
            src={property.photo}
            alt={property.title}
            className="h-20 w-24 flex-shrink-0 rounded-md object-cover"
          />
        )}
        <div className="min-w-0 flex-1 py-1">
          <h3 className="line-clamp-1 text-sm font-semibold text-gray-900">
            {property.title}
          </h3>
          {property.address && (
            <p className="line-clamp-1 text-xs text-gray-500">
              {property.address}
            </p>
          )}
          {property.price !== undefined && (
            <p className="mt-1 text-sm font-bold text-emerald-600">
              {formatPrice(property.price, property.currency)}
            </p>
          )}
          <div className="mt-1 flex items-center gap-2 text-[11px] text-gray-500">
            {property.bedrooms !== undefined && (
              <span>{property.bedrooms} bed</span>
            )}
            {property.bathrooms !== undefined && (
              <span>{property.bathrooms} bath</span>
            )}
            {property.area !== undefined && <span>{property.area} m²</span>}
            <ExternalLink size={10} className="ml-auto text-gray-400" />
          </div>
        </div>
      </div>
    </Link>
  );
}
