import { Calendar, MapPin, Bed, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import Price from "@/components/common/price";
import type { IProject } from "@/interfaces/project/project.interface";

const STATUS_COLORS: Record<string, string> = {
  pre_launch: "bg-amber-100 text-amber-800",
  on_sale: "bg-emerald-100 text-emerald-800",
  sold_out: "bg-gray-200 text-gray-700",
  completed: "bg-blue-100 text-blue-800",
};

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export default function ProjectCard({ project }: { project: IProject }) {
  const { t } = useTranslation();
  const photo = project.photos?.[0];

  const createdMs = project.createdAt
    ? new Date(project.createdAt).getTime()
    : 0;
  const isNew = createdMs > 0 && Date.now() - createdMs <= SEVEN_DAYS_MS;

  const beds =
    project.unit_types
      ?.map((u) => {
        if (u.bedrooms_min !== undefined && u.bedrooms_max !== undefined) {
          return `${u.bedrooms_min}-${u.bedrooms_max}`;
        }
        if (u.bedrooms_min !== undefined) return String(u.bedrooms_min);
        return null;
      })
      .filter(Boolean)
      .join(", ") || "";

  const developerLogo =
    typeof project.developer === "object" ? project.developer.logo : undefined;

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-md">
      <div className="relative h-48 bg-gray-100">
        {photo && (
          <img
            src={photo}
            alt={project.name}
            className="h-full w-full object-cover"
          />
        )}
        <div className="absolute left-3 top-3 flex flex-col gap-1">
          {isNew && (
            <span className="flex items-center gap-1 rounded-md bg-red-500 px-2 py-0.5 text-[11px] font-semibold text-white shadow-sm">
              <Sparkles size={11} />
              {t("pages.projects.new_badge", "New")}
            </span>
          )}
          <span
            className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${
              STATUS_COLORS[project.status] || "bg-gray-100 text-gray-700"
            }`}
          >
            {t(`pages.projects.status.${project.status}`, project.status.replace("_", " "))}
          </span>
          {project.delivery_date && (
            <span className="flex items-center gap-1 rounded-md bg-white/90 px-2 py-0.5 text-[11px] font-medium text-gray-700 backdrop-blur-sm">
              <Calendar size={11} /> {project.delivery_date}
            </span>
          )}
        </div>
        {developerLogo && (
          <div className="absolute bottom-3 left-3 flex h-10 w-20 items-center justify-center overflow-hidden rounded bg-white/95 px-2 shadow-sm">
            <img
              src={developerLogo}
              alt=""
              className="max-h-full max-w-full object-contain"
            />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-1 text-base font-semibold text-gray-900 group-hover:text-blue-600">
          {project.name}
        </h3>
        {project.address && (
          <p className="flex items-center gap-1 text-xs text-gray-500">
            <MapPin size={12} className="flex-shrink-0" />
            <span className="line-clamp-1">{project.address}</span>
          </p>
        )}

        {beds && (
          <p className="flex items-center gap-1 text-xs text-gray-600">
            <Bed size={12} /> {beds} {t("common.beds", "Beds")}
          </p>
        )}

        {project.launch_price !== undefined && (
          <div className="mt-auto pt-2">
            <p className="text-[11px] uppercase tracking-wide text-gray-400">
              {t("pages.projects.launch_price", "Launch price")}
            </p>
            <Price
              amount={project.launch_price}
              currency={project.currency}
              className="text-base text-gray-900"
            />
          </div>
        )}
      </div>
    </div>
  );
}
