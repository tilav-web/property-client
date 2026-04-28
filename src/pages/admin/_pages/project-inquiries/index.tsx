import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Inbox,
  Mail,
  MessageCircle,
  Phone,
  Send,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  adminProjectInquiryService,
  type IAdminProjectInquiry,
  type TProjectInquiryStatus,
} from "../../_services/admin-project-inquiry.service";
import { cn } from "@/lib/utils";

const STATUS_TABS: { key: "all" | TProjectInquiryStatus; label: string }[] = [
  { key: "all", label: "Hammasi" },
  { key: "new", label: "Yangi" },
  { key: "seen", label: "Ko'rilgan" },
  { key: "contacted", label: "Aloqa qilingan" },
  { key: "closed", label: "Yopilgan" },
];

const METHOD_ICON: Record<IAdminProjectInquiry["contact_method"], typeof Mail> =
  {
    chat: Send,
    email: Mail,
    phone: Phone,
    whatsapp: MessageCircle,
    telegram: Send,
  };

const STATUS_COLOR: Record<TProjectInquiryStatus, string> = {
  new: "bg-blue-100 text-blue-700",
  seen: "bg-gray-100 text-gray-700",
  contacted: "bg-amber-100 text-amber-800",
  closed: "bg-emerald-100 text-emerald-800",
};

export default function AdminProjectInquiriesPage() {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<"all" | TProjectInquiryStatus>("all");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-project-inquiries", status],
    queryFn: () =>
      adminProjectInquiryService.list({
        limit: 50,
        status: status === "all" ? undefined : status,
      }),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      next,
    }: {
      id: string;
      next: TProjectInquiryStatus;
    }) => adminProjectInquiryService.updateStatus(id, next),
    onSuccess: () => {
      toast.success("Holat yangilandi");
      queryClient.invalidateQueries({
        queryKey: ["admin-project-inquiries"],
      });
    },
  });

  const items = data?.items ?? [];

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center gap-3">
        <Inbox className="h-6 w-6 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Loyiha so'rovlari
          </h1>
          <p className="text-sm text-gray-500">
            Foydalanuvchilardan kelgan murojaatlar
          </p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-1 rounded-full border border-gray-200 bg-white p-1 w-fit">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setStatus(tab.key)}
            className={cn(
              "whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium",
              status === tab.key
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:text-gray-900",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="py-10 text-center text-gray-500">Yuklanmoqda...</div>
      ) : items.length === 0 ? (
        <div className="py-10 text-center text-gray-500">
          So'rovlar yo'q.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((inq) => {
            const Icon = METHOD_ICON[inq.contact_method];
            return (
              <div
                key={inq._id}
                className="rounded-xl border border-gray-200 bg-white p-4"
              >
                <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <Link
                      to={`/project/${inq.project._id}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline"
                    >
                      {inq.project.name}
                      <ExternalLink size={12} />
                    </Link>
                    <p className="text-xs text-gray-500">
                      {new Date(inq.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-medium",
                      STATUS_COLOR[inq.status],
                    )}
                  >
                    {inq.status}
                  </span>
                </div>

                <div className="mb-2 flex items-center gap-2 text-sm">
                  <Icon size={14} className="text-gray-400" />
                  <span className="font-medium">{inq.full_name}</span>
                  <span className="text-xs text-gray-500">
                    via {inq.contact_method}
                  </span>
                </div>

                <div className="mb-3 flex flex-wrap gap-3 text-sm">
                  {inq.email && (
                    <a
                      href={`mailto:${inq.email}`}
                      className="flex items-center gap-1 text-blue-600 hover:underline"
                    >
                      <Mail size={12} /> {inq.email}
                    </a>
                  )}
                  {inq.phone && (
                    <a
                      href={`tel:${inq.phone}`}
                      className="flex items-center gap-1 text-blue-600 hover:underline"
                    >
                      <Phone size={12} /> {inq.phone}
                    </a>
                  )}
                </div>

                {inq.message && (
                  <p className="mb-3 whitespace-pre-line rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
                    {inq.message}
                  </p>
                )}

                <div className="flex flex-wrap gap-1">
                  {(["seen", "contacted", "closed"] as const).map((next) => (
                    <Button
                      key={next}
                      size="sm"
                      variant={inq.status === next ? "default" : "outline"}
                      disabled={updateMutation.isPending}
                      onClick={() =>
                        updateMutation.mutate({ id: inq._id, next })
                      }
                    >
                      {next}
                    </Button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
