import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { advertiseService } from "@/services/advertise.service";
import AdvertiseCard from "@/components/common/cards/advertise-card";
import type { IAdvertise } from "@/interfaces/advertise.interface";

export default function SellerAdvertise() {
  const { t } = useTranslation();
  const {
    data: advertises,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["advertises/my"],
    queryFn: async () => {
      const data = await advertiseService.findMy();
      return data;
    },
  });

  const navigate = useNavigate();
  // Yangi advertise yaratish sahifasiga o'tish
  const handleCreateAdvertise = () => {
    navigate("/seller/advertise/create");
  };

  // Loading holati
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {t("pages.seller_advertises_page.my_advertises")}
          </h1>
          <Button disabled>
            <Plus className="w-4 h-4 mr-2" />
            {t("pages.seller_advertises_page.loading")}
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
            {t("pages.seller_advertises_page.my_advertises")}
          </h1>
          <Button onClick={handleCreateAdvertise}>
            <Plus className="w-4 h-4 mr-2" />
            {t("pages.seller_advertises_page.new_advertise")}
          </Button>
        </div>
        <div className="text-center py-12">
          <p className="text-red-500 text-lg">{error.message}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            {t("pages.seller_advertises_page.reload")}
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
            {t("pages.seller_advertises_page.my_advertises")}
          </h1>
          <p className="text-gray-600 mt-2">
            {t("pages.seller_advertises_page.total_edvertise", {
              count: advertises.length,
            })}
          </p>
        </div>
        <Button
          onClick={handleCreateAdvertise}
          className="bg-blue-600 hover:bg-blue-700 text-white"
          size="lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          {t("pages.seller_advertises_page.new_advertise")}
        </Button>
      </div>

      {/* Propertylar ro'yxati */}
      {advertises.length === 0 ? (
        // Propertylar bo'lmaganda
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t("pages.seller_advertises_page.no_advertises_found")}
            </h3>
            <p className="text-gray-600 mb-6">
              {t(
                "pages.seller_advertises_page.you_have_not_added_any_advertises_yet"
              )}
            </p>
            <Button
              onClick={handleCreateAdvertise}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t("pages.seller_advertises_page.add_first_property")}
            </Button>
          </div>
        </div>
      ) : (
        // Propertylar mavjud bo'lganda
        <div className="grid grid-cols-3 gap-6">
          {advertises.map((advertise: IAdvertise) => (
            <AdvertiseCard key={advertise?._id} advertise={advertise} />
          ))}
        </div>
      )}
    </div>
  );
}
