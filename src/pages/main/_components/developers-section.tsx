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
    <section className="py-12">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl text-foreground sm:text-4xl">
            {t("pages.developers.section_title", "Projects by developers")}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {t(
              "pages.developers.section_subtitle",
              "Discover trusted developers shaping Malaysia's skyline.",
            )}
          </p>
        </div>
        <Link
          to="/developers"
          className="hidden flex-shrink-0 rounded-full border border-border px-4 py-1.5 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary sm:inline-flex"
        >
          <Building2 className="mr-1.5 h-4 w-4" />
          {t("pages.developers.see_all", "See all")}
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-44 animate-pulse rounded-2xl bg-muted/60"
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

      <div className="mt-6 text-center sm:hidden">
        <Link
          to="/developers"
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-1.5 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <Building2 className="h-4 w-4" />
          {t("pages.developers.see_all", "See all")}
        </Link>
      </div>
    </section>
  );
}
