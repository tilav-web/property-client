import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { CreditCard, Inbox, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  OrderType,
  type ITransaction,
} from "@/interfaces/payment/payment.interface";
import { paymentService } from "@/services/payment.service";
import { formatPrice } from "@/utils/format-price";

async function openCheckout(txId: string, errorLabel: string) {
  try {
    const { checkoutUrl } = await paymentService.getCheckoutUrl(txId);
    window.open(checkoutUrl, "_blank", "noopener,noreferrer");
  } catch (err) {
    console.error("checkout url failed", err);
    toast.error(errorLabel);
  }
}

function formatDate(d: string): string {
  return new Date(d).toLocaleString();
}

export default function SellerTransactionsPage() {
  const { t } = useTranslation();
  const [orderType, setOrderType] = useState<OrderType | undefined>(undefined);

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["my-transactions", { orderType }],
    queryFn: () => paymentService.listMy({ orderType, page: 1, limit: 50 }),
  });

  const items = useMemo(() => data?.items ?? [], [data]);

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">
            {t("payment.transactions.title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("payment.transactions.subtitle")}
          </p>
        </div>
        <div className="flex gap-2">
          <Select
            value={orderType ?? "all"}
            onValueChange={(v) =>
              setOrderType(v === "all" ? undefined : (v as OrderType))
            }
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder={t("payment.transactions.filter_type")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t("payment.transactions.filter_all")}
              </SelectItem>
              <SelectItem value="PROPERTY_PREMIUM">
                {t("payment.transactions.type_premium")}
              </SelectItem>
              <SelectItem value="ADVERTISE">
                {t("payment.transactions.type_advertise")}
              </SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>

      {renderList({ isLoading, items, emptyLabel: t("payment.transactions.empty") })}
    </div>
  );
}

function renderList({
  isLoading,
  items,
  emptyLabel,
}: {
  isLoading: boolean;
  items: ITransaction[];
  emptyLabel: string;
}) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <Inbox className="h-12 w-12 mb-3" />
        <p>{emptyLabel}</p>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {items.map((tx) => (
        <TransactionRow key={tx._id} tx={tx} />
      ))}
    </div>
  );
}

function TransactionRow({ tx }: { readonly tx: ITransaction }) {
  const { t } = useTranslation();

  const statusVariant: Record<string, { label: string; className: string }> = {
    PENDING: {
      label: t("payment.transactions.status.pending"),
      className: "bg-yellow-100 text-yellow-800",
    },
    SUCCESS: {
      label: t("payment.transactions.status.success"),
      className: "bg-green-100 text-green-800",
    },
    FAILED: {
      label: t("payment.transactions.status.failed"),
      className: "bg-red-100 text-red-800",
    },
    CANCELLED: {
      label: t("payment.transactions.status.cancelled"),
      className: "bg-gray-100 text-gray-800",
    },
  };

  const approvalLabel: Record<string, string> = {
    NOT_APPLICABLE: "—",
    AWAITING: t("payment.transactions.approval.awaiting"),
    APPROVED: t("payment.transactions.approval.approved"),
    REJECTED: t("payment.transactions.approval.rejected"),
  };

  const orderTypeLabel: Record<string, string> = {
    ADVERTISE: t("payment.transactions.type_advertise"),
    PROPERTY_PREMIUM: t("payment.transactions.type_premium"),
  };

  const variant = statusVariant[tx.status];
  const canPay = tx.status === "PENDING" && tx.provider === "PAYME";

  const handlePay = () =>
    openCheckout(
      tx._id,
      t("payment.transactions.pay_error", {
        defaultValue: "Checkout URL olishda xatolik",
      }),
    );

  return (
    <div className="border rounded-lg p-4 bg-card">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary">
              {orderTypeLabel[tx.orderType] ?? tx.orderType}
            </Badge>
            <Badge className={variant.className}>{variant.label}</Badge>
            {tx.status === "SUCCESS" &&
              tx.adminApprovalStatus !== "NOT_APPLICABLE" && (
                <Badge variant="outline">
                  {approvalLabel[tx.adminApprovalStatus]}
                </Badge>
              )}
            <Badge variant="outline">{tx.provider}</Badge>
          </div>
          <div className="mt-2 text-xl font-semibold">
            {formatPrice(tx.amount, tx.currency)}
          </div>
          {tx.adminRejectReason && (
            <div className="mt-2 text-sm text-red-600">
              {t("payment.transactions.reason")}: {tx.adminRejectReason}
            </div>
          )}
          <div className="text-xs text-muted-foreground mt-2">
            {formatDate(tx.createdAt)}
          </div>
        </div>
        {canPay && (
          <Button
            onClick={handlePay}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 sm:self-center"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            {t("payment.transactions.pay", { defaultValue: "To'lov qilish" })}
          </Button>
        )}
      </div>
    </div>
  );
}
