import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { projectService } from "@/services/project.service";
import type { IProject } from "@/interfaces/project/project.interface";
import { Button } from "@/components/ui/button";
import Price from "@/components/common/price";
import { Bed, Building2, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const CITIES = [
  { key: "Qarshi", labelKey: "cities.kl", fallback: "Qarshi" },
  { key: "Shahrisabz", labelKey: "cities.penang", fallback: "Shahrisabz" },
  { key: "Yakkabog'", labelKey: "cities.jb", fallback: "Yakkabog'" },
  { key: "Qashqadaryo", labelKey: "cities.selangor", fallback: "Qashqadaryo" },
];

function ProjectGridCard({ project }: Readonly<{ project: IProject }>) {
  const { t } = useTranslation();
  const photo = project.photos?.[0];
  const developerLogo =
    typeof project.developer === "object" ? project.developer.logo : undefined;
  const developerName =
    typeof project.developer === "object" ? project.developer.name : "";

  const beds =
    project.unit_types
      ?.map((u) => {
        if (u.bedrooms_min !== undefined && u.bedrooms_max !== undefined) {
          return `${u.bedrooms_min} - ${u.bedrooms_max}`;
        }
        if (u.bedrooms_min !== undefined) return String(u.bedrooms_min);
        return null;
      })
      .filter(Boolean)
      .join(", ") || "";

  const unitCategory =
    project.unit_types && project.unit_types.length > 1
      ? t("pages.projects.multiple", "Multiple")
      : project.unit_types?.[0]?.category
        ? t(
            `pages.projects.unit.${project.unit_types[0].category}`,
            project.unit_types[0].category,
          )
        : "";

  const paymentPlan = project.payment_plans?.[0];

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover">
      <div className="relative aspect-[4/3] bg-muted/30">
        {photo && (
          <img
            src={photo}
            alt={project.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />

        {/* Top-left badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          <span className="inline-flex w-fit items-center rounded-full bg-card/95 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-foreground">
            {t("pages.projects.off_plan", "Off-Plan")}
          </span>
          {project.delivery_date && (
            <span className="inline-flex w-fit items-center rounded-full bg-card/95 px-2.5 py-0.5 text-[11px] font-semibold text-foreground">
              {t("pages.projects.delivery_date", "Delivery Date")}:{" "}
              {project.delivery_date}
            </span>
          )}
        </div>

        {/* Bottom — developer logo + project title overlay */}
        <div className="absolute bottom-3 left-3 right-3">
          {developerLogo ? (
            <div className="mb-2 flex h-8 w-20 items-center overflow-hidden rounded bg-card/95 px-2">
              <img
                src={developerLogo}
                alt={developerName}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ) : developerName ? (
            <div className="mb-2 inline-flex items-center rounded bg-card/95 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-foreground">
              {developerName}
            </div>
          ) : null}
          <h3 className="line-clamp-1 font-display text-lg font-semibold text-background drop-shadow">
            {project.name}
          </h3>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        {project.address && (
          <p className="line-clamp-1 text-xs text-muted-foreground">
            {project.address}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3 text-xs text-foreground/80">
          {beds && (
            <span className="inline-flex items-center gap-1.5">
              <Bed className="size-3.5" />
              {beds} {t("common.beds", "Beds")}
            </span>
          )}
          {unitCategory && (
            <span className="inline-flex items-center gap-1.5">
              <Building2 className="size-3.5" />
              {unitCategory}
            </span>
          )}
        </div>

        {project.launch_price !== undefined && (
          <div>
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
              {t("pages.projects.launch_price", "Launch price")}:
            </p>
            <Price
              amount={project.launch_price}
              currency={project.currency}
              className="font-display text-lg font-semibold text-foreground"
            />
          </div>
        )}

        {paymentPlan && (
          <div className="inline-flex w-fit items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
            <Calendar className="size-3" />
            {t("pages.projects.payment_plan", "Payment Plan")}:{" "}
            {paymentPlan.name}
          </div>
        )}

        <Link to={`/project/${project._id}`} className="mt-auto">
          <Button variant="outline" size="sm" className="w-full rounded-full">
            {t("pages.projects.view_details", "View details")}
          </Button>
        </Link>
      </div>
    </article>
  );
}

function ProjectsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="aspect-[3/4] animate-pulse rounded-2xl bg-muted/60"
        />
      ))}
    </div>
  );
}

export default function ExploreProjectsSection() {
  const { t } = useTranslation();
  const [city, setCity] = useState(CITIES[0].key);

  const { data, isLoading } = useQuery({
    queryKey: ["explore-projects", city],
    queryFn: () =>
      projectService.list({
        city,
        limit: 6,
        sort: "newest",
      }),
    staleTime: 5 * 60 * 1000,
  });

  const projects = data?.items ?? [];

  return (
    <section className="py-12">
      <div className="mb-4">
        <h2 className="font-display text-3xl text-foreground sm:text-4xl">
          {t(
            "pages.explore_projects.title",
            "Explore new projects in Qashqadaryo",
          )}
        </h2>
        <p className="mt-2 text-muted-foreground">
          {t(
            "pages.explore_projects.subtitle",
            "Discover the latest off-plan properties and be informed.",
          )}
        </p>
      </div>

      {/* City tabs */}
      <div className="mb-6 border-b border-border/60">
        <div className="flex flex-wrap items-center gap-1">
          {CITIES.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => setCity(c.key)}
              className={cn(
                "border-b-2 px-3 py-2.5 text-sm font-semibold transition-all sm:px-4 sm:py-3",
                city === c.key
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {t(c.labelKey, c.fallback)}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <ProjectsGridSkeleton />
      ) : projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/60 bg-card/50 py-16 text-center">
          <p className="text-sm text-muted-foreground">
            {t(
              "pages.explore_projects.empty",
              "No projects available in this city yet.",
            )}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p: IProject) => (
            <ProjectGridCard key={p._id} project={p} />
          ))}
        </div>
      )}

      <div className="mt-8 text-center">
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline-offset-2 hover:underline"
        >
          {t("pages.explore_projects.see_all", "See all New Projects")}
        </Link>
      </div>
    </section>
  );
}
