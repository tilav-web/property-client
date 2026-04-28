import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Loader2, Map as MapIcon, ListIcon, Sparkles } from "lucide-react";
import { projectService } from "@/services/project.service";
import type {
  IProject,
  TProjectStatus,
} from "@/interfaces/project/project.interface";
import ProjectCard from "./_components/project-card";
import ProjectsFilterBar, {
  type ProjectsFilterValues,
} from "./_components/projects-filter-bar";
import ProjectsMap from "./_components/projects-map";
import { useDebounce } from "@/hooks/use-debounce";

function readFiltersFromParams(
  params: URLSearchParams,
): ProjectsFilterValues {
  return {
    search: params.get("search") ?? "",
    status: (params.get("status") ?? "") as ProjectsFilterValues["status"],
    developer: params.get("developer") ?? "",
    city: params.get("city") ?? "",
    beds_min: params.get("beds_min") ?? "",
    beds_max: params.get("beds_max") ?? "",
    price_min: params.get("price_min") ?? "",
    price_max: params.get("price_max") ?? "",
    delivery_year: params.get("delivery_year") ?? "",
  };
}

function writeFiltersToParams(
  filters: ProjectsFilterValues,
  base: URLSearchParams,
): URLSearchParams {
  const next = new URLSearchParams(base);
  for (const [key, val] of Object.entries(filters)) {
    if (val) next.set(key, val);
    else next.delete(key);
  }
  return next;
}

export default function ProjectsPage() {
  const { t } = useTranslation();
  const [params, setParams] = useSearchParams();

  const filters = useMemo(() => readFiltersFromParams(params), [params]);
  const debouncedSearch = useDebounce(filters.search, 350);

  const [items, setItems] = useState<IProject[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<"list" | "map">("list");
  const [bbox, setBbox] = useState<[number, number, number, number] | null>(
    null,
  );

  // Fetch projects whenever filters or bbox change
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const res = await projectService.list({
          limit: bbox ? 200 : 30,
          search: debouncedSearch || undefined,
          status: filters.status
            ? (filters.status as TProjectStatus)
            : undefined,
          developer: filters.developer || undefined,
          city: filters.city || undefined,
          beds_min: filters.beds_min ? Number(filters.beds_min) : undefined,
          beds_max: filters.beds_max ? Number(filters.beds_max) : undefined,
          price_min: filters.price_min ? Number(filters.price_min) : undefined,
          price_max: filters.price_max ? Number(filters.price_max) : undefined,
          delivery_year: filters.delivery_year
            ? Number(filters.delivery_year)
            : undefined,
          sort: "newest",
          bbox: bbox ? bbox.join(",") : undefined,
          is_map_view: bbox ? true : undefined,
        });
        if (!cancelled) {
          setItems(res.items);
          setTotal(res.total);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [
    debouncedSearch,
    filters.status,
    filters.developer,
    filters.city,
    filters.beds_min,
    filters.beds_max,
    filters.price_min,
    filters.price_max,
    filters.delivery_year,
    bbox,
  ]);

  const handleFilterChange = useCallback(
    (next: ProjectsFilterValues) => {
      setParams(writeFiltersToParams(next, params), { replace: true });
    },
    [params, setParams],
  );

  const handleBoundsChange = useCallback(
    (b: [number, number, number, number]) => {
      setBbox(b);
    },
    [],
  );

  return (
    <div className="-mx-4 sm:mx-0">
      {/* Header */}
      <div className="px-4 pt-4 sm:px-0">
        <div className="mb-3 flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-blue-600" />
          <div>
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
              {t("pages.projects.title", "New Projects")}
            </h1>
            <p className="text-xs text-gray-500 sm:text-sm">
              {t(
                "pages.projects.subtitle",
                "Off-plan and new projects from leading developers",
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Mobile tab switcher */}
      <div className="sticky top-0 z-20 flex justify-center gap-1 border-b border-gray-200 bg-white px-4 py-2 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileView("list")}
          className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
            mobileView === "list"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          <ListIcon size={14} />
          {t("pages.projects.list_view", "List")}
        </button>
        <button
          type="button"
          onClick={() => setMobileView("map")}
          className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
            mobileView === "map"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          <MapIcon size={14} />
          {t("pages.projects.map_view", "Map")}
        </button>
      </div>

      {/* Split layout */}
      <div className="flex h-[calc(100vh-160px)] flex-col lg:flex-row">
        {/* Left: filter + cards */}
        <div
          className={`flex flex-col lg:w-1/2 xl:w-[55%] ${
            mobileView === "map" ? "hidden lg:flex" : "flex"
          }`}
        >
          <ProjectsFilterBar
            value={filters}
            onChange={handleFilterChange}
            total={total}
          />

          <div className="flex-1 overflow-y-auto p-3">
            {loading ? (
              <div className="flex h-40 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
              </div>
            ) : items.length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                {t("pages.projects.empty", "No projects match your filters")}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {items.map((p) => (
                  <Link
                    key={p._id}
                    to={`/project/${p._id}`}
                    onMouseEnter={() => setSelectedId(p._id)}
                    onMouseLeave={() => setSelectedId(null)}
                  >
                    <ProjectCard project={p} />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: map */}
        <div
          className={`relative lg:w-1/2 xl:w-[45%] ${
            mobileView === "list" ? "hidden lg:block" : "block"
          }`}
        >
          <ProjectsMap
            projects={items}
            selectedId={selectedId}
            onBoundsChange={handleBoundsChange}
            onMarkerClick={(id) => setSelectedId(id)}
          />
        </div>
      </div>
    </div>
  );
}
