import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
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
import { EditPropertyForm } from "./components/edit-property-form";
import { type IProperty } from "@/interfaces/property/property.interface";
import { adminPropertyService } from "../../_services/admin-property.service";
import { DataTable } from "@/components/common/data-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import {
  propertyStatuses,
  type PropertyStatusType,
} from "@/interfaces/types/property.status.type";
import {
  categories,
  type CategoryType,
} from "@/interfaces/types/category.type";

const DEFAULT_LIMIT = 10;

export default function AdminProperties() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? DEFAULT_LIMIT);
  const searchQuery = searchParams.get("search") || "";
  const status = (searchParams.get("status") as PropertyStatusType) || undefined;
  const category = (searchParams.get("category") as CategoryType) || undefined;

  const [searchInput, setSearchInput] = useState(searchQuery);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<IProperty | null>(
    null
  );

  const { data, isLoading } = useQuery({
    queryKey: [
      "admin-properties",
      page,
      limit,
      searchQuery,
      status,
      category,
    ],
    queryFn: () =>
      adminPropertyService.getProperties({
        page,
        limit,
        search: searchQuery || undefined,
        status,
        category,
      }),
  });

  const openEditModal = (property: IProperty) => {
    setSelectedProperty(property);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedProperty(null);
    queryClient.invalidateQueries({ queryKey: ["admin-properties"] });
  };

  const columns = getColumns(openEditModal);

  const applySearch = () => {
    setSearchParams({
      page: "1",
      limit: limit.toString(),
      search: searchInput,
      ...(status && { status }),
      ...(category && { category }),
    });
  };

  const changePage = (newPage: number) => {
    setSearchParams({
      page: newPage.toString(),
      limit: limit.toString(),
      ...(searchQuery && { search: searchQuery }),
      ...(status && { status }),
      ...(category && { category }),
    });
  };

  const onStatusChange = (value: string) => {
    setSearchParams({
      page: "1",
      limit: limit.toString(),
      ...(value !== "all" && { status: value }),
      ...(searchQuery && { search: searchQuery }),
      ...(category && { category }),
    });
  };

  const onCategoryChange = (value: string) => {
    setSearchParams({
      page: "1",
      limit: limit.toString(),
      ...(value !== "all" && { category: value }),
      ...(searchQuery && { search: searchQuery }),
      ...(status && { status }),
    });
  };


  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Properties</h1>
      </div>
      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={applySearch}>
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
        <Select
          onValueChange={onStatusChange}
          value={status}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {propertyStatuses.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          onValueChange={onCategoryChange}
          value={category}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <DataTable
        columns={columns}
        data={data?.properties || []}
        isLoading={isLoading}
        page={page}
        limit={limit}
        total={data?.total || 0}
        hasMore={data?.hasMore || false}
        setPage={changePage}
      />
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Property</DialogTitle>
          </DialogHeader>
          {selectedProperty && (
            <EditPropertyForm
              property={selectedProperty}
              onSuccess={closeEditModal}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
