import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import type { IProperty } from "@/interfaces/property/property.interface";
import ImageAds from "@/components/common/ads/image-ads";
import BannerAds from "@/components/common/ads/banner-ads";
import { Button } from "@/components/ui/button";
import PropertyMiniCardSkeleton from "@/components/common/cards/property/skeletons/property-mini-card-skeleton";
import ImageAdsSkeleton from "@/components/common/ads/image-ads-skeleton";
import BannerAdsSkeleton from "@/components/common/ads/banner-ads-skeleton";
import CategoryFilter from "@/components/common/category-filter";
import ApartmentRentCard from "@/components/common/cards/property/cards/categories/apartment-rent-card";
import { propertyService } from "@/services/property.service";
import type { CategoryType } from "@/interfaces/types/category.type";

const CategoryLayoutBlock = ({ page, pageIndex }: any) => {
  if (!page || !page.properties || page.properties.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {page.properties.slice(0, 4).map((p: IProperty) => (
          <ApartmentRentCard key={p._id} apartment={p} />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {page.properties.slice(4, 6).map((p: IProperty) => (
          <ApartmentRentCard key={p._id} apartment={p} />
        ))}
        {page.imageAd && (
          <div className="lg:col-span-2 h-full">
            <ImageAds key={`image-ad-${pageIndex}-${page.imageAd._id}`} />
          </div>
        )}
      </div>

      {page.bannerAd && (
        <div className="mb-8">
          <BannerAds key={`banner-ad-${pageIndex}-${page.bannerAd._id}`} />
        </div>
      )}
    </div>
  );
};

const BlockSkeleton = () => (
  <div className="w-full max-w-6xl mx-auto px-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      {[...Array(4)].map((_, i) => (
        <PropertyMiniCardSkeleton key={`sk-top-${i}`} />
      ))}
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      {[...Array(2)].map((_, i) => (
        <PropertyMiniCardSkeleton key={`sk-bottom-${i}`} />
      ))}
      <div className="lg:col-span-2">
        <ImageAdsSkeleton />
      </div>
    </div>
    <div className="mb-8">
      <BannerAdsSkeleton />
    </div>
  </div>
);

export default function Category() {
  const [params] = useSearchParams();
  const category = params.get("key") as CategoryType;
  const { t } = useTranslation();

  console.log(category);

  // Debug: console.log qo'shing
  useEffect(() => {
    console.log("Category changed:", category);
  }, [category]);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["category-page", category], // useMemo olib tashlandi
    queryFn: async ({ pageParam = 1 }) => {
      console.log("Fetching category:", category, "page:", pageParam);
      const result = await propertyService.findAll({
        category,
        page: pageParam,
      });
      console.log("Fetch result:", result);
      return result;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage?.pagination?.hasNextPage) {
        return lastPage.pagination.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: Boolean(category), // !!category o'rniga Boolean() ishlatildi
    refetchOnWindowFocus: false, // Qo'shimcha: keraksiz refetch oldini olish
  });

  // Birinchi yuklashda ikkinchi sahifani avtomatik olish
  useEffect(() => {
    if (
      status === "success" &&
      hasNextPage &&
      data?.pages.length === 1 &&
      !isFetchingNextPage
    ) {
      console.log("Auto-fetching second page");
      fetchNextPage();
    }
  }, [
    status,
    hasNextPage,
    data?.pages.length,
    fetchNextPage,
    isFetchingNextPage,
  ]);

  const isLoading = status === "pending";
  const noCategorySelected = !category;

  // Debug: status va datani kuzatish
  useEffect(() => {
    console.log("Query status:", status);
    console.log("Has data:", !!data);
    console.log("Error:", error);
  }, [status, data, error]);

  return (
    <div>
      <CategoryFilter />
      <div className="flex flex-col items-center gap-y-4">
        {noCategorySelected ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-gray-700">
              {t("pages.category_page.select_category_prompt")}
            </h2>
          </div>
        ) : isLoading ? (
          <>
            <BlockSkeleton />
            <BlockSkeleton />
          </>
        ) : status === "error" ? (
          <div className="text-center py-20 text-red-500">
            <p>{t("pages.category_page.error_loading")}</p>
            <p>{error?.message || "Unknown error"}</p>
          </div>
        ) : (
          <>
            {data?.pages.map((page, i) => (
              <CategoryLayoutBlock
                key={`block-${i}`}
                page={page}
                pageIndex={i}
              />
            ))}

            {isFetchingNextPage && <BlockSkeleton />}

            {hasNextPage && (
              <Button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="mt-8"
              >
                {isFetchingNextPage
                  ? t("buttons.loading_more")
                  : t("buttons.load_more")}
              </Button>
            )}

            {!hasNextPage &&
              data?.pages.length > 0 &&
              !data.pages.every((p) => p.properties?.length === 0) && (
                <p className="mt-8 text-gray-500">
                  {t("pages.category_page.no_more_results")}
                </p>
              )}

            {data?.pages.every(
              (p) => !p.properties || p.properties.length === 0
            ) && (
              <div className="text-center py-20">
                <h2 className="text-3xl font-bold mb-2">
                  {t("pages.main_page.no_results_title")}
                </h2>
                <p className="text-gray-500">
                  {t("pages.main_page.no_results_subtitle")}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
