import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Inbox, Loader2, RefreshCw } from "lucide-react";
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
  AdminApprovalStatus,
  OrderType,
  PaymentStatus,
  type ITransaction,
} from "@/interfaces/payment/payment.interface";
import { paymentService } from "@/services/payment.service";
import { formatPrice } from "@/utils/format-price";

const ORDER_TYPE_LABEL: Record<OrderType, string> = {
  ADVERTISE: "Reklama",
  PROPERTY_PREMIUM: "E'lon premium",
};

const STATUS_VARIANT: Record<
  PaymentStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Kutilmoqda",
    className: "bg-yellow-100 text-yellow-800",
  },
  SUCCESS: { label: "To'langan", className: "bg-green-100 text-green-800" },
  FAILED: { label: "Xato", className: "bg-red-100 text-red-800" },
  CANCELLED: { label: "Bekor qilingan", className: "bg-gray-100 text-gray-800" },
};

const APPROVAL_LABEL: Record<AdminApprovalStatus, string> = {
  NOT_APPLICABLE: "—",
  AWAITING: "Admin tasdig'i kutilmoqda",
  APPROVED: "Admin tasdiqladi",
  REJECTED: "Admin rad etdi",
};

function formatDate(d: string): string {
  return new Date(d).toLocaleString();
}

export default function SellerTransactionsPage() {
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
          <h1 className="text-2xl font-bold">Mening to'lovlarim</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Premium upgrade va reklama to'lovlari tarixi.
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
              <SelectValue placeholder="Turi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Hammasi</SelectItem>
              <SelectItem value="PROPERTY_PREMIUM">E'lon premium</SelectItem>
              <SelectItem value="ADVERTISE">Reklama</SelectItem>
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

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Inbox className="h-12 w-12 mb-3" />
          <p>To'lovlar topilmadi</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((tx) => (
            <TransactionRow key={tx._id} tx={tx} />
          ))}
        </div>
      )}
    </div>
  );
}

function TransactionRow({ tx }: { tx: ITransaction }) {
  const statusVariant = STATUS_VARIANT[tx.status];
  return (
    <div className="border rounded-lg p-4 bg-card">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary">
              {ORDER_TYPE_LABEL[tx.orderType] ?? tx.orderType}
            </Badge>
            <Badge className={statusVariant.className}>
              {statusVariant.label}
            </Badge>
            {tx.status === "SUCCESS" && tx.adminApprovalStatus !== "NOT_APPLICABLE" && (
              <Badge variant="outline">
                {APPROVAL_LABEL[tx.adminApprovalStatus]}
              </Badge>
            )}
            <Badge variant="outline">{tx.provider}</Badge>
          </div>
          <div className="mt-2 text-xl font-semibold">
            {formatPrice(tx.amount, { code: tx.currency })}
          </div>
          {tx.adminRejectReason && (
            <div className="mt-2 text-sm text-red-600">
              Sabab: {tx.adminRejectReason}
            </div>
          )}
          <div className="text-xs text-muted-foreground mt-2">
            {formatDate(tx.createdAt)}
          </div>
        </div>
      </div>
    </div>
  );
}
