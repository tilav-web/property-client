import HeroSection from "@/components/common/hero-section";
import type { IApartmentSale } from "@/interfaces/property/categories/apartment-sale.interface";
import type { CategoryType } from "@/interfaces/types/category.type";
import { propertyService } from "@/services/property.service";
import { heroImage } from "@/utils/shared";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import FilterNavLayoutBlock from "./_components/filter-nav-layout-block";
import { useLanguageStore } from "@/stores/language.store";
import BannerAds from "@/components/common/ads/banner-ads";
import ImageAds from "@/components/common/ads/image-ads";
import ImageAdsSkeleton from "@/components/common/ads/image-ads-skeleton";
import BannerAdsSkeleton from "@/components/common/ads/banner-ads-skeleton";

interface PropertyPage {
  properties: IApartmentSale[];
  page: number;
  limit: number;
  totalPages: number;
}

export default function FilterNav() {
  const [params] = useSearchParams();
  const category = params.get("category") as CategoryType;
  const is_new = params.get("is_new");
  const { t } = useTranslation();
  const { language } = useLanguageStore();

  const queryKey = useMemo(
    () => ["filter-nav-layout", category, language],
    [category, language]
  );

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery<PropertyPage>({
      queryKey,
      queryFn: async ({ pageParam }) => {
        const data = await propertyService.findAll({
          category,
          page: pageParam as number,
          limit: 10,
          is_new: is_new === "1" ? true : is_new === "0" ? false : undefined,
        });
        return data as PropertyPage;
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        if (lastPage.page < lastPage.totalPages) {
          return lastPage.page + 1;
        }
        return undefined;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    });

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

  const allProperties = useMemo(() => {
    return data?.pages.flatMap((page) => page.properties) ?? [];
  }, [data]);

  return (
    <div className="py-12">
      <HeroSection
        title={t("pages.category_page.title")}
        img={heroImage}
        className="text-white"
      />
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
        <div className="flex flex-col items-center gap-y-4 mt-8">
          <div className="text-center py-20">
            <h2 className="text-3xl font-bold mb-2">
              {t("pages.main_page.no_results_title")}
            </h2>
            <p className="text-gray-500">
              {t("pages.main_page.no_results_subtitle")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
