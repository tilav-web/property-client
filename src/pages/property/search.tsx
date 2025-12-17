import SearchFilterHeader from "./_components/search-filter";
import type { IApartmentSale } from "@/interfaces/property/categories/apartment-sale.interface";
import type { FindAllParams } from "@/services/property.service";
import { propertyService } from "@/services/property.service";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import FilterNavLayoutBlock from "./_components/filter-nav-layout-block";
import { useLanguageStore } from "@/stores/language.store";
import LoadMoreButton from "@/components/common/buttons/load-more.button";
import type { CategoryFilterType } from "@/interfaces/types/category-filter.type";

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
  // Read raw category string from URL; avoid casting to CategoryType to allow
  // special values like "all" coming from UI.
  const category = params.get("category");
  const is_new = params.get("is_new");
  const tag = params.get("tag");
  const is_premium = params.get("is_premium");
  const rating = params.get("rating");
  const radius = params.get("radius");
  const lng = params.get("lng");
  const lat = params.get("lat");

  // bedrooms and bathrooms may be provided as repeated params `bdr` / `bthr` or `bedrooms`/`bathrooms`
  const bedroomParams = params.getAll("bdr").length
    ? params.getAll("bdr")
    : params.getAll("bedrooms");
  const bathroomParams = params.getAll("bthr").length
    ? params.getAll("bthr")
    : params.getAll("bathrooms");

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
      category,
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
      category,
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
          limit: 8,
        };

        if (category && category !== "all")
          paramsToSend.filterCategory = category as CategoryFilterType;
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

  const hasNoResults =
    !isLoading &&
    !isFetchingNextPage &&
    data?.pages.every((p) => p.properties.length === 0);

  return (
    <div className="py-4">
      <SearchFilterHeader />

      {/* RENDER RESULTS */}
      {data?.pages.map((page, index) => (
        <FilterNavLayoutBlock
          key={index}
          properties={page.properties}
          isLoading={false}
        />
      ))}

      {/* LOADING SKELETONS */}
      {(isLoading || isFetchingNextPage) && (
        <FilterNavLayoutBlock properties={[]} isLoading={true} />
      )}

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

      {/* LOAD MORE */}
      {hasNextPage && (
        <div className="w-full flex justify-center my-6">
          <LoadMoreButton
            loading={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
          />
        </div>
      )}
    </div>
  );
}
