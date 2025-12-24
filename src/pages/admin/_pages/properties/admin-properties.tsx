import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import { useDebounce } from "use-debounce";
import { adminPropertyService } from "../../_services/admin-property.service";
import { DataTable } from "@/components/common/data-table";
import { Input } from "@/components/ui/input";
import {
  propertyStatuses,
  type PropertyStatusType,
} from "@/interfaces/types/property.status.type";
import {
  categories,
  type CategoryType,
} from "@/interfaces/types/category.type";

export default function AdminProperties() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<PropertyStatusType | "">("");
  const [category, setCategory] = useState<CategoryType | "">("");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<IProperty | null>(
    null
  );

  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useQuery({
    queryKey: [
      "admin-properties",
      page,
      limit,
      debouncedSearch,
      status,
      category,
    ],
    queryFn: () =>
      adminPropertyService.getProperties({
        page,
        limit,
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(status && { status }),
        ...(category && { category }),
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

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Properties</h1>
      </div>
      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select
          onValueChange={(value) => setStatus(value === 'all' ? '' : (value as PropertyStatusType))}
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
          onValueChange={(value) => setCategory(value === 'all' ? '' : (value as CategoryType))}
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
        setPage={setPage}
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
