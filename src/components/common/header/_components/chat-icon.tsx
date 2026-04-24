import { MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { useChatStore } from "@/stores/chat.store";

export default function ChatIcon() {
  const unread = useChatStore((s) => s.unreadTotal);

  return (
    <Link
      to="/messages"
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100"
      aria-label="Messages"
    >
      <MessageSquare size={20} />
      {unread > 0 && (
        <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-blue-500 px-1 text-[10px] font-semibold text-white">
          {unread > 99 ? "99+" : unread}
        </span>
      )}
    </Link>
  );
}
