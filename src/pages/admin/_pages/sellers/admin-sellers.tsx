import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getColumns } from "./components/columns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EditSellerForm } from "./components/edit-seller-form";
import {
  type ISeller,
  sellerBusinessTypes,
  sellerStatuses,
  type SellerStatus,
  type SellerBusinessType,
} from "@/interfaces/users/seller.interface";
import { adminSellerService } from "../../_services/admin-seller.service";
import { DataTable } from "@/components/common/data-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import type { SortingState } from "@tanstack/react-table";

const DEFAULT_LIMIT = 10;

export default function AdminSellers() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sorting, setSorting] = useState<SortingState>([]);

  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? DEFAULT_LIMIT);
  const searchQuery = searchParams.get("search") || "";
  const status = (searchParams.get("status") as SellerStatus) || undefined;
  const business_type =
    (searchParams.get("business_type") as SellerBusinessType) || undefined;

  const [searchInput, setSearchInput] = useState(searchQuery);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState<ISeller | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: [
      "admin-sellers",
      page,
      limit,
      searchQuery,
      status,
      business_type,
    ],
    queryFn: () =>
      adminSellerService.getSellers({
        page,
        limit,
        search: searchQuery || undefined,
        status,
        business_type,
      }),
  });

  const openEditModal = (seller: ISeller) => {
    setSelectedSeller(seller);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedSeller(null);
    queryClient.invalidateQueries({ queryKey: ["admin-sellers"] });
  };

  const navigate = useNavigate();
  const columns = getColumns(openEditModal, navigate);

  const applySearch = () => {
    setSearchParams({
      page: "1",
      limit: limit.toString(),
      search: searchInput,
      ...(status && { status }),
      ...(business_type && { business_type }),
    });
  };

  const changePage = (newPage: number) => {
    setSearchParams({
      page: newPage.toString(),
      limit: limit.toString(),
      ...(searchQuery && { search: searchQuery }),
      ...(status && { status }),
      ...(business_type && { business_type }),
    });
  };

  const onStatusChange = (value: string) => {
    setSearchParams({
      page: "1",
      limit: limit.toString(),
      ...(value !== "all" && { status: value }),
      ...(searchQuery && { search: searchQuery }),
      ...(business_type && { business_type }),
    });
  };

  const onBusinessTypeChange = (value: string) => {
    setSearchParams({
      page: "1",
      limit: limit.toString(),
      ...(value !== "all" && { business_type: value }),
      ...(searchQuery && { search: searchQuery }),
      ...(status && { status }),
    });
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Sellers</h1>
      </div>
      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Search by user details..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={applySearch}>
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
        <Select onValueChange={onStatusChange} value={status}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {sellerStatuses.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={onBusinessTypeChange} value={business_type}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Business Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {sellerBusinessTypes.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <DataTable
        columns={columns}
        data={data?.sellers || []}
        isLoading={isLoading}
        page={page}
        limit={limit}
        total={data?.total || 0}
        hasMore={data?.hasMore || false}
        setPage={changePage}
        sorting={sorting}
        onSortingChange={setSorting}
      />
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Seller</DialogTitle>
          </DialogHeader>
          {selectedSeller && (
            <EditSellerForm
              seller={selectedSeller}
              onSuccess={closeEditModal}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
