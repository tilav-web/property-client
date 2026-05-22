import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Award,
  Bus,
  ChevronLeft,
  ChevronRight,
  Leaf,
  Plane,
  Star,
  TreePine,
  Trees,
  Users,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterPill {
  key: string;
  labelKey: string;
  fallback: string;
  icon: React.ComponentType<{ className?: string }>;
}

const FILTERS: FilterPill[] = [
  { key: "popular", labelKey: "pages.top_communities.popular", fallback: "Mashhur", icon: Award },
  { key: "budget", labelKey: "pages.top_communities.budget", fallback: "Arzon", icon: Wallet },
  { key: "business", labelKey: "pages.top_communities.business", fallback: "Biznes uchun", icon: Bus },
  { key: "eco", labelKey: "pages.top_communities.eco", fallback: "Ekologik toza", icon: Leaf },
  { key: "expats", labelKey: "pages.top_communities.expats", fallback: "Chet ellik", icon: Plane },
  { key: "family", labelKey: "pages.top_communities.family", fallback: "Oilaviy", icon: Users },
  { key: "green", labelKey: "pages.top_communities.green", fallback: "Yashil hududlar", icon: TreePine },
];

interface Community {
  key: string;
  name: string;
  rating: number;
  /** Tailwind gradient class — toza CSS, rasm o'rniga */
  gradient: string;
  /** Card top icon */
  emoji: string;
  searchHref: string;
}

const COMMUNITIES_BY_FILTER: Record<string, Community[]> = {
  popular: [
    {
      key: "qarshi-markaz",
      name: "Qarshi markaz",
      rating: 4.6,
      gradient: "from-sky-300 via-indigo-300 to-purple-300",
      emoji: "🏛",
      searchHref: "/filter-nav?category=APARTMENT_SALE",
    },
    {
      key: "yangi-qarshi",
      name: "Yangi Qarshi",
      rating: 4.5,
      gradient: "from-emerald-300 via-teal-300 to-cyan-300",
      emoji: "🏙",
      searchHref: "/filter-nav?category=APARTMENT_SALE",
    },
    {
      key: "cosmos-rayoni",
      name: "Cosmos rayoni",
      rating: 4.4,
      gradient: "from-amber-300 via-orange-300 to-rose-300",
      emoji: "🛍",
      searchHref: "/filter-nav?category=APARTMENT_RENT",
    },
    {
      key: "shahrisabz",
      name: "Shahrisabz",
      rating: 4.7,
      gradient: "from-rose-300 via-pink-300 to-fuchsia-300",
      emoji: "🏯",
      searchHref: "/filter-nav?category=APARTMENT_SALE",
    },
    {
      key: "kitob",
      name: "Kitob",
      rating: 4.2,
      gradient: "from-violet-300 via-purple-300 to-indigo-300",
      emoji: "⛰",
      searchHref: "/filter-nav?category=APARTMENT_SALE",
    },
    {
      key: "yakkabog",
      name: "Yakkabog'",
      rating: 4.1,
      gradient: "from-lime-300 via-emerald-300 to-teal-300",
      emoji: "🌳",
      searchHref: "/filter-nav?category=APARTMENT_SALE",
    },
  ],
  budget: [
    {
      key: "guzor",
      name: "G'uzor",
      rating: 4.0,
      gradient: "from-slate-300 via-gray-300 to-zinc-300",
      emoji: "🏘",
      searchHref: "/filter-nav?category=APARTMENT_SALE",
    },
    {
      key: "qamashi",
      name: "Qamashi",
      rating: 3.9,
      gradient: "from-stone-300 via-neutral-300 to-zinc-300",
      emoji: "🏘",
      searchHref: "/filter-nav?category=APARTMENT_SALE",
    },
    {
      key: "koson",
      name: "Koson",
      rating: 4.1,
      gradient: "from-amber-200 via-yellow-200 to-orange-200",
      emoji: "🌾",
      searchHref: "/filter-nav?category=APARTMENT_RENT",
    },
    {
      key: "chiroqchi",
      name: "Chiroqchi",
      rating: 3.8,
      gradient: "from-emerald-200 via-green-200 to-lime-200",
      emoji: "🏞",
      searchHref: "/filter-nav?category=APARTMENT_SALE",
    },
  ],
  business: [
    {
      key: "qarshi-markaz-biz",
      name: "Qarshi markaz",
      rating: 4.8,
      gradient: "from-blue-300 via-sky-300 to-cyan-300",
      emoji: "🏢",
      searchHref: "/filter-nav?category=APARTMENT_RENT",
    },
    {
      key: "yangi-qarshi-biz",
      name: "Yangi Qarshi",
      rating: 4.5,
      gradient: "from-indigo-300 via-blue-300 to-sky-300",
      emoji: "🏢",
      searchHref: "/filter-nav?category=APARTMENT_RENT",
    },
  ],
  eco: [
    {
      key: "shahrisabz-eco",
      name: "Shahrisabz",
      rating: 4.6,
      gradient: "from-green-300 via-emerald-300 to-teal-300",
      emoji: "🌿",
      searchHref: "/filter-nav?category=APARTMENT_SALE",
    },
    {
      key: "kitob-eco",
      name: "Kitob",
      rating: 4.4,
      gradient: "from-teal-300 via-cyan-300 to-sky-300",
      emoji: "🌲",
      searchHref: "/filter-nav?category=APARTMENT_SALE",
    },
  ],
  expats: [
    {
      key: "qarshi-markaz-exp",
      name: "Qarshi markaz",
      rating: 4.5,
      gradient: "from-purple-300 via-pink-300 to-rose-300",
      emoji: "🌍",
      searchHref: "/filter-nav?category=APARTMENT_RENT",
    },
    {
      key: "yangi-qarshi-exp",
      name: "Yangi Qarshi",
      rating: 4.3,
      gradient: "from-fuchsia-300 via-purple-300 to-violet-300",
      emoji: "🌍",
      searchHref: "/filter-nav?category=APARTMENT_RENT",
    },
  ],
  family: [
    {
      key: "yangi-qarshi-fam",
      name: "Yangi Qarshi",
      rating: 4.7,
      gradient: "from-pink-300 via-rose-300 to-red-300",
      emoji: "👨‍👩‍👧",
      searchHref: "/filter-nav?category=APARTMENT_SALE",
    },
    {
      key: "shahrisabz-fam",
      name: "Shahrisabz",
      rating: 4.6,
      gradient: "from-rose-300 via-orange-300 to-amber-300",
      emoji: "👨‍👩‍👧",
      searchHref: "/filter-nav?category=APARTMENT_SALE",
    },
  ],
  green: [
    {
      key: "shahrisabz-grn",
      name: "Shahrisabz",
      rating: 4.7,
      gradient: "from-green-400 via-emerald-400 to-teal-400",
      emoji: "🌳",
      searchHref: "/filter-nav?category=APARTMENT_SALE",
    },
    {
      key: "kitob-grn",
      name: "Kitob",
      rating: 4.5,
      gradient: "from-emerald-400 via-green-400 to-lime-400",
      emoji: "🌲",
      searchHref: "/filter-nav?category=APARTMENT_SALE",
    },
  ],
};

