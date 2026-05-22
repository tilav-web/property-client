import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import {
  Award,
  Briefcase,
  Bus,
  ChevronLeft,
  ChevronRight,
  Leaf,
  Plane,
  Sparkles,
  Star,
  TreePine,
  Trees,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  communityService,
  type ICommunity,
  type ICommunityFilter,
} from "@/services/community.service";

const ICONS: Record<string, LucideIcon> = {
  Award,
  Wallet,
  Briefcase,
  Bus,
  Leaf,
  Plane,
  Users,
  TreePine,
  Trees,
  Sparkles,
};

const REGIONS = ["Qashqadaryo", "Toshkent", "Samarqand", "Buxoro"];

/** Card image fallback — admin rasm yuklamagan bo'lsa, gradient + emoji. */
const GRADIENTS = [
  "from-sky-300 via-indigo-300 to-purple-300",
  "from-emerald-300 via-teal-300 to-cyan-300",
  "from-amber-300 via-orange-300 to-rose-300",
  "from-rose-300 via-pink-300 to-fuchsia-300",
  "from-violet-300 via-purple-300 to-indigo-300",
  "from-lime-300 via-emerald-300 to-teal-300",
];

function gradientFor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  return GRADIENTS[Math.abs(h) % GRADIENTS.length];
}

function buildSearchHref(c: ICommunity): string {
  if (c.searchHref) return c.searchHref;
  return `/filter-nav?category=APARTMENT_SALE&address=${encodeURIComponent(c.name)}`;
}

function CommunityCard({ community }: Readonly<{ community: ICommunity }>) {
  const { t } = useTranslation();
  const stars = Math.round(community.rating);
  const href = buildSearchHref(community);
  return (
    <div className="flex w-[280px] flex-shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover">
      <div
        className={cn(
          "relative h-[180px] overflow-hidden",
          !community.image && `flex items-center justify-center bg-gradient-to-br text-5xl ${gradientFor(community.name)}`,
        )}
      >
        {community.image ? (
          <img
            src={community.image}
            alt={community.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <span aria-hidden="true">🏘</span>
        )}
        {community.badge && (
          <span className="absolute right-2 top-2 rounded-md bg-amber-500 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
            {community.badge}
          </span>
        )}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 text-xs font-semibold text-white">
          <span>{community.rating.toFixed(1)}</span>
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={10}
                className={i < stars ? "fill-amber-400 text-amber-400" : "text-white/40"}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="text-sm font-semibold text-foreground">
          {community.name}
        </h3>
        {community.propertyCount > 0 && (
          <p className="text-xs text-muted-foreground">
            {community.propertyCount} {t("pages.top_communities.properties", { defaultValue: "ta mulk" })}
          </p>
        )}
        <div className="mt-auto grid grid-cols-2 gap-2">
          <Link
            to={href}
            className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            {t("pages.top_communities.search", { defaultValue: "Qidiruv" })}
          </Link>
          <Link
            to={href}
            className="inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-xs font-semibold text-primary hover:underline"
          >
            {t("pages.top_communities.explore", { defaultValue: "Ko'rish" })}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function TopCommunitiesSection() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [region, setRegion] = useState(REGIONS[0]);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const { data: filters = [] } = useQuery({
    queryKey: ["community-filters"],
    queryFn: () => communityService.listFilters(),
    staleTime: 10 * 60 * 1000,
  });

  const { data: communities = [], isLoading } = useQuery({
    queryKey: ["communities", { region, filter: activeFilter }],
    queryFn: () =>
      communityService.list({
        region,
        filter: activeFilter ?? undefined,
      }),
    staleTime: 5 * 60 * 1000,
  });

  // Birinchi filterni avtomatik tanlash (Mashhur)
  const effectiveActiveFilter = useMemo(() => {
    if (activeFilter) return activeFilter;
    return filters[0]?._id ?? null;
  }, [activeFilter, filters]);

  // Section hech qachon community yo'q bo'lsa yashir
  if (!isLoading && filters.length === 0 && communities.length === 0) {
    return null;
  }

  const scrollBy = (direction: number) => {
    scrollerRef.current?.scrollBy({ left: direction, behavior: "smooth" });
  };

  return (
    <section className="py-12">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-12 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <Trees className="size-6" />
          </div>
          <h2 className="font-display text-2xl text-foreground sm:text-3xl">
            {t("pages.top_communities.title", {
              defaultValue: "Top tumanlar bo'yicha qidirish",
            })}
          </h2>
        </div>
        <div className="hidden flex-shrink-0 items-center gap-2 sm:flex">
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
            className="flex size-10 items-center justify-center rounded-full border border-primary bg-card text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>

      {/* Filter pills + region dropdown */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <div className="flex flex-1 flex-wrap items-center gap-2 overflow-x-auto">
          {filters.map((f: ICommunityFilter) => {
            const Icon = ICONS[f.icon] ?? Sparkles;
            const active = effectiveActiveFilter === f._id;
            return (
              <button
                key={f._id}
                type="button"
                onClick={() => setActiveFilter(f._id)}
                className={cn(
                  "inline-flex flex-shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all sm:text-sm",
                  active
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-foreground hover:border-primary/40",
                )}
              >
                <Icon className="size-3.5" />
                {f.name}
              </button>
            );
          })}
        </div>
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="h-9 flex-shrink-0 appearance-none rounded-full border border-border bg-card px-4 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 sm:text-sm"
          aria-label="Region"
        >
          {REGIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {/* Cards scroller */}
      {isLoading ? (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-[320px] w-[280px] flex-shrink-0 animate-pulse rounded-2xl bg-muted/60"
            />
          ))}
        </div>
      ) : communities.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/60 p-12 text-center text-sm text-muted-foreground">
          {t("pages.top_communities.empty", {
            defaultValue: "Bu kategoriyada hozircha tumanlar yo'q",
          })}
        </div>
      ) : (
        <div
          ref={scrollerRef}
          className="hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2"
        >
          {communities.map((c) => (
            <CommunityCard key={c._id} community={c} />
          ))}
        </div>
      )}
    </section>
  );
}
