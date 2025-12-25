import { type ColumnDef } from "@tanstack/react-table";
import { type IAdminAdvertise } from "@/pages/admin/_services/admin-advertise.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { serverUrl } from "@/utils/shared";
import { AdvertiseStatusUpdater } from "./advertise-status-updater";
import { AdvertisePaymentStatusUpdater } from "./advertise-payment-status-updater";

export const columns: ColumnDef<IAdminAdvertise>[] = [
  {
    accessorKey: "author",
    header: "Author",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src={`${serverUrl}/${row.original.author.avatar}`} />
          <AvatarFallback>{row.original.author.first_name?.[0]}</AvatarFallback>
        </Avatar>
        <div>
          {row.original.author.first_name} {row.original.author.last_name}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "target",
    header: "Target Property",
    cell: ({ row }) => (
      <div>{(row.original.target?.title as any)?.en || "N/A"}</div>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <AdvertiseStatusUpdater id={row.original._id} currentStatus={row.original.status} />
    ),
  },
  {
    accessorKey: "payment_status",
    header: "Payment Status",
    cell: ({ row }) => (
      <AdvertisePaymentStatusUpdater
        id={row.original._id}
        currentPaymentStatus={row.original.payment_status}
      />
    ),
  },
  {
    accessorKey: "days",
    header: "Days",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => (
      <div>
        {row.original.price} {row.original.currency}
      </div>
    ),
  },
];



