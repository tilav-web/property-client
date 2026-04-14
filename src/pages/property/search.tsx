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
import type { CategoryType } from "@/interfaces/types/category.type";
import type { CategoryFilterType } from "@/interfaces/types/category-filter.type";
import BannerAds from "@/components/common/ads/banner-ads";
import ImageAds from "@/components/common/ads/image-ads";
import ImageAdsSkeleton from "@/components/common/ads/image-ads-skeleton";
import BannerAdsSkeleton from "@/components/common/ads/banner-ads-skeleton";
import { Search } from "lucide-react";

interface PropertyPage {
  properties: IApartmentSale[];
  page: number;
  limit: number;
  totalPages: number;
}

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
  const { t } = useTranslation();
  const { language } = useLanguageStore();

  // Read all filter params
  const category = params.get("category");
  const filterCategory = params.get("filterCategory");
  const is_new = params.get("is_new");
  const tag = params.get("tag");
  const search = params.get("search");
  const is_premium = params.get("is_premium");
  const rating = params.get("rating");
  const radius = params.get("radius");
  const lng = params.get("lng");
  const lat = params.get("lat");
  const minPrice = params.get("minPrice");
  const maxPrice = params.get("maxPrice");
  const minArea = params.get("minArea");
  const maxArea = params.get("maxArea");
  const furnished = params.get("furnished");
  const parking = params.get("parking");

  const bedroomParams = params.getAll("bedrooms").length
    ? params.getAll("bedrooms")
    : params.getAll("bdr");
  const bathroomParams = params.getAll("bathrooms").length
    ? params.getAll("bathrooms")
    : params.getAll("bthr");

  const selectedBedrooms = parseNumberArray(bedroomParams);
  const selectedBathrooms = parseNumberArray(bathroomParams);

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
      category,
      filterCategory,
      is_new,
      tag,
      search,
      is_premium,
      rating,
      radius,
      bedroomsKey,
      bathroomsKey,
      lng,
      lat,
      minPrice,
      maxPrice,
      minArea,
      maxArea,
      furnished,
      parking,
      language,
    ],
    [
      category,
      filterCategory,
      is_new,
      tag,
      search,
      is_premium,
      rating,
      radius,
      bedroomsKey,
      bathroomsKey,
      lng,
      lat,
      minPrice,
      maxPrice,
      minArea,
      maxArea,
      furnished,
      parking,
      language,
    ]
  );

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery<PropertyPage>({
      queryKey,
      queryFn: async ({ pageParam }) => {
        const paramsToSend: Partial<FindAllParams> = {
          page: pageParam as number,
          limit: 10,
        };

        if (category) paramsToSend.category = category as CategoryType;
        if (filterCategory && filterCategory !== "all")
          paramsToSend.filterCategory = filterCategory as CategoryFilterType;
        if (is_new === "1") paramsToSend.is_new = true;
        if (tag) paramsToSend.search = tag;
        if (search) paramsToSend.search = search;
        if (is_premium === "true") paramsToSend.is_premium = true;
        if (rating) paramsToSend.rating = Number(rating);
        if (radius) paramsToSend.radius = Number(radius);
        if (selectedBedrooms.length) paramsToSend.bedrooms = selectedBedrooms;
        if (selectedBathrooms.length) paramsToSend.bathrooms = selectedBathrooms;
        if (lng) paramsToSend.lng = Number(lng);
        if (lat) paramsToSend.lat = Number(lat);
        if (minPrice) paramsToSend.minPrice = Number(minPrice);
        if (maxPrice) paramsToSend.maxPrice = Number(maxPrice);
        if (minArea) paramsToSend.minArea = Number(minArea);
        if (maxArea) paramsToSend.maxArea = Number(maxArea);
        if (furnished === "true") paramsToSend.furnished = true;
        if (parking === "true") paramsToSend.parking = true;

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

  const totalItems = data?.pages[0]?.totalPages
    ? data.pages[0].totalPages * 10
    : 0;

  const hasNoResults =
    !isLoading && !isFetchingNextPage && allProperties.length === 0;

  return (
    <div className="py-4">
      <SearchFilterHeader />

      {/* Results count */}
      {!isLoading && allProperties.length > 0 && (
        <div className="mt-4 flex items-center justify-between px-1">
          <p className="text-sm text-gray-500">
            {allProperties.length}
            {totalItems > allProperties.length && ` / ~${totalItems}`}{" "}
            {t("pages.main_page.statistics.properties_listed").toLowerCase()}
          </p>
        </div>
      )}

      {/* Results */}
      <div className="mt-4">
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
      </div>

      {/* Loading */}
      {(isLoading || isFetchingNextPage) && (
        <div className="mt-4 w-full">
          <FilterNavLayoutBlock properties={[]} isLoading={true} />
          <ImageAdsSkeleton />
          <FilterNavLayoutBlock properties={[]} isLoading={true} />
          <BannerAdsSkeleton />
        </div>
      )}

      <div ref={lastPropertyRef} />

      {/* No results */}
      {hasNoResults && (
        <div className="mt-12 flex flex-col items-center gap-4 py-16 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
            <Search size={32} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            {t("pages.main_page.no_results_title") || "No properties found"}
          </h2>
          <p className="max-w-md text-gray-500">
            {t("pages.main_page.no_results_subtitle") ||
              "Try adjusting your filters or search for a different location"}
          </p>
        </div>
      )}
    </div>
  );
}
