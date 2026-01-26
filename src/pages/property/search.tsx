import SearchFilterHeader from "./_components/search-filter";
import type { IApartmentSale } from "@/interfaces/property/categories/apartment-sale.interface";
import type { FindAllParams } from "@/services/property.service";
import { propertyService } from "@/services/property.service";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import FilterNavLayoutBlock from "./_components/filter-nav-layout-block";
import { useLanguageStore } from "@/stores/language.store";
import type { CategoryFilterType } from "@/interfaces/types/category-filter.type";
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

// Utility to convert param arrays like ['1','2'] -> [1,2]
function parseNumberArray(values: string[] | null | undefined): number[] {
  if (!values || values.length === 0) return [];
  return values
    .map((v) => {
      const n = Number(v);
      return Number.isNaN(n) ? undefined : n;
    })
    .filter((v): v is number => typeof v === "number");
}

export default function SearchPage() {
  const [params] = useSearchParams();
  const filterCategory = params.get("filterCategory");
  const is_new = params.get("is_new");
  const tag = params.get("tag");
  const is_premium = params.get("is_premium");
  const rating = params.get("rating");
  const radius = params.get("radius");
  const lng = params.get("lng");
  const lat = params.get("lat");

  // bedrooms and bathrooms may be provided as repeated params `bedrooms`/`bathrooms`
  // Prefer the full names first, fall back to legacy `bdr`/`bthr` if needed.
  const bedroomParams = params.getAll("bedrooms").length
    ? params.getAll("bedrooms")
    : params.getAll("bdr");
  const bathroomParams = params.getAll("bathrooms").length
    ? params.getAll("bathrooms")
    : params.getAll("bthr");

  const selectedBedrooms = parseNumberArray(bedroomParams);
  const selectedBathrooms = parseNumberArray(bathroomParams);

  const { t } = useTranslation();
  const { language } = useLanguageStore();

  const bedroomsKey = useMemo(
    () => selectedBedrooms.sort((a, b) => a - b).join("-"),
    [selectedBedrooms]
  );
  const bathroomsKey = useMemo(
    () => selectedBathrooms.sort((a, b) => a - b).join("-"),
    [selectedBathrooms]
  );

  const queryKey = useMemo(
    () => [
      "property-search",
      filterCategory,
      is_new,
      tag,
      is_premium,
      rating,
      radius,
      bedroomsKey,
      bathroomsKey,
      lng,
      lat,
      language,
    ],
    [
      filterCategory,
      is_new,
      tag,
      is_premium,
      rating,
      radius,
      bedroomsKey,
      bathroomsKey,
      lng,
      lat,
      language,
    ]
  );

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery<PropertyPage>({
      queryKey,
      queryFn: async ({ pageParam }) => {
        const paramsToSend: Partial<FindAllParams> = {
          page: pageParam as number,
          limit: 10, // Changed from 8 to 10
        };

        if (filterCategory && filterCategory !== "all")
          paramsToSend.filterCategory = filterCategory as CategoryFilterType;
        if (is_new === "1") paramsToSend.is_new = true;
        if (tag) paramsToSend.search = tag;
        if (is_premium === "1") paramsToSend.is_premium = true;
        if (rating) paramsToSend.rating = Number(rating);
        if (radius) paramsToSend.radius = Number(radius);
        if (selectedBedrooms.length) paramsToSend.bedrooms = selectedBedrooms;
        if (selectedBathrooms.length)
          paramsToSend.bathrooms = selectedBathrooms;
        if (lng) paramsToSend.lng = Number(lng);
        if (lat) paramsToSend.lat = Number(lat);

        const data = await propertyService.findAll(paramsToSend);
        return data as PropertyPage;
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        if (lastPage.page < lastPage.totalPages) {
          return lastPage.page + 1;
        }
        return undefined;
      },
      staleTime: 5 * 60 * 1000,
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

  const hasNoResults =
    !isLoading && !isFetchingNextPage && allProperties.length === 0;

  return (
    <div className="py-4">
      <SearchFilterHeader />

      {/* RENDER RESULTS WITH ADS */}
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
          <ImageAdsSkeleton />
          <FilterNavLayoutBlock properties={[]} isLoading={true} />
          <BannerAdsSkeleton />
        </div>
      )}

      <div ref={lastPropertyRef} />

      {/* NO RESULTS */}
      {hasNoResults && (
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
