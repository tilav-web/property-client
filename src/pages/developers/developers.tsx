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
    <div className="py-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-accent text-foreground">
          <Building2 className="h-6 w-6" />
        </div>
        <div>
          <h1 className="font-display text-3xl text-foreground sm:text-4xl">
            {t("pages.developers.title", "Developers")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t(
              "pages.developers.subtitle",
              "Major developers and their projects",
            )}
          </p>
        </div>
      </div>

      {renderDevelopersBody({
        loading,
        items,
        emptyText: t("pages.developers.empty", "No developers yet"),
      })}
    </div>
  );
}

function renderDevelopersBody({
  loading,
  items,
  emptyText,
}: {
  loading: boolean;
  items: IDeveloper[];
  emptyText: string;
}) {
  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }
  if (items.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">{emptyText}</div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {items.map((d) => (
        <DeveloperCard key={d._id} developer={d} />
      ))}
    </div>
  );
}

export function DeveloperCard({ developer }: Readonly<{ developer: IDeveloper }>) {
  const { t } = useTranslation();
  return (
    <Link
      to={`/developer/${developer._id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card-hover"
    >
      <div className="flex h-32 items-center justify-center bg-accent/40 p-6">
        {developer.logo ? (
          <img
            src={developer.logo}
            alt={developer.name}
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <Building2 className="h-12 w-12 text-foreground/30" />
        )}
      </div>
      <div className="p-4">
        <h3 className="truncate text-sm font-semibold text-foreground group-hover:text-primary">
          {developer.name}
        </h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {developer.projects_count}{" "}
          {t("pages.developers.projects_count", "projects")}
        </p>
      </div>
    </Link>
  );
}
