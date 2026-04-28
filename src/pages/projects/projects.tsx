import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Loader2, Sparkles } from "lucide-react";
import { projectService } from "@/services/project.service";
import type {
  IProject,
  TProjectStatus,
} from "@/interfaces/project/project.interface";
import ProjectCard from "./_components/project-card";

const STATUS_TABS: { key: "all" | TProjectStatus; labelKey: string }[] = [
  { key: "all", labelKey: "common.all" },
  { key: "on_sale", labelKey: "pages.projects.status.on_sale" },
  { key: "pre_launch", labelKey: "pages.projects.status.pre_launch" },
  { key: "completed", labelKey: "pages.projects.status.completed" },
];

export default function ProjectsPage() {
  const { t } = useTranslation();
  const [params, setParams] = useSearchParams();
  const status = (params.get("status") || "all") as
    | "all"
    | TProjectStatus;

  const [items, setItems] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const res = await projectService.list({
          status: status === "all" ? undefined : status,
          limit: 30,
        });
        if (!cancelled) setItems(res.items);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [status]);

  const setStatus = (next: typeof status) => {
    const p = new URLSearchParams(params);
    if (next === "all") p.delete("status");
    else p.set("status", next);
    setParams(p);
  };

  return (
    <div className="py-6">
      <div className="mb-6 flex items-center gap-3">
        <Sparkles className="h-7 w-7 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t("pages.projects.title", "Projects")}
          </h1>
          <p className="text-sm text-gray-500">
            {t(
              "pages.projects.subtitle",
              "Explore new projects from leading developers",
            )}
          </p>
        </div>
      </div>

      <div className="mb-4 flex gap-1 overflow-x-auto rounded-full border border-gray-200 bg-white p-1 w-fit">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setStatus(tab.key)}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              status === tab.key
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {t(tab.labelKey)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
        </div>
      ) : items.length === 0 ? (
        <div className="py-12 text-center text-gray-500">
          {t("pages.projects.empty", "No projects found")}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <Link key={p._id} to={`/project/${p._id}`}>
              <ProjectCard project={p} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
