import AsideAds from "@/components/common/ads/aside-ads";
import BannerAds from "@/components/common/ads/banner-ads";
import ApartmentSaleCard from "@/components/common/cards/property/cards/categories/apartment-sale-card";
import type { IApartmentSale } from "@/interfaces/property/categories/apartment-sale.interface";
import { propertyService } from "@/services/property.service";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

export default function MainLayoutBlock() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["main-page-layout", 6],
    queryFn: () =>
      propertyService.findAll({ limit: 6, category: "APARTMENT_SALE" }),
  });
  const { t } = useTranslation();

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <div className="flex items-stretch gap-4 mb-4 flex-col md:flex-row mt-4">
        <div className="flex-1 flex flex-col gap-4">
          {data.properties?.slice(0, 3).map((apartment: IApartmentSale) => (
            <ApartmentSaleCard apartment={apartment} key={apartment._id} />
          ))}
        </div>
        <AsideAds />
      </div>
      <BannerAds />

      <div className="flex items-stretch gap-4 mb-4 flex-col md:flex-row mt-4">
        <div className="flex-1 flex flex-col gap-4">
          {data.properties?.slice(3).map((apartment: IApartmentSale) => (
            <ApartmentSaleCard apartment={apartment} key={apartment._id} />
          ))}
        </div>
        <AsideAds />
      </div>
      <BannerAds />

      {!isLoading && !data?.properties?.length && (
        <div className="text-center py-10">
          <h2 className="text-2xl font-semibold mb-4">
            {t("pages.main_page.no_results_title")}
          </h2>
          <p className="text-gray-600">
            {t("pages.main_page.no_results_subtitle")}
          </p>
        </div>
      )}
    </>
  );
}
