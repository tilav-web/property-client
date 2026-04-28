import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Building2, Loader2 } from "lucide-react";
import { developerService } from "@/services/developer.service";
import type { IDeveloper } from "@/interfaces/developer/developer.interface";

export default function DevelopersPage() {
  const { t } = useTranslation();
  const [items, setItems] = useState<IDeveloper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await developerService.list({ limit: 50 });
        if (!cancelled) setItems(res.items);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="py-6">
      <div className="mb-6 flex items-center gap-3">
        <Building2 className="h-7 w-7 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t("pages.developers.title", "Developers")}
          </h1>
          <p className="text-sm text-gray-500">
            {t(
              "pages.developers.subtitle",
              "Major developers and their projects",
            )}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
        </div>
      ) : items.length === 0 ? (
        <div className="py-12 text-center text-gray-500">
          {t("pages.developers.empty", "No developers yet")}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {items.map((d) => (
            <DeveloperCard key={d._id} developer={d} />
          ))}
        </div>
      )}
    </div>
  );
}

export function DeveloperCard({ developer }: { developer: IDeveloper }) {
  const { t } = useTranslation();
  return (
    <Link
      to={`/developer/${developer._id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-md"
    >
      <div className="flex h-32 items-center justify-center bg-gray-50 p-6">
        {developer.logo ? (
          <img
            src={developer.logo}
            alt={developer.name}
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <Building2 className="h-12 w-12 text-gray-300" />
        )}
      </div>
      <div className="p-3">
        <h3 className="truncate text-sm font-semibold text-gray-900 group-hover:text-blue-600">
          {developer.name}
        </h3>
        <p className="mt-0.5 text-xs text-gray-500">
          {developer.projects_count}{" "}
          {t("pages.developers.projects_count", "projects")}
        </p>
      </div>
    </Link>
  );
}
