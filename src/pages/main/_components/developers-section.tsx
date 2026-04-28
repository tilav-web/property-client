import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { developerService } from "@/services/developer.service";
import type { IDeveloper } from "@/interfaces/developer/developer.interface";
import { DeveloperCard } from "@/pages/developers/developers";
import { Building2 } from "lucide-react";

export default function DevelopersSection() {
  const { t } = useTranslation();
  const [items, setItems] = useState<IDeveloper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await developerService.list({ limit: 12 });
        if (!cancelled) setItems(res.items);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!loading && items.length === 0) return null;

  return (
    <section className="mt-12">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 sm:text-2xl">
          <Building2 className="h-6 w-6 text-blue-600" />
          {t("pages.developers.section_title", "Projects by developers")}
        </h2>
        <Link
          to="/developers"
          className="rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100"
        >
          {t("pages.developers.see_all", "See all")}
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-44 animate-pulse rounded-xl bg-gray-100"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {items.map((d) => (
            <DeveloperCard key={d._id} developer={d} />
          ))}
        </div>
      )}
    </section>
  );
}
