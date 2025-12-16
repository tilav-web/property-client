import { useSearchParams } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { propertyService } from "@/services/property.service";
import type { CategoryFilterType } from "@/interfaces/types/category-filter.type";
import FilterNavLayoutBlock from "./_components/filter-nav-layout-block"; // FilterNavLayoutBlock ni import qildik
import type { PropertyType } from "@/interfaces/property/property.interface"; // IProperty o'rniga PropertyType import qilindi
import LoadMoreButton from "@/components/common/buttons/load-more.button";
import HeroSection from "@/components/common/hero-section";
import { heroSectionCategoryImage } from "@/utils/shared";

interface PropertyPage {
  properties: PropertyType[]; // IProperty o'rniga PropertyType ishlatildi
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
        limit: 6,
      });
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
  const allProperties = data?.pages.flatMap((page) => page.properties) ?? [];

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
            {/* INITIAL LOADING SKELETONS / NEXT PAGE FETCHING SKELETONS */}
            {(isLoading || isFetchingNextPage) && (
              <FilterNavLayoutBlock properties={[]} isLoading={true} />
            )}

            {/* RENDER BLOCKS */}
            {!isLoading &&
              data?.pages.map((page, index) => (
                <FilterNavLayoutBlock
                  key={index}
                  properties={page.properties}
                  isLoading={false}
                />
              ))}

            {/* NO RESULTS */}
            {!isLoading &&
              !isFetchingNextPage &&
              (!data || allProperties.length === 0) && (
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

            {/* MORE button */}
            {hasNextPage && (
              <div className="w-full text-center mt-8">
                <LoadMoreButton
                  loading={isFetchingNextPage}
                  fetchNextPage={fetchNextPage}
                />
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
