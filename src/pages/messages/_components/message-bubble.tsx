import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Home } from "lucide-react";
import type { IChatMessage } from "@/interfaces/chat/chat-message.interface";
import { MessageType } from "@/interfaces/chat/message-type";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/utils/format-price";

interface Props {
  message: IChatMessage;
  isMine: boolean;
}

function timeLabel(iso: string): string {
  try {
    return format(new Date(iso), "HH:mm");
  } catch {
    return "";
  }
}

export default function MessageBubble({ message, isMine }: Props) {
  const align = isMine ? "items-end" : "items-start";
  const bubbleBase =
    "max-w-[75%] rounded-2xl px-3 py-2 text-sm shadow-sm break-words";
  const bubbleColor = isMine
    ? "bg-blue-500 text-white rounded-br-md"
    : "bg-white text-gray-900 rounded-bl-md border border-gray-200";

  if (message.type === MessageType.SYSTEM) {
    return (
      <div className="flex w-full justify-center py-2">
        <span className="rounded-full bg-gray-200 px-3 py-1 text-xs text-gray-600">
          {message.body}
        </span>
      </div>
    );
  }

  if (message.type === MessageType.PRICE_OFFER) {
    const meta = (message.metadata ?? {}) as Record<string, unknown>;
    const price = (meta.offered_price as number | undefined) ?? null;
    const currency = (meta.currency as string | undefined) ?? undefined;
    const propertyId =
      ((meta.property as { _id?: string } | undefined)?._id as
        | string
        | undefined) ?? undefined;
    const comment = (meta.comment as string | undefined) ?? "";

    return (
      <div className={cn("flex w-full flex-col gap-1", align)}>
        <div
          className={cn(
            bubbleBase,
            isMine
              ? "bg-amber-500 text-white rounded-br-md"
              : "bg-amber-50 text-amber-900 rounded-bl-md border border-amber-200",
          )}
        >
          <div className="mb-1 text-xs font-semibold opacity-80">
            💰 Price offer
          </div>
          {price !== null && (
            <div className="text-lg font-bold">
              {formatPrice(price, currency)}
            </div>
          )}
          {comment && <div className="mt-1 text-sm">{comment}</div>}
          {propertyId && (
            <Link
              to={`/property/${propertyId}`}
              className={cn(
                "mt-2 inline-flex items-center gap-1 text-xs underline",
                isMine ? "text-white/90" : "text-amber-800",
              )}
            >
              <Home size={12} /> E’lonni ochish
            </Link>
          )}
        </div>
        <span className="px-1 text-[10px] text-gray-400">
          {timeLabel(message.createdAt)}
        </span>
      </div>
    );
  }

  if (message.type === MessageType.PROPERTY_REFERENCE) {
    const meta = (message.metadata ?? {}) as Record<string, unknown>;
    const propertyId = (meta.propertyId as string | undefined) ?? undefined;
    return (
      <div className={cn("flex w-full flex-col gap-1", align)}>
        <div
          className={cn(
            bubbleBase,
            isMine
              ? "bg-blue-50 text-blue-900 border border-blue-200 rounded-br-md"
              : "bg-gray-50 text-gray-800 border border-gray-200 rounded-bl-md",
          )}
        >
          <div className="flex items-center gap-2 text-xs">
            <Home size={14} className="text-blue-500" />
            {message.body}
          </div>
          {propertyId && (
            <Link
              to={`/property/${propertyId}`}
              className="mt-1 inline-block text-xs text-blue-600 underline"
            >
              E’lonni ochish
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex w-full flex-col gap-1", align)}>
      <div className={cn(bubbleBase, bubbleColor)}>{message.body}</div>
      <span className="px-1 text-[10px] text-gray-400">
        {timeLabel(message.createdAt)}
      </span>
    </div>
  );
}
