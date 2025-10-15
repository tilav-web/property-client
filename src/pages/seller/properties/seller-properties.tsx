import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import type { IProperty } from "@/interfaces/property.interface";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import PropertyCard from "@/components/common/cards/property-card";
import { useQuery } from "@tanstack/react-query";
import { propertyService } from "@/services/property.service";
import { useTranslation } from "react-i18next";

export default function SellerProperties() {
  const { t } = useTranslation();
  const {
    data: properties,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["properties/my"],
    queryFn: async () => {
      const data = await propertyService.findMyProperties();
      return data;
    },
  });

  const navigate = useNavigate();
  // Yangi property yaratish sahifasiga o'tish
  const handleCreateProperty = () => {
    navigate("/seller/properties/create");
  };

  // Loading holati
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{t("pages.seller_properties_page.my_properties")}</h1>
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
          <h1 className="text-2xl font-bold">{t("pages.seller_properties_page.my_properties")}</h1>
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
            {t("pages.seller_properties_page.total_properties", { count: properties.length })}
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
      {properties.length === 0 ? (
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
              {t("pages.seller_properties_page.you_have_not_added_any_properties_yet")}
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
        <div className="grid grid-cols-1 gap-6">
          {properties.map((property: IProperty) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}
