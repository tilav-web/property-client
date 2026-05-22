import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { developerService } from "@/services/developer.service";
import type { IDeveloper } from "@/interfaces/developer/developer.interface";
import { Building2, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

function DeveloperLogoCard({
  developer,
  active,
}: Readonly<{
  developer: IDeveloper;
  active?: boolean;
}>) {
  const { t } = useTranslation();

  return (
    <Link
      to={`/developer/${developer._id}`}
      className={cn(
        "group flex w-44 flex-shrink-0 flex-col snap-start overflow-hidden rounded-2xl border bg-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover",
        active
          ? "border-primary bg-primary text-background hover:bg-primary"
          : "border-border/60 hover:border-primary/40",
      )}
    >
      <div
        className={cn(
          "flex h-32 items-center justify-center px-6",
          active ? "bg-primary" : "bg-card",
        )}
      >
        {developer.logo ? (
          <img
            src={developer.logo}
            alt={developer.name}
            className={cn(
              "max-h-16 max-w-full object-contain",
              active && "brightness-0 invert",
            )}
            loading="lazy"
          />
        ) : (
          <span
            className={cn(
              "font-display text-lg font-bold uppercase tracking-tight",
              active ? "text-background" : "text-foreground",
            )}
          >
            {developer.name.split(" ")[0]}
          </span>
        )}
      </div>
      <div
        className={cn(
          "border-t px-4 py-3",
          active ? "border-background/15" : "border-border/60",
        )}
      >
        <h3
          className={cn(
            "truncate text-sm font-semibold",
            active ? "text-background" : "text-foreground group-hover:text-primary",
          )}
        >
          {developer.name}
        </h3>
        <p
          className={cn(
            "mt-0.5 text-xs",
            active ? "text-background/60" : "text-muted-foreground",
          )}
        >
          {developer.projects_count}{" "}
          {t("pages.developers.projects_count", "projects")}
        </p>
      </div>
    </Link>
  );
}

export default function DevelopersSection() {
  const { t } = useTranslation();
  const [items, setItems] = useState<IDeveloper[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollerRef = useRef<HTMLDivElement>(null);

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

  const scrollBy = (delta: number) => {
    scrollerRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  };

  if (!loading && items.length === 0) return null;

  return (
    <section className="py-12">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl text-foreground sm:text-4xl">
            {t(
              "pages.developers.section_title",
              "Projects by developers in Uzbekistan",
            )}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {t(
              "pages.developers.section_subtitle",
              "Discover trusted developers shaping Uzbekistan's skyline.",
            )}
          </p>
        </div>

        {/* Scroll arrows — desktop only */}
        <div className="hidden flex-shrink-0 gap-2 md:flex">
          <button
            type="button"
            aria-label="Scroll left"
            onClick={() => scrollBy(-320)}
            className="flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            aria-label="Scroll right"
            onClick={() => scrollBy(320)}
            className="flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-44 w-44 flex-shrink-0 animate-pulse rounded-2xl bg-muted/60"
            />
          ))}
        </div>
      ) : (
        <div
          ref={scrollerRef}
          className="hide-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 sm:gap-4"
        >
          {items.map((d, idx) => (
            <DeveloperLogoCard key={d._id} developer={d} active={idx === 2} />
          ))}
        </div>
      )}

      <div className="mt-6 text-center">
        <Link
          to="/developers"
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-5 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <Building2 className="h-4 w-4" />
          {t("pages.developers.see_all", "All developers in Uzbekistan")}
        </Link>
      </div>
    </section>
  );
}
