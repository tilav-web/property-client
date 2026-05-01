import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  Bell,
  CheckCircle2,
  ExternalLink,
  Inbox,
  Loader2,
  MessageSquare,
  UserPlus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { adminProjectInquiryService } from "../../_services/admin-project-inquiry.service";
import { adminSellerService } from "../../_services/admin-seller.service";

interface NotificationItem {
  id: string;
  type: "inquiry" | "seller";
  title: string;
  description: string;
  meta: string;
  href: string;
  status?: string;
  isUnread: boolean;
  createdAt: string;
}

function formatRelative(dateStr: string): string {
  const ms = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(ms / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function AdminNotificationsPage() {
  const inquiriesQuery = useQuery({
    queryKey: ["admin-notifications", "inquiries"],
    queryFn: () => adminProjectInquiryService.list({ page: 1, limit: 20 }),
    refetchInterval: 60_000,
  });

  const sellersQuery = useQuery({
    queryKey: ["admin-notifications", "sellers"],
    queryFn: () => adminSellerService.getSellers({ page: 1, limit: 20 }),
    refetchInterval: 60_000,
  });

  const items = useMemo<NotificationItem[]>(() => {
    const list: NotificationItem[] = [];

    inquiriesQuery.data?.items.forEach((q) => {
      list.push({
        id: `inquiry-${q._id}`,
        type: "inquiry",
        title: `${q.full_name} → ${q.project?.name ?? "Project"}`,
        description:
          q.message?.slice(0, 80) ||
          `${q.contact_method} via ${q.email ?? q.phone ?? "—"}`,
        meta: q.contact_method,
        href: "/admin/project-inquiries",
        status: q.status,
        isUnread: q.status === "new",
        createdAt: q.createdAt,
      });
    });

    sellersQuery.data?.sellers.forEach((s) => {
      const isPending = s.status === "in_progress";
      list.push({
        id: `seller-${s._id}`,
        type: "seller",
        title: `Yangi seller: ${s.business_type?.toUpperCase() ?? "—"}`,
        description: `Status: ${s.status}, passport: ${s.passport ?? "—"}`,
        meta: s.business_type ?? "",
        href: "/admin/sellers",
        status: s.status,
        isUnread: isPending,
        createdAt:
          (s as unknown as { createdAt: string }).createdAt ||
          new Date().toISOString(),
      });
    });

    return list.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [inquiriesQuery.data, sellersQuery.data]);

  const unreadCount = items.filter((i) => i.isUnread).length;
  const isLoading = inquiriesQuery.isLoading || sellersQuery.isLoading;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Bell className="h-6 w-6 text-primary" />
          <div>
            <h1 className="font-display text-2xl text-foreground flex items-center gap-2">
              Bildirishnomalar
              {unreadCount > 0 && (
                <Badge variant="default" className="ml-1">
                  {unreadCount} yangi
                </Badge>
              )}
            </h1>
            <p className="text-sm text-muted-foreground">
              Loyiha so'rovlari va yangi sotuvchilar
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            inquiriesQuery.refetch();
            sellersQuery.refetch();
          }}
        >
          Yangilash
        </Button>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card divide-y divide-border/60">
        {isLoading ? (
          <div className="flex items-center justify-center p-12 text-muted-foreground">
            <Loader2 className="size-6 animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-3 p-12 text-center">
            <Inbox className="size-10 text-muted-foreground/60" />
            <p className="text-sm text-muted-foreground">
              Hozirda bildirishnoma yo'q
            </p>
          </div>
        ) : (
          items.map((item) => (
            <Link
              key={item.id}
              to={item.href}
              className="group flex items-start gap-4 p-4 hover:bg-accent transition-colors"
            >
              <div
                className={`flex size-10 flex-shrink-0 items-center justify-center rounded-full ${
                  item.type === "inquiry"
                    ? "bg-primary/15 text-primary"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {item.type === "inquiry" ? (
                  <MessageSquare className="size-4" />
                ) : (
                  <UserPlus className="size-4" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground line-clamp-1">
                    {item.title}
                  </p>
                  {item.isUnread && (
                    <span className="size-2 mt-1.5 flex-shrink-0 rounded-full bg-primary" />
                  )}
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                  {item.description}
                </p>
                <div className="mt-1.5 flex items-center gap-2 text-[11px] text-muted-foreground/80">
                  <span>{formatRelative(item.createdAt)}</span>
                  {item.status && (
                    <>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1">
                        <CheckCircle2 className="size-3" />
                        {item.status}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <ExternalLink className="size-4 text-muted-foreground/60 group-hover:text-foreground transition-colors" />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
