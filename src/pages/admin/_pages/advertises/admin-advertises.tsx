import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { columns } from "./components/columns"; // Changed to import columns constant
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  advertiseStatuses,
  type AdvertiseStatus,
  advertiseTypes,
  type AdvertiseType,
  paymentStatuses,
  type PaymentStatus,
} from "@/interfaces/advertise/advertise.interface";
import { adminAdvertiseService } from "../../_services/admin-advertise.service";
import { DataTable } from "@/components/common/data-table";

const DEFAULT_LIMIT = 10;

export default function AdminAdvertises() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? DEFAULT_LIMIT);
  const status = (searchParams.get("status") as AdvertiseStatus) || undefined;
  const type = (searchParams.get("type") as AdvertiseType) || undefined;
  const payment_status =
    (searchParams.get("payment_status") as PaymentStatus) || undefined;

  const { data, isLoading } = useQuery({
    queryKey: ["admin-advertises", page, limit, status, type, payment_status],
    queryFn: () =>
      adminAdvertiseService.getAdvertises({
        page,
        limit,
        status,
        type,
        payment_status,
      }),
  });

  const changePage = (newPage: number) => {
    setSearchParams({
      page: newPage.toString(),
      limit: limit.toString(),
      ...(status && { status }),
      ...(type && { type }),
      ...(payment_status && { payment_status }),
    });
  };

  const onStatusChange = (value: string) => {
    setSearchParams({
      page: "1",
      limit: limit.toString(),
      ...(value !== "all" && { status: value }),
      ...(type && { type }),
      ...(payment_status && { payment_status }),
    });
  };

  const onTypeChange = (value: string) => {
    setSearchParams({
      page: "1",
      limit: limit.toString(),
      ...(value !== "all" && { type: value }),
      ...(status && { status }),
      ...(payment_status && { payment_status }),
    });
  };

  const onPaymentStatusChange = (value: string) => {
    setSearchParams({
      page: "1",
      limit: limit.toString(),
      ...(value !== "all" && { payment_status: value }),
      ...(status && { status }),
      ...(type && { type }),
    });
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Advertisements</h1>
      </div>
      <div className="flex gap-4 mb-4">
        <Select onValueChange={onStatusChange} value={status}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {advertiseStatuses.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={onTypeChange} value={type}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {advertiseTypes.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={onPaymentStatusChange} value={payment_status}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Payment Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payment Statuses</SelectItem>
            {paymentStatuses.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <DataTable
        columns={columns}
        data={data?.advertises || []}
        isLoading={isLoading}
        page={page}
        limit={limit}
        total={data?.total || 0}
        hasMore={data?.hasMore || false}
        setPage={changePage}
      />
    </div>
  );
}