const REGIONS = ["Qashqadaryo", "Toshkent", "Samarqand", "Buxoro"];

function CommunityCard({ community }: Readonly<{ community: Community }>) {
  const { t } = useTranslation();
  const stars = Math.round(community.rating);
  return (
    <div className="flex w-[280px] flex-shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover">
      {/* Image / gradient */}
      <div
        className={cn(
          "relative flex h-[180px] items-center justify-center bg-gradient-to-br text-5xl",
          community.gradient,
        )}
      >
        <span className="drop-shadow-md" aria-hidden="true">
          {community.emoji}
        </span>
        {/* Rating overlay */}
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
      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="text-sm font-semibold text-foreground">{community.name}</h3>
        <div className="mt-auto grid grid-cols-2 gap-2">
          <Link
            to={community.searchHref}
            className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            {t("pages.top_communities.search", { defaultValue: "Qidiruv" })}
          </Link>
          <Link
            to={community.searchHref}
            className="inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-xs font-semibold text-primary hover:underline"
          >
            {t("pages.top_communities.explore", { defaultValue: "Hududni ko'rish" })}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function TopCommunitiesSection() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<string>("popular");
  const [region, setRegion] = useState(REGIONS[0]);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const communities =
    COMMUNITIES_BY_FILTER[activeFilter] ?? COMMUNITIES_BY_FILTER.popular;

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
          {FILTERS.map((f) => {
            const Icon = f.icon;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setActiveFilter(f.key)}
                className={cn(
                  "inline-flex flex-shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all sm:text-sm",
                  activeFilter === f.key
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-foreground hover:border-primary/40",
                )}
              >
                <Icon className="size-3.5" />
                {t(f.labelKey, f.fallback)}
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
      <div
        ref={scrollerRef}
        className="hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2"
      >
        {communities.map((c) => (
          <CommunityCard key={c.key} community={c} />
        ))}
      </div>
    </section>
  );
}
