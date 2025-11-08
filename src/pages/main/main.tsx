import HeroSection from "@/components/common/hero-section";
import PropertyCard from "@/components/common/cards/property-card";
import { useTranslation } from "react-i18next";
import { mainImage } from "@/utils/shared";
import { useQuery } from "@tanstack/react-query";
import type {
  IProperty,
  PropertyCategory,
} from "@/interfaces/property.interface";
import { useSearchParams } from "react-router-dom";
import CategoryFilter from "@/components/common/category-filter";
import { layoutService } from "@/services/layout.service";
import AsideAds from "@/components/common/ads/aside-ads";
import BannerAds from "@/components/common/ads/banner-ads";
import PropertyCardSkeleton from "@/components/common/cards/property-card-skeleton";
import AsideAdsSkeleton from "@/components/common/ads/aside-ads-skeleton";
import BannerAdsSkeleton from "@/components/common/ads/banner-ads-skeleton";

// Helper component for a single layout block
const LayoutBlock = ({ properties, asideAd, bannerAd, isLoading }: any) => {
  if (isLoading) {
    return (
      <>
        <div className="flex items-stretch gap-4 mb-4 flex-col md:flex-row mt-4">
          <div className="flex-1 flex flex-col gap-4">
            {[...Array(3)].map((_, index) => (
              <PropertyCardSkeleton key={index} />
            ))}
          </div>
          <div className="max-w-[395px] w-full">
            <AsideAdsSkeleton />
          </div>
        </div>
        <BannerAdsSkeleton />
      </>
    );
  }

  if (!properties?.length) return null;

  return (
    <>
      <div className="flex items-stretch gap-4 mb-4 flex-col md:flex-row mt-4">
        <div className="flex-1 flex flex-col gap-4">
          {properties.map((property: IProperty) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
        {asideAd && <AsideAds ads={asideAd} />}
      </div>
      {bannerAd && <BannerAds ads={bannerAd} />}
    </>
  );
};

export default function Main() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const category = params.get("category") as PropertyCategory;

  const { data, isLoading } = useQuery({
    queryKey: ["main-page-layout", category],
    queryFn: () => layoutService.getMainPageLayout(category),
  });

  return (
    <>
      <CategoryFilter />
      <HeroSection img={mainImage} title={"pages.hero.title"} />

      <LayoutBlock
        properties={data?.properties?.slice(0, 3)}
        asideAd={data?.asideAds?.[0]}
        bannerAd={data?.bannerAds?.[0]}
        isLoading={isLoading}
      />

      <LayoutBlock
        properties={data?.properties?.slice(3, 6)}
        asideAd={data?.asideAds?.[1]}
        bannerAd={data?.bannerAds?.[1]}
        isLoading={false} // Skeleton only shown for the first block
      />

      {/* Fallback for popular searches if there are no properties */}
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
