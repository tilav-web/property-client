import SearchFilterHeader from "./_components/search-filter";
import type { IApartmentSale } from "@/interfaces/property/categories/apartment-sale.interface";
import type { FindAllParams, SortOption } from "@/services/property.service";
import { propertyService } from "@/services/property.service";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import FilterNavLayoutBlock from "./_components/filter-nav-layout-block";
import { useLanguageStore } from "@/stores/language.store";
import type { CategoryType } from "@/interfaces/types/category.type";
import type { CategoryFilterType } from "@/interfaces/types/category-filter.type";
import type { CurrencyCode } from "@/constants/currencies";
import BannerAds from "@/components/common/ads/banner-ads";
import ImageAds from "@/components/common/ads/image-ads";
import { Search } from "lucide-react";

const PAGE_SIZE = 10;

interface PropertyPage {
  properties: IApartmentSale[];
  page: number;
  limit: number;
  totalPages: number | null;
  totalItems: number | null;
}

function parseNumberArray(values: string[] | null | undefined): number[] {
  if (!values || values.length === 0) return [];
  return values
    .map((v) => Number(v))
    .filter((n): n is number => Number.isFinite(n));
}

function readStoredLocation(): { lat: number; lng: number } | null {
  try {
    const raw = localStorage.getItem("geolocation:last");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as {
      lat: number;
      lng: number;
      timestamp: number;
    };
    if (Date.now() - parsed.timestamp > 60 * 60 * 1000) return null;
    return { lat: parsed.lat, lng: parsed.lng };
  } catch {
    return null;
  }
}

function buildFilters(params: URLSearchParams): Partial<FindAllParams> {
  const out: Partial<FindAllParams> = {};

  const category = params.get("category");
  const filterCategory = params.get("filterCategory");
  const tag = params.get("tag")?.trim();
  const search = params.get("search")?.trim();
  const is_new = params.get("is_new");
  const is_premium = params.get("is_premium");
  const rating = params.get("rating");
  const radius = params.get("radius");
  const lng = params.get("lng");
  const lat = params.get("lat");
  const near = params.get("near");
  const minPrice = params.get("minPrice");
  const maxPrice = params.get("maxPrice");
  const minArea = params.get("minArea");
  const maxArea = params.get("maxArea");
  const furnished = params.get("furnished");
  const currency = params.get("currency");
  const sort = params.get("sort");
  const amenities = params.getAll("amenities");

  const bedrooms = parseNumberArray(params.getAll("bedrooms"));
  const bathrooms = parseNumberArray(params.getAll("bathrooms"));

  if (category) out.category = category as CategoryType;
  if (filterCategory && filterCategory !== "all")
    out.filterCategory = filterCategory as CategoryFilterType;
  if (is_new === "1") out.is_new = true;
  if (is_premium === "true") out.is_premium = true;
  if (rating) out.rating = Number(rating);
  if (radius) out.radius = Number(radius);
  if (lng) out.lng = Number(lng);
  if (lat) out.lat = Number(lat);
  if (minPrice) out.minPrice = Number(minPrice);
  if (maxPrice) out.maxPrice = Number(maxPrice);
  if (minArea) out.minArea = Number(minArea);
  if (maxArea) out.maxArea = Number(maxArea);
  if (furnished === "true") out.furnished = true;
  if (bedrooms.length) out.bedrooms = bedrooms;
  if (bathrooms.length) out.bathrooms = bathrooms;
  if (currency) out.currency = currency as CurrencyCode;
  if (sort) out.sort = sort as SortOption;
  if (amenities.length) out.amenities = amenities;

  // Near me: URL'da faqat bayroq va radius, lat/lng esa localStorage'dan.
  if (near === "1" && out.lat === undefined && out.lng === undefined) {
    const coords = readStoredLocation();
    if (coords) {
      out.lat = coords.lat;
      out.lng = coords.lng;
      if (!out.sort) out.sort = "distance";
    }
  }

  const searchTerms = [tag, search].filter(Boolean).join(" ").trim();
  if (searchTerms) out.search = searchTerms;

  return out;
}

export default function SearchPage() {
  const [params] = useSearchParams();
  const { t } = useTranslation();
  const { language } = useLanguageStore();

  const filters = useMemo(() => buildFilters(params), [params]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery<PropertyPage>({
      queryKey: ["property-search", filters, language],
      queryFn: async ({ pageParam }) => {
        const data = await propertyService.findAll({
          ...filters,
          page: pageParam as number,
          limit: PAGE_SIZE,
        });
        return data as PropertyPage;
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        // Birinchi sahifada totalPages bor — uni ishlatamiz
        if (lastPage.totalPages !== null) {
          return lastPage.page < lastPage.totalPages
            ? lastPage.page + 1
            : undefined;
        }
        // Keyingi sahifalarda: agar to'liq sahifa bo'lsa, yana bo'lishi mumkin
        return lastPage.properties.length >= lastPage.limit
          ? lastPage.page + 1
          : undefined;
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

  const allProperties = useMemo(
    () => data?.pages.flatMap((page) => page.properties) ?? [],
    [data],
  );

  const totalItems = data?.pages[0]?.totalItems ?? 0;

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
            {totalItems > allProperties.length && ` / ${totalItems}`}{" "}
            {t("pages.main_page.statistics.properties_listed").toLowerCase()}
          </p>
        </div>
      )}

      {/* Results */}
      <div className="mt-4">
        {Array.from({
          length: Math.ceil(allProperties.length / PAGE_SIZE),
        }).map((_, pageIndex) => {
          const pageProperties = allProperties.slice(
            pageIndex * PAGE_SIZE,
            (pageIndex + 1) * PAGE_SIZE,
          );
          return (
            <div
              key={pageIndex}
              style={{
                contentVisibility: "auto",
                containIntrinsicSize: "0 800px",
              }}
            >
              <FilterNavLayoutBlock
                properties={pageProperties.slice(0, 6)}
                isLoading={false}
              />
              {pageProperties.length > 6 && <ImageAds />}
              <FilterNavLayoutBlock
                properties={pageProperties.slice(6, PAGE_SIZE)}
                isLoading={false}
              />
              {pageProperties.length > 9 && <BannerAds />}
            </div>
          );
        })}
      </div>

      {/* Loading */}
      {(isLoading || isFetchingNextPage) && (
        <div className="mt-4 w-full">
          <FilterNavLayoutBlock properties={[]} isLoading={true} />
          <FilterNavLayoutBlock properties={[]} isLoading={true} />
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
