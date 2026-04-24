import { Bell, Check, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { formatDistanceToNow } from "date-fns";
import { useNotificationStore } from "@/stores/notification.store";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { INotification } from "@/interfaces/notification/notification.interface";

export default function NotificationIcon() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const items = useNotificationStore((s) => s.items);
  const markRead = useNotificationStore((s) => s.markRead);
  const markAllRead = useNotificationStore((s) => s.markAllRead);
  const remove = useNotificationStore((s) => s.remove);

  const handleClick = async (n: INotification) => {
    await markRead(n._id);
    if (n.link) navigate(n.link);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100"
          aria-label="Notifications"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-[360px] p-0"
        sideOffset={8}
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-sm font-semibold">
            {t("common.notifications.title", {
              defaultValue: "Bildirishnomalar",
            })}
          </h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => markAllRead()}
            >
              <Check size={12} className="mr-1" />
              {t("common.notifications.mark_all", {
                defaultValue: "Hammasini o‘qilgan",
              })}
            </Button>
          )}
        </div>
        <ul className="max-h-[420px] overflow-y-auto divide-y divide-gray-100">
          {items.length === 0 ? (
            <li className="p-6 text-center text-sm text-gray-500">
              {t("common.notifications.empty", {
                defaultValue: "Hali bildirishnoma yo‘q",
              })}
            </li>
          ) : (
            items.map((n) => (
              <li
                key={n._id}
                className={cn(
                  "flex items-start gap-2 px-4 py-3 hover:bg-gray-50",
                  !n.read && "bg-blue-50/40",
                )}
              >
                <button
                  onClick={() => handleClick(n)}
                  className="min-w-0 flex-1 text-left"
                >
                  <p className="truncate text-sm font-medium text-gray-900">
                    {n.title}
                  </p>
                  <p className="line-clamp-2 text-xs text-gray-500">
                    {n.body}
                  </p>
                  <p className="mt-1 text-[10px] text-gray-400">
                    {formatDistanceToNow(new Date(n.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </button>
                <button
                  onClick={() => remove(n._id)}
                  className="ml-2 text-gray-400 hover:text-red-500"
                  aria-label="Delete notification"
                >
                  <Trash2 size={14} />
                </button>
              </li>
            ))
          )}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
