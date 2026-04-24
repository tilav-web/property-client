import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { formatDistanceToNow } from "date-fns";
import { Bell, Check, Trash2 } from "lucide-react";
import { useNotificationStore } from "@/stores/notification.store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotificationsTab() {
  const { t } = useTranslation();
  const {
    items,
    nextCursor,
    loading,
    unreadCount,
    loadInitial,
    loadMore,
    markRead,
    markAllRead,
    remove,
  } = useNotificationStore();

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  if (items.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center text-gray-500">
        <Bell size={40} className="text-gray-300" />
        <p className="text-sm">
          {t("pages.profile_page.notifications.empty", {
            defaultValue: "Hali bildirishnoma yo‘q",
          })}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {unreadCount > 0
            ? t("pages.profile_page.notifications.unread_count", {
                count: unreadCount,
                defaultValue: `${unreadCount} o‘qilmagan`,
              })
            : t("pages.profile_page.notifications.all_read", {
                defaultValue: "Hammasi o‘qildi",
              })}
        </p>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={() => markAllRead()}>
            <Check size={14} className="mr-1" />
            {t("pages.profile_page.notifications.mark_all", {
              defaultValue: "Hammasini o‘qilgan",
            })}
          </Button>
        )}
      </div>

      <ul className="divide-y divide-gray-100 rounded-xl border border-gray-200">
        {items.map((n) => (
          <li
            key={n._id}
            className={cn(
              "flex items-start gap-3 p-4 hover:bg-gray-50",
              !n.read && "bg-blue-50/40",
            )}
          >
            <div className="mt-1">
              <Bell
                size={18}
                className={n.read ? "text-gray-400" : "text-blue-500"}
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-gray-900">
                  {n.title}
                </p>
                <span className="flex-shrink-0 text-[10px] text-gray-400">
                  {formatDistanceToNow(new Date(n.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              <p className="mt-0.5 text-sm text-gray-600">{n.body}</p>
              {n.link && (
                <Link
                  to={n.link}
                  onClick={() => markRead(n._id)}
                  className="mt-1 inline-block text-xs text-blue-600 underline"
                >
                  {t("common.buttons.open", { defaultValue: "Ochish" })}
                </Link>
              )}
            </div>
            <div className="flex flex-col gap-1">
              {!n.read && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => markRead(n._id)}
                >
                  <Check size={12} />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-red-500 hover:text-red-600"
                onClick={() => remove(n._id)}
              >
                <Trash2 size={12} />
              </Button>
            </div>
          </li>
        ))}
      </ul>

      {nextCursor && (
        <div className="mt-4 flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadMore()}
            disabled={loading}
          >
            {loading ? t("common.loading") : t("common.load_more", {
              defaultValue: "Yana yuklash",
            })}
          </Button>
        </div>
      )}
    </div>
  );
}
