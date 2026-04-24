import { MessageCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useChatStore } from "@/stores/chat.store";
import { useUserStore } from "@/stores/user.store";
import { cn } from "@/lib/utils";

const HIDDEN_PREFIXES = ["/messages", "/admin"];

export default function FloatingChatButton() {
  const user = useUserStore((s) => s.user);
  const unread = useChatStore((s) => s.unreadTotal);
  const { pathname } = useLocation();

  if (!user?._id) return null;
  if (HIDDEN_PREFIXES.some((p) => pathname.startsWith(p))) return null;

  return (
    <Link
      to="/messages"
      aria-label="Open messages"
      className={cn(
        "fixed z-40 bottom-5 right-5 sm:bottom-6 sm:right-6",
        "group flex h-14 w-14 items-center justify-center rounded-full",
        "bg-gradient-to-br from-blue-500 to-blue-600 text-white",
        "shadow-lg shadow-blue-500/30 ring-1 ring-blue-400/30",
        "transition-transform duration-200 hover:scale-105 active:scale-95",
      )}
    >
      <span
        className={cn(
          "absolute inset-0 rounded-full bg-blue-500/40",
          unread > 0 && "animate-ping",
        )}
        aria-hidden
      />
      <MessageCircle
        size={24}
        className="relative drop-shadow-sm"
        strokeWidth={2.2}
      />
      {unread > 0 && (
        <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-semibold text-white ring-2 ring-white">
          {unread > 99 ? "99+" : unread}
        </span>
      )}
    </Link>
  );
}
