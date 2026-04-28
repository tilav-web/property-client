import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Building2 } from "lucide-react";
import { developerService } from "@/services/developer.service";

/**
 * Reklama yo'q paytda image slot'iga top developerlarni promo qiladi.
 * Hech qanday developer yo'q bo'lsa null qaytaradi.
 */
export default function DevelopersPromoCard() {
  const { t } = useTranslation();
  const { data } = useQuery({
    queryKey: ["promo-developers"],
    queryFn: () => developerService.list({ limit: 8 }),
    staleTime: 1000 * 60 * 5,
  });

  const items = data?.items ?? [];
  if (items.length === 0) return null;

  return (
    <div className="my-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          <Building2 size={16} className="text-blue-600" />
          {t("ads.top_developers", "Top developers")}
        </h3>
        <Link
          to="/developers"
          className="text-xs font-medium text-blue-600 hover:underline"
        >
          {t("pages.developers.see_all", "See all")} →
        </Link>
      </div>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-8">
        {items.map((d) => (
          <Link
            key={d._id}
            to={`/developer/${d._id}`}
            className="group flex flex-col items-center gap-1 rounded-lg p-2 hover:bg-gray-50"
          >
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-md bg-gray-50">
              {d.logo ? (
                <img
                  src={d.logo}
                  alt={d.name}
                  className="max-h-full max-w-full object-contain p-1"
                />
              ) : (
                <Building2 size={18} className="text-gray-300" />
              )}
            </div>
            <span className="line-clamp-1 text-[10px] text-center text-gray-600 group-hover:text-blue-600">
              {d.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
