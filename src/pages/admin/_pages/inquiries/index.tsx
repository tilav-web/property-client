import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminInquiryService, type IAdminInquiry } from "../../_services/admin-inquiry.service";
import { cn } from "@/lib/utils";
import { MessageSquare, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const TYPE_LABEL: Record<IAdminInquiry["type"], string> = {
  purchase: "Sotib olish",
  rent: "Ijara",
  mortgage: "Ipoteka",
};

const STATUS_LABEL: Record<IAdminInquiry["status"], string> = {
  pending: "Kutilmoqda",
  viewed: "Ko'rilgan",
  responded: "Javob berilgan",
  accepted: "Qabul qilindi",
  rejected: "Rad etildi",
  canceled: "Bekor qilindi",
};

const STATUS_COLOR: Record<IAdminInquiry["status"], string> = {
  pending: "bg-yellow-100 text-yellow-800",
  viewed: "bg-blue-100 text-blue-800",
  responded: "bg-purple-100 text-purple-800",
  accepted: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  canceled: "bg-gray-100 text-gray-600",
};

const TYPE_COLOR: Record<IAdminInquiry["type"], string> = {
  purchase: "bg-indigo-100 text-indigo-800",
  rent: "bg-cyan-100 text-cyan-800",
  mortgage: "bg-orange-100 text-orange-800",
};

const STATUS_FILTERS = [
  { key: "", label: "Hammasi" },
  { key: "pending", label: "Kutilmoqda" },
  { key: "accepted", label: "Qabul" },
  { key: "rejected", label: "Rad" },
  { key: "responded", label: "Javob berilgan" },
  { key: "canceled", label: "Bekor" },
] as const;

const TYPE_FILTERS = [
  { key: "", label: "Barcha tur" },
  { key: "purchase", label: "Sotib olish" },
  { key: "rent", label: "Ijara" },
  { key: "mortgage", label: "Ipoteka" },
] as const;

const LIMIT = 20;

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("uz-UZ", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }) + " " + d.toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" });
}

function Avatar({ src, name }: { src?: string; name: string }) {
  return src ? (
    <img src={src} alt={name} className="h-8 w-8 rounded-full object-cover" />
  ) : (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

export default function AdminInquiriesPage() {
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-inquiries", status, type, page],
    queryFn: () =>
      adminInquiryService.findAll({
        page,
        limit: LIMIT,
        status: status || undefined,
        type: type || undefined,
      }),
  });

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / LIMIT);

  const changeFilter = (newStatus: string, newType: string) => {
    setStatus(newStatus);
    setType(newType);
    setPage(1);
  };

  return (
    <div className="p-6">
      <div className="mb-5 flex items-center gap-3">
        <MessageSquare className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Property so'rovlari</h1>
          <p className="text-sm text-muted-foreground">
            Jami {total} ta so'rov
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-4">
        <div className="flex flex-wrap gap-1 rounded-full border border-border/60 bg-white p-1 w-fit">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => changeFilter(f.key, type)}
              className={cn(
                "whitespace-nowrap rounded-full px-3 py-1 text-sm font-medium transition-colors",
                status === f.key
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-1 rounded-full border border-border/60 bg-white p-1 w-fit">
          {TYPE_FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => changeFilter(status, f.key)}
              className={cn(
                "whitespace-nowrap rounded-full px-3 py-1 text-sm font-medium transition-colors",
                type === f.key
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="py-16 text-center text-muted-foreground">Yuklanmoqda...</div>
      ) : items.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground">So'rovlar yo'q.</div>
      ) : (
        <div className="space-y-3">
          {items.map((inq) => (
            <div
              key={inq._id}
              className="rounded-xl border border-border/60 bg-white p-4 shadow-sm"
            >
              {/* Header row */}
              <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", TYPE_COLOR[inq.type])}>
                    {TYPE_LABEL[inq.type]}
                  </span>
                  <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", STATUS_COLOR[inq.status])}>
                    {STATUS_LABEL[inq.status]}
                  </span>
                </div>
                <time className="text-xs text-muted-foreground tabular-nums">
                  {formatDate(inq.createdAt)}
                </time>
              </div>

              {/* Main content */}
              <div className="grid gap-3 sm:grid-cols-3">
                {/* User */}
                <div className="flex items-center gap-2">
                  <Avatar
                    src={inq.user?.avatar}
                    name={inq.user?.first_name ?? "?"}
                  />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Xaridor</p>
                    <p className="truncate text-sm font-medium">
                      {inq.user?.first_name} {inq.user?.last_name}
                    </p>
                  </div>
                </div>

                {/* Seller */}
                <div className="flex items-center gap-2">
                  <Avatar
                    src={inq.seller?.avatar}
                    name={inq.seller?.first_name ?? "?"}
                  />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Mulk egasi</p>
                    <p className="truncate text-sm font-medium">
                      {inq.seller?.first_name} {inq.seller?.last_name}
                    </p>
                  </div>
                </div>

                {/* Property */}
                <div className="flex items-center gap-2">
                  {inq.property?.photos?.[0] ? (
                    <img
                      src={inq.property.photos[0]}
                      alt={inq.property.title}
                      className="h-8 w-12 rounded object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="h-8 w-12 rounded bg-gray-100 flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">E'lon</p>
                    <Link
                      to={`/property/${inq.property?._id}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 truncate text-sm font-medium text-primary hover:underline"
                    >
                      {inq.property?.title}
                      <ExternalLink size={10} className="flex-shrink-0" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Price + comment */}
              <div className="mt-3 flex flex-wrap gap-4 text-sm">
                {inq.offered_price != null && (
                  <span className="text-muted-foreground">
                    Taklif narxi:{" "}
                    <span className="font-semibold text-foreground">
                      {inq.offered_price.toLocaleString()}
                    </span>
                  </span>
                )}
                {inq.rental_period && (
                  <span className="text-muted-foreground">
                    Ijara muddati:{" "}
                    <span className="font-medium text-foreground">
                      {formatDate(inq.rental_period.from).split(" ")[0]} —{" "}
                      {formatDate(inq.rental_period.to).split(" ")[0]}
                    </span>
                  </span>
                )}
              </div>

              {inq.comment && (
                <p className="mt-2 whitespace-pre-line rounded-lg bg-gray-50 px-3 py-2 text-sm text-foreground">
                  {inq.comment}
                </p>
              )}

              {/* Response */}
              {inq.response && (
                <div
                  className={cn(
                    "mt-2 rounded-lg border px-3 py-2 text-sm",
                    inq.response.status === "approved"
                      ? "border-green-200 bg-green-50"
                      : "border-red-200 bg-red-50",
                  )}
                >
                  <span className="font-medium">
                    {inq.response.status === "approved" ? "✅ Qabul:" : "❌ Rad:"}
                  </span>{" "}
                  {inq.response.description}
                  <span className="ml-2 text-xs text-muted-foreground">
                    {formatDate(inq.response.createdAt)}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
