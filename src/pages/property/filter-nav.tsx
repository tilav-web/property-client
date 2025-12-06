import HeroSection from "@/components/common/hero-section";
import type { IApartmentSale } from "@/interfaces/property/categories/apartment-sale.interface";
import type { CategoryType } from "@/interfaces/types/category.type";
import { propertyService } from "@/services/property.service";
import { heroImage } from "@/utils/shared";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import FilterNavLayoutBlock from "./_components/filter-nav-layout-block"; // update path
import { useLanguageStore } from "@/stores/language.store";

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
        const res = await propertyService.findAll({
          category,
          page: pageParam as number,
          limit: 6,
          is_new: is_new === "1",
        });
        return res as PropertyPage;
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

  return (
    <div className="py-12">
      <HeroSection
        title={t("pages.category_page.title")}
        img={heroImage}
        className="text-white"
      />

      {/* RENDER BLOCKS */}
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
      {!isLoading &&
        !isFetchingNextPage &&
        (!data || data.pages.flatMap((p) => p.properties).length === 0) && (
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

      {/* MORE tugmasi */}
      {hasNextPage && (
        <div className="w-full flex justify-center my-6">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg disabled:bg-gray-400"
          >
            {isFetchingNextPage ? "Yuklanmoqda..." : "More"}
          </button>
        </div>
      )}
    </div>
  );
}
