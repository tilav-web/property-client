import { categories } from "@/constants/mack-data";
import type { PropertyCategory } from "@/interfaces/property.interface";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router-dom";

export default function CategoryFilter() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const category = params.get("key") as PropertyCategory;

  return (
    <div className="container mx-auto px-4 py-3 shadow-xl my-4">
      <div className="flex items-center justify-center gap-8 flex-wrap">
        {categories.map(({ key, count }) => (
          <Link
            to={`/category?key=${key}`}
            key={key}
            className={`text-sm group py-2 px-3 border rounded ${
              category === key ? "" : "border-white"
            }`}
          >
            {t(`categories.${key}`)}
            <span className="text-muted-foreground group-hover:text-foreground ml-1">
              ({count})
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
