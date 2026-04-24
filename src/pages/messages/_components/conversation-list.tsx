import { useTranslation } from "react-i18next";
import { formatDistanceToNow } from "date-fns";
import type { IConversation } from "@/interfaces/chat/conversation.interface";
import { useUserStore } from "@/stores/user.store";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Props {
  conversations: IConversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

export default function ConversationList({
  conversations,
  activeId,
  onSelect,
}: Props) {
  const { t } = useTranslation();
  const me = useUserStore((s) => s.user);

  if (!conversations.length) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center text-sm text-gray-500">
        {t("pages.messages.empty_list", {
          defaultValue: "Hali suhbatlar yo‘q",
        })}
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-100">
      {conversations.map((c) => {
        const peer = c.participants.find((p) => p._id !== me?._id);
        const name = peer
          ? `${peer.first_name ?? ""} ${peer.last_name ?? ""}`.trim() ||
            (typeof peer.email === "string" ? peer.email : peer.email?.value) ||
            "User"
          : "User";
        const initials = name
          .split(" ")
          .map((w) => w[0])
          .filter(Boolean)
          .slice(0, 2)
          .join("")
          .toUpperCase();
        const unread = me?._id ? (c.unreadBy?.[me._id] ?? 0) : 0;
        const isActive = c._id === activeId;

        return (
          <li key={c._id}>
            <button
              type="button"
              onClick={() => onSelect(c._id)}
              className={cn(
                "flex w-full items-center gap-3 px-3 py-3 text-left hover:bg-gray-50",
                isActive && "bg-blue-50 hover:bg-blue-50",
              )}
            >
              <Avatar className="h-11 w-11">
                <AvatarImage src={peer?.avatar ?? undefined} alt={name} />
                <AvatarFallback>{initials || "?"}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {name}
                  </p>
                  <span className="flex-shrink-0 text-xs text-gray-400">
                    {formatDistanceToNow(new Date(c.lastMessageAt), {
                      addSuffix: false,
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm text-gray-500">
                    {c.lastMessageSnippet ||
                      t("pages.messages.no_messages_yet", {
                        defaultValue: "No messages yet",
                      })}
                  </p>
                  {unread > 0 && (
                    <span className="flex-shrink-0 rounded-full bg-blue-500 px-2 py-0.5 text-xs font-semibold text-white">
                      {unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
