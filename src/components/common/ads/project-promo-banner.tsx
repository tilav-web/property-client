import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Calendar, Sparkles } from "lucide-react";
import { projectService } from "@/services/project.service";
import Price from "@/components/common/price";

/**
 * Reklama yo'q paytda banner slot'iga "Featured project" promo
 * ko'rsatadi. AGAR loyiha ham yo'q bo'lsa null qaytaradi.
 */
export default function ProjectPromoBanner() {
  const { t } = useTranslation();
  const { data } = useQuery({
    queryKey: ["promo-featured-project"],
    queryFn: () =>
      projectService.list({ is_featured: true, limit: 1, status: "on_sale" }),
    staleTime: 1000 * 60 * 5,
  });

  const project = data?.items?.[0];
  if (!project) return null;

  const developer =
    typeof project.developer === "object" ? project.developer : null;
  const photo = project.photos?.[0];

  return (
    <Link
      to={`/project/${project._id}`}
      className="group my-4 block overflow-hidden rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2">
        <div className="relative h-48 sm:h-auto bg-gray-100">
          {photo && (
            <img
              src={photo}
              alt={project.name}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          )}
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-md bg-white/95 px-2 py-1 text-[11px] font-semibold text-blue-700 backdrop-blur-sm">
            <Sparkles size={11} />
            {t("ads.featured_project", "Featured project")}
          </span>
        </div>
        <div className="flex flex-col justify-center gap-2 p-5">
          {developer?.name && (
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              {developer.name}
            </p>
          )}
          <h3 className="text-xl font-bold leading-tight text-gray-900 sm:text-2xl">
            {project.name}
          </h3>
          {project.address && (
            <p className="line-clamp-1 text-sm text-gray-600">
              {project.address}
            </p>
          )}
          {project.delivery_date && (
            <p className="flex items-center gap-1 text-xs text-gray-500">
              <Calendar size={12} /> {project.delivery_date}
            </p>
          )}
          {project.launch_price !== undefined && (
            <div className="mt-1 flex items-baseline gap-1 text-emerald-600">
              <span className="text-sm font-medium">
                {t("pages.projects.from", "From")}
              </span>
              <Price
                amount={project.launch_price}
                currency={project.currency}
                className="text-base sm:text-lg"
              />
            </div>
          )}
          <span className="mt-2 inline-flex w-fit items-center gap-1 rounded-full bg-blue-600 px-4 py-1.5 text-sm font-medium text-white group-hover:bg-blue-700">
            {t("ads.explore_project", "Explore")} <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}
