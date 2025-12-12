import { useNavigate } from "react-router-dom";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { propertyService } from "@/services/property.service";
import { useTranslation } from "react-i18next";
import type { PropertyType } from "@/interfaces/property/property.interface";
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
import { useState } from "react";
import { toast } from "sonner";
import { useLanguageStore } from "@/stores/language.store";
import SellerPropertyCard from "./_components/seller-property-card";

export default function SellerProperties() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { language } = useLanguageStore();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // Har sahifadagi elementlar soni

  // API so'rovi
  const { data, isLoading, error } = useQuery({
    queryKey: ["properties/my", currentPage, pageSize, language],
    queryFn: async () => {
      const data = await propertyService.findMyProperties({
        page: currentPage,
        limit: pageSize,
      });
      return data;
    },
  });

  // Delete uchun state'lar
  const [openAlertDialog, setOpenAlertDialog] = useState(false);
  const [deleteSelectedPropertyId, setDeleteSelectedPropertyId] = useState<
    string | null
  >(null);

  const handleSelectPropertyToDelete = (propertyId: string) => {
    setDeleteSelectedPropertyId(propertyId);
    setOpenAlertDialog(true);
  };

  // Yangi property yaratish sahifasiga o'tish
  const handleCreateProperty = () => {
    navigate("/seller/properties/create");
  };

  // Delete mutation
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

  // Sahifalash funksiyalari
  const handleNextPage = () => {
    if (data && currentPage < data.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Loading holati
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {t("pages.seller_properties_page.my_properties")}
          </h1>
          <Button disabled>
            <Plus className="w-4 h-4 mr-2" />
            {t("pages.seller_properties_page.loading")}
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} className="h-80 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  // Xatolik holati
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {t("pages.seller_properties_page.my_properties")}
          </h1>
          <Button onClick={handleCreateProperty}>
            <Plus className="w-4 h-4 mr-2" />
            {t("pages.seller_properties_page.new_property")}
          </Button>
        </div>
        <div className="text-center py-12">
          <p className="text-red-500 text-lg">{error.message}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            {t("pages.seller_properties_page.reload")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Sarlavha va yangi property tugmasi */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {t("pages.seller_properties_page.my_properties")}
          </h1>
          <p className="text-gray-600 mt-2">
            {t("pages.seller_properties_page.total_properties", {
              count: data.totalItems,
            })}
          </p>
        </div>
        <Button
          onClick={handleCreateProperty}
          className="bg-blue-600 hover:bg-blue-700 text-white"
          size="lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          {t("pages.seller_properties_page.new_property")}
        </Button>
      </div>

      {/* Propertylar ro'yxati */}
      {data.properties.length === 0 ? (
        // Propertylar bo'lmaganda
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t("pages.seller_properties_page.no_properties_found")}
            </h3>
            <p className="text-gray-600 mb-6">
              {t(
                "pages.seller_properties_page.you_have_not_added_any_properties_yet"
              )}
            </p>
            <Button
              onClick={handleCreateProperty}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t("pages.seller_properties_page.add_first_property")}
            </Button>
          </div>
        </div>
      ) : (
        // Propertylar mavjud bo'lganda
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {data.properties.map((property: PropertyType) => (
              <SellerPropertyCard
                key={property._id}
                property={property}
                handleSelectPropertyToDelete={handleSelectPropertyToDelete}
              />
            ))}
          </div>

          {/* Pagination komponenti */}
          {data.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t">
              <div className="flex items-center gap-2">
                {/* Oldingi sahifa tugmasi */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{t("pages.seller_properties_page.previous")}</span>
                </Button>

                {/* Sahifa raqamlari */}
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
                          className="w-10 h-10"
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    }
                  )}

                  {data.totalPages > 5 && currentPage < data.totalPages - 2 && (
                    <>
                      <span className="px-2">...</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-10 h-10"
                        onClick={() => handlePageChange(data.totalPages)}
                      >
                        {data.totalPages}
                      </Button>
                    </>
                  )}
                </div>

                {/* Keyingi sahifa tugmasi */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage === data.totalPages}
                  className="flex items-center gap-1"
                >
                  <span>{t("pages.seller_properties_page.next")}</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Delete confirmation dialog */}
      <AlertDialog open={openAlertDialog} onOpenChange={setOpenAlertDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("pages.seller_properties_page.delete_confirmation_title")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t(
                "pages.seller_properties_page.delete_confirmation_description"
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t("pages.seller_properties_page.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteSelectedPropertyId) {
                  removeMutation.mutate(deleteSelectedPropertyId);
                  setOpenAlertDialog(false);
                  setDeleteSelectedPropertyId(null);
                  return;
                }
                toast.error(
                  t("pages.seller_properties_page.no_property_selected")
                );
              }}
            >
              {t("pages.seller_properties_page.continue")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
