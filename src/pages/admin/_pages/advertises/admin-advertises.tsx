import * as React from "react";
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
import { type SortingState } from "@tanstack/react-table";
import { useState } from "react";

const DEFAULT_LIMIT = 10;

export default function AdminAdvertises() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? DEFAULT_LIMIT);
  const status = (searchParams.get("status") as AdvertiseStatus) || undefined;
  const type = (searchParams.get("type") as AdvertiseType) || undefined;
  const payment_status =
    (searchParams.get("payment_status") as PaymentStatus) || undefined;
  const sort_by = searchParams.get("sort_by");
  const sort_order = searchParams.get("sort_order");

  const [sorting, setSorting] = useState<SortingState>(() => {
    if (sort_by && sort_order) {
      return [{ id: sort_by, desc: sort_order === "desc" }];
    }
    return [];
  });

  const sort = React.useMemo(() => {
    if (sorting.length > 0) {
      const { id, desc } = sorting[0];
      return { [id]: desc ? -1 : 1 };
    }
    return undefined;
  }, [sorting]);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-advertises", page, limit, status, type, payment_status, sort],
    queryFn: () =>
      adminAdvertiseService.getAdvertises({
        page,
        limit,
        status,
        type,
        payment_status,
        sort,
      }),
  });

  const handleSortingChange = (updater: React.SetStateAction<SortingState>) => {
    setSorting(updater);
    const newSorting = typeof updater === 'function' ? updater(sorting) : updater;

    if (newSorting.length > 0) {
      const { id, desc } = newSorting[0];
      setSearchParams(prev => {
        prev.set("sort_by", id);
        prev.set("sort_order", desc ? "desc" : "asc");
        prev.set("page", "1");
        return prev;
      });
    } else {
      setSearchParams(prev => {
        prev.delete("sort_by");
        prev.delete("sort_order");
        return prev;
      });
    }
  };

  const changePage = (newPage: number) => {
    setSearchParams(prev => {
      prev.set("page", newPage.toString());
      return prev;
    });
  };

  const onStatusChange = (value: string) => {
    setSearchParams(prev => {
      prev.set("page", "1");
      if (value !== "all") prev.set("status", value); else prev.delete("status");
      return prev;
    });
  };

  const onTypeChange = (value: string) => {
    setSearchParams(prev => {
      prev.set("page", "1");
      if (value !== "all") prev.set("type", value); else prev.delete("type");
      return prev;
    });
  };

  const onPaymentStatusChange = (value: string) => {
    setSearchParams(prev => {
      prev.set("page", "1");
      if (value !== "all") prev.set("payment_status", value); else prev.delete("payment_status");
      return prev;
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
        sorting={sorting}
        onSortingChange={handleSortingChange}
      />
    </div>
  );
}
