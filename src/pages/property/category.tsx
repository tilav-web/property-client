import { useSearchParams } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { propertyService } from "@/services/property.service";
import type { CategoryFilterType } from "@/interfaces/types/category-filter.type";
import FilterNavLayoutBlock from "./_components/filter-nav-layout-block";
import type { PropertyType } from "@/interfaces/property/property.interface";
import HeroSection from "@/components/common/hero-section";
import { heroSectionCategoryImage } from "@/utils/shared";
import { useRef, useEffect, useMemo } from "react";
import BannerAds from "@/components/common/ads/banner-ads";
import ImageAds from "@/components/common/ads/image-ads";
import ImageAdsSkeleton from "@/components/common/ads/image-ads-skeleton";
import BannerAdsSkeleton from "@/components/common/ads/banner-ads-skeleton";

interface PropertyPage {
  properties: PropertyType[];
  page: number;
  limit: number;
  totalPages: number;
}

export default function Category() {
  const [params] = useSearchParams();
  const filterCategory = params.get("filterCategory") as CategoryFilterType;
  const { t } = useTranslation();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery<PropertyPage>({
    queryKey: ["category-page", filterCategory],
    queryFn: async ({ pageParam = 1 }) => {
              const result = await propertyService.findAll({
                filterCategory,
                page: pageParam as number,
                limit: 10,      });
      return result as PropertyPage;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: !!filterCategory,
    refetchOnWindowFocus: false,
  });

  const isLoading = status === "pending";
  const noCategorySelected = !filterCategory;
  const allProperties = useMemo(
    () => data?.pages.flatMap((page) => page.properties) ?? [],
    [data]
  );

  const observer = useRef<IntersectionObserver>(null);
  const lastPropertyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isFetchingNextPage) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });

    if (lastPropertyRef.current) {
      observer.current.observe(lastPropertyRef.current);
    }
  }, [isFetchingNextPage, hasNextPage, fetchNextPage]);

  return (
    <div className="py-12">
      <HeroSection title="" img={heroSectionCategoryImage} />
      <div className="w-full flex flex-col items-center gap-y-8 px-4 py-8">
        {noCategorySelected ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-gray-700">
              {t("pages.category_page.select_category_prompt")}
            </h2>
          </div>
        ) : (
          <>
            {Array.from({ length: Math.ceil(allProperties.length / 10) }).map(
              (_, pageIndex) => {
                const pageProperties = allProperties.slice(
                  pageIndex * 10,
                  (pageIndex + 1) * 10
                );
                return (
                  <div key={pageIndex}>
                    <FilterNavLayoutBlock
                      properties={pageProperties.slice(0, 6)}
                      isLoading={false}
                    />
                    {pageProperties.length > 6 && <ImageAds />}
                    <FilterNavLayoutBlock
                      properties={pageProperties.slice(6, 10)}
                      isLoading={false}
                    />
                    {pageProperties.length > 9 && <BannerAds />}
                  </div>
                );
              }
            )}

            {/* LOADING SKELETONS */}
            {(isLoading || isFetchingNextPage) && (
              <div className="w-full">
                <FilterNavLayoutBlock properties={[]} isLoading={true} />
                <div className="my-4">
                  <ImageAdsSkeleton />
                </div>
                <FilterNavLayoutBlock properties={[]} isLoading={true} />
                <div className="my-4">
                  <BannerAdsSkeleton />
                </div>
              </div>
            )}
            <div ref={lastPropertyRef} />

            {/* NO RESULTS */}
            {!isLoading && !isFetchingNextPage && allProperties.length === 0 && (
              <div className="text-center py-20">
                <h2 className="text-3xl font-bold mb-2">
                  {t("pages.main_page.no_results_title")}
                </h2>
                <p className="text-gray-500">
                  {t("pages.main_page.no_results_subtitle")}
                </p>
              </div>
            )}

            {/* ERROR HANDLING */}
            {status === "error" && (
              <div className="text-center py-20 text-red-500">
                <p>{t("pages.category_page.error_loading")}</p>
                <p>{error?.message || "Unknown error"}</p>
              </div>
            )}

            {!hasNextPage && !isLoading && allProperties.length > 0 && (
              <p className="text-gray-500 text-center mt-8">
                {t("pages.category_page.no_more_results")}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
