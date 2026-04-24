import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Home,
  Search,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { propertyService } from "@/services/property.service";
import { useLanguageStore } from "@/stores/language.store";
import type { PropertyType } from "@/interfaces/property/property.interface";
import SellerPropertyCard from "./_components/seller-property-card";
import { cn } from "@/lib/utils";

type StatusFilter = "all" | "APPROVED" | "PENDING" | "REJECTED";

export default function SellerProperties() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { language } = useLanguageStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const { data, isLoading, error } = useQuery({
    queryKey: ["properties/my", currentPage, pageSize, language],
    queryFn: async () => {
      return propertyService.findMyProperties({
        page: currentPage,
        limit: pageSize,
      });
    },
  });

  const [openAlertDialog, setOpenAlertDialog] = useState(false);
  const [deleteSelectedPropertyId, setDeleteSelectedPropertyId] = useState<
    string | null
  >(null);

  const handleSelectPropertyToDelete = (propertyId: string) => {
    setDeleteSelectedPropertyId(propertyId);
    setOpenAlertDialog(true);
  };

  const handleCreateProperty = () => navigate("/seller/properties/create");

  const removeMutation = useMutation({
    mutationFn: (id: string) => propertyService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties/my"] });
      toast.success(t("pages.seller_properties_page.delete_success"));
    },
    onError: () => {
      toast.error(t("pages.seller_properties_page.delete_error"));
    },
  });

  const handleNextPage = () => {
    if (data && currentPage < data.totalPages) setCurrentPage(currentPage + 1);
  };
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const handlePageChange = (page: number) => setCurrentPage(page);

  // Client-side qo'shimcha filter (status, search) — backend yuklangan bo'lakdan
  const filtered = (data?.properties ?? []).filter((p: PropertyType) => {
    const titleStr =
      typeof p.title === "string"
        ? p.title
        : ((p.title as Record<string, string> | undefined)?.[language] ??
          (p.title as Record<string, string> | undefined)?.en ??
          "");
    const matchesSearch =
      !search.trim() ||
      titleStr.toLowerCase().includes(search.toLowerCase().trim());
    const matchesStatus =
      statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts: Record<string, number> = {};
  for (const p of (data?.properties ?? []) as PropertyType[]) {
    statusCounts[p.status] = (statusCounts[p.status] ?? 0) + 1;
  }

  const statusOptions: {
    key: StatusFilter;
    label: string;
    color: string;
  }[] = [
    {
      key: "all",
      label: t("pages.seller_properties_page.status_all", {
        defaultValue: "All",
      }),
      color: "bg-gray-100 text-gray-700",
    },
    {
      key: "APPROVED",
      label: t("pages.seller_properties_page.status_approved", {
        defaultValue: "Approved",
      }),
      color: "bg-green-100 text-green-700",
    },
    {
      key: "PENDING",
      label: t("pages.seller_properties_page.status_pending", {
        defaultValue: "Pending",
      }),
      color: "bg-amber-100 text-amber-700",
    },
    {
      key: "REJECTED",
      label: t("pages.seller_properties_page.status_rejected", {
        defaultValue: "Rejected",
      }),
      color: "bg-red-100 text-red-700",
    },
  ];

  const Header = (
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          {t("pages.seller_properties_page.my_properties")}
        </h1>
        <p className="text-gray-600 mt-1 text-sm">
          {t("pages.seller_properties_page.total_properties", {
            count: data?.totalItems ?? 0,
          })}
        </p>
      </div>
      <Button
        onClick={handleCreateProperty}
        className="bg-blue-600 hover:bg-blue-700 text-white self-start lg:self-auto"
        size="lg"
      >
        <Plus className="w-5 h-5 mr-1" />
        {t("pages.seller_properties_page.new_property")}
      </Button>
    </div>
  );

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        {Header}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-80 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        {Header}
        <div className="text-center py-12 bg-white rounded-xl border">
          <p className="text-red-600 text-lg">{error.message}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            {t("pages.seller_properties_page.reload")}
          </Button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="max-w-7xl mx-auto">
      {Header}

      {/* Filter bar */}
      {data.properties.length > 0 && (
        <div className="mb-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <Input
              placeholder={t("pages.seller_properties_page.search", {
                defaultValue: "Search by title...",
              })}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {statusOptions.map((opt) => {
              const active = statusFilter === opt.key;
              const count =
                opt.key === "all"
                  ? data.properties.length
                  : statusCounts[opt.key] ?? 0;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setStatusFilter(opt.key)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                    active
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50",
                  )}
                >
                  {opt.key === "all" && <Filter size={12} />}
                  {opt.label}
                  <span
                    className={cn(
                      "ml-0.5 rounded-full px-1.5 py-px text-[10px]",
                      active ? "bg-white/20" : opt.color,
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Property list */}
      {data.properties.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Home className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t("pages.seller_properties_page.no_properties_found")}
            </h3>
            <p className="text-gray-600 mb-6">
              {t(
                "pages.seller_properties_page.you_have_not_added_any_properties_yet",
              )}
            </p>
            <Button
              onClick={handleCreateProperty}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-1" />
              {t("pages.seller_properties_page.add_first_property")}
            </Button>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed">
          <Search className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-2 text-sm text-gray-500">
            {t("pages.seller_properties_page.no_results", {
              defaultValue: "No properties match your filter",
            })}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {filtered.map((property: PropertyType) => (
              <SellerPropertyCard
                key={property._id}
                property={property}
                handleSelectPropertyToDelete={handleSelectPropertyToDelete}
              />
            ))}
          </div>

          {data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline ml-1">
                  {t("pages.seller_properties_page.previous")}
                </span>
              </Button>

              <div className="flex items-center gap-1">
                {Array.from(
                  { length: Math.min(5, data.totalPages) },
                  (_, i) => {
                    let pageNum;
                    if (data.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= data.totalPages - 2) {
                      pageNum = data.totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <Button
                        key={pageNum}
                        variant={
                          currentPage === pageNum ? "default" : "outline"
                        }
                        size="sm"
                        className="w-9 h-9 p-0"
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  },
                )}

                {data.totalPages > 5 &&
                  currentPage < data.totalPages - 2 && (
                    <>
                      <span className="px-1 text-gray-400">...</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-9 h-9 p-0"
                        onClick={() => handlePageChange(data.totalPages)}
                      >
                        {data.totalPages}
                      </Button>
                    </>
                  )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage === data.totalPages}
              >
                <span className="hidden sm:inline mr-1">
                  {t("pages.seller_properties_page.next")}
                </span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      )}

      <AlertDialog open={openAlertDialog} onOpenChange={setOpenAlertDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("pages.seller_properties_page.delete_confirmation_title")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t(
                "pages.seller_properties_page.delete_confirmation_description",
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteSelectedPropertyId) {
                  removeMutation.mutate(deleteSelectedPropertyId);
                  setOpenAlertDialog(false);
                  setDeleteSelectedPropertyId(null);
                  return;
                }
                toast.error(
                  t("pages.seller_properties_page.no_property_selected"),
                );
              }}
            >
              {t("common.continue")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
