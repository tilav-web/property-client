import { type CategoryFilterType } from "@/interfaces/types/category-filter.type";
import { propertyService } from "@/services/property.service";
import { useLanguageStore } from "@/stores/language.store";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoryFilter() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const { language } = useLanguageStore();
  const category = params.get("category") as CategoryFilterType;
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["category-counts", language],
    queryFn: () => propertyService.getCategories(),
  });

  return (
    <div className="container mx-auto px-4 py-3 shadow-xl my-4">
      <div className="flex items-center justify-center gap-8 flex-wrap">
        {isLoading
          ? // Loading holatida skeleton ko'rsatish
            Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center gap-2">
                <Skeleton className="h-10 w-24 rounded" />
              </div>
            ))
          : // Ma'lumotlar yuklangandan so'ng asosiy kontent
            categories.map(
              (item: { category: CategoryFilterType; count: number }) => {
                return (
                  <Link
                    to={`/category?category=${item.category}`}
                    key={item.category}
                    className={`text-sm group py-2 px-3 border rounded ${
                      category?.toString() === item.category.toString()
                        ? "border-primary"
                        : "border-white hover:border-gray-300 transition-colors"
                    }`}
                  >
                    {t(`categories.${item.category}`)}
                    <span
                      className={`ml-1 ${
                        category === item.category
                          ? "text-primary"
                          : "text-muted-foreground group-hover:text-foreground"
                      }`}
                    >
                      ({item.count})
                    </span>
                  </Link>
                );
              }
            )}
      </div>
    </div>
  );
}
