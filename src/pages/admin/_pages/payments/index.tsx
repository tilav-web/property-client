import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  AlertCircle,
  CheckCircle2,
  Inbox,
  Loader2,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { adminPaymentService } from "../../_services/admin-payment.service";
import {
  OrderType,
  type ITransaction,
} from "@/interfaces/payment/payment.interface";
import { formatPrice } from "@/utils/format-price";

function useRelativeTime() {
  const { t } = useTranslation();
  return (dateStr: string): string => {
    const ms = Date.now() - new Date(dateStr).getTime();
    const m = Math.floor(ms / 60000);
    if (m < 1) return t("payment.admin_payments.time.now");
    if (m < 60) return t("payment.admin_payments.time.minutes_ago", { count: m });
    const h = Math.floor(m / 60);
    if (h < 24) return t("payment.admin_payments.time.hours_ago", { count: h });
    const d = Math.floor(h / 24);
    if (d < 7) return t("payment.admin_payments.time.days_ago", { count: d });
    return new Date(dateStr).toLocaleDateString();
  };
}

export default function AdminPaymentsPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const orderType = (searchParams.get("orderType") as OrderType) || undefined;
  const page = Number(searchParams.get("page") ?? 1);
  const limit = 20;

  const queryClient = useQueryClient();

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["admin-payments-awaiting", { orderType, page, limit }],
    queryFn: () =>
      adminPaymentService.listAwaiting({ orderType, page, limit }),
  });

  const [rejectTarget, setRejectTarget] = useState<ITransaction | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const approveMutation = useMutation({
    mutationFn: (id: string) => adminPaymentService.approve(id),
    onSuccess: () => {
      toast.success(t("payment.admin_payments.approve_success"));
      queryClient.invalidateQueries({ queryKey: ["admin-payments-awaiting"] });
      queryClient.invalidateQueries({
        queryKey: ["admin-notifications-unread-count"],
      });
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? t("payment.admin_payments.error_generic");
      toast.error(msg);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      adminPaymentService.reject(id, reason),
    onSuccess: () => {
      toast.success(t("payment.admin_payments.reject_success"));
      setRejectTarget(null);
      setRejectReason("");
      queryClient.invalidateQueries({ queryKey: ["admin-payments-awaiting"] });
      queryClient.invalidateQueries({
        queryKey: ["admin-notifications-unread-count"],
      });
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? t("payment.admin_payments.error_generic");
      toast.error(msg);
    },
  });

  const items = useMemo(() => data?.items ?? [], [data]);
  const total = data?.total ?? 0;

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div>
          <h1 className="text-2xl font-bold">
            {t("payment.admin_payments.title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("payment.admin_payments.subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={orderType ?? "all"}
            onValueChange={(v) => {
              setSearchParams((prev) => {
                if (v === "all") prev.delete("orderType");
                else prev.set("orderType", v);
                prev.set("page", "1");
                return prev;
              });
            }}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder={t("payment.admin_payments.filter_type")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t("payment.admin_payments.filter_all")}
              </SelectItem>
              <SelectItem value="ADVERTISE">
                {t("payment.admin_payments.type_advertise")}
              </SelectItem>
              <SelectItem value="PROPERTY_PREMIUM">
                {t("payment.admin_payments.type_premium")}
              </SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isFetching}
            title={t("payment.admin_payments.refresh")}
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Inbox className="h-12 w-12 mb-3" />
          <p>{t("payment.admin_payments.empty")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((tx) => (
            <PaymentCard
              key={tx._id}
              tx={tx}
              onApprove={() => approveMutation.mutate(tx._id)}
              onReject={() => setRejectTarget(tx)}
              isApproving={approveMutation.isPending}
            />
          ))}
          <p className="text-xs text-muted-foreground text-right pt-2">
            {t("payment.admin_payments.total", { count: total })}
          </p>
        </div>
      )}

      <Dialog
        open={rejectTarget !== null}
        onOpenChange={(open) => {
          if (!open) {
            setRejectTarget(null);
            setRejectReason("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t("payment.admin_payments.reject_dialog.title")}
            </DialogTitle>
            <DialogDescription>
              {t("payment.admin_payments.reject_dialog.description")}
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder={t("payment.admin_payments.reject_dialog.placeholder")}
            rows={4}
            minLength={3}
            maxLength={500}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectTarget(null);
                setRejectReason("");
              }}
            >
              {t("payment.admin_payments.reject_dialog.cancel")}
            </Button>
            <Button
              variant="destructive"
              disabled={
                rejectReason.trim().length < 3 || rejectMutation.isPending
              }
              onClick={() => {
                if (!rejectTarget) return;
                rejectMutation.mutate({
                  id: rejectTarget._id,
                  reason: rejectReason.trim(),
                });
              }}
            >
              {rejectMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <XCircle className="h-4 w-4 mr-2" />
              )}
              {t("payment.admin_payments.reject_dialog.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface PaymentCardProps {
  tx: ITransaction;
  onApprove: () => void;
  onReject: () => void;
  isApproving: boolean;
}

function PaymentCard({ tx, onApprove, onReject, isApproving }: PaymentCardProps) {
  const { t } = useTranslation();
  const relTime = useRelativeTime();
  const user = typeof tx.user === "object" ? tx.user : null;

  const orderTypeLabel: Record<string, string> = {
    ADVERTISE: t("payment.admin_payments.type_advertise"),
    PROPERTY_PREMIUM: t("payment.admin_payments.type_premium"),
  };

  return (
    <div className="border rounded-lg p-4 bg-card hover:bg-accent/30 transition-colors">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary">
              {orderTypeLabel[tx.orderType] ?? tx.orderType}
            </Badge>
            <Badge variant="outline">{tx.provider}</Badge>
            <span className="text-xs text-muted-foreground">
              {relTime(tx.createdAt)}
            </span>
          </div>
          <div className="mt-2 text-xl font-semibold">
            {formatPrice(tx.amount, { code: tx.currency })}
          </div>
          <div className="text-xs text-muted-foreground mt-1 font-mono break-all">
            tx: {tx._id}
            <br />
            order: {tx.orderId}
          </div>
          {user && (
            <div className="text-sm mt-2">
              <span className="text-muted-foreground">
                {t("payment.admin_payments.user")}
              </span>{" "}
              {user.first_name ?? ""} {user.last_name ?? ""}{" "}
              {user.email ? `(${user.email})` : ""}
              {user.phone ? ` ${user.phone}` : ""}
            </div>
          )}
        </div>
        <div className="flex flex-row md:flex-col gap-2 shrink-0">
          <Button size="sm" onClick={onApprove} disabled={isApproving}>
            {isApproving ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <CheckCircle2 className="h-4 w-4 mr-2" />
            )}
            {t("payment.admin_payments.approve")}
          </Button>
          <Button size="sm" variant="outline" onClick={onReject}>
            <AlertCircle className="h-4 w-4 mr-2" />
            {t("payment.admin_payments.reject")}
          </Button>
        </div>
      </div>
    </div>
  );
}
