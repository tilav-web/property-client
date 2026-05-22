import { Link } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import {
  ArrowUpRight,
  Coins,
  HeartHandshake,
  Home,
  Sparkles,
  TrendingUp,
} from "lucide-react";

interface IllustrationCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  cta: string;
  link: string;
  bg: string;
  iconBg: string;
  iconColor: string;
}

function IllustrationCard({
  icon,
  title,
  description,
  cta,
  link,
  bg,
  iconBg,
  iconColor,
}: IllustrationCardProps) {
  return (
    <Link
      to={link}
      className="group flex overflow-hidden rounded-2xl border border-border/50 bg-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
    >
      <div
        className={cn(
          "flex w-28 flex-shrink-0 items-center justify-center sm:w-40",
          bg,
        )}
      >
        <div
          className={cn(
            "flex size-16 items-center justify-center rounded-2xl shadow-sm sm:size-20",
            iconBg,
            iconColor,
          )}
        >
          {icon}
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center px-4 py-5 sm:px-6 sm:py-6">
        <h3 className="font-display text-base font-semibold text-foreground sm:text-lg">
          {title}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground sm:text-sm">
          {description}
        </p>
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary underline-offset-2 group-hover:underline sm:text-sm">
          {cta}
          <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

const TABS = [
  { key: "explore", labelKey: "pages.communities.tab_explore", fallback: "Explore" },
  { key: "rent", labelKey: "common.rent_apartments", fallback: "Rent" },
  { key: "buy", labelKey: "common.buy", fallback: "Buy" },
  { key: "invest", labelKey: "pages.explore.invest", fallback: "Invest" },
] as const;

export default function CommunitiesSection() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]["key"]>(
    "explore",
  );

  // For now all tabs share the same 4 cards; CTA links flex per tab
  const linkSuffix = (() => {
    switch (activeTab) {
      case "rent":
        return "?category=APARTMENT_RENT";
      case "buy":
        return "?category=APARTMENT_SALE";
      case "invest":
        return "?status=on_sale";
      default:
        return "";
    }
  })();

  return (
    <section className="py-12">
      <div className="mb-6">
        <h2 className="font-display text-3xl text-foreground sm:text-4xl">
          {t("pages.main_page.home_search_simplified", "Supercharge your search")}
        </h2>
        <p className="mt-2 text-muted-foreground">
          {t(
            "pages.main_page.home_search_simplified_desc",
            "Explore the most home listings in Qashqadaryo. With the most reliable information. All at your fingertips.",
          )}
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-border/60">
        <div className="flex flex-wrap items-center gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "border-b-2 px-3 py-2.5 text-sm font-semibold transition-all sm:px-4 sm:py-3",
                activeTab === tab.key
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {t(tab.labelKey, tab.fallback)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <IllustrationCard
          icon={<Sparkles className="size-7 sm:size-9" />}
          bg="bg-rose-50"
          iconBg="bg-card"
          iconColor="text-rose-500"
          title={t("pages.communities.popular_title", "Popular Communities")}
          description={t(
            "pages.communities.popular_desc",
            "Check out the city's most popular communities. Everyone loves these, and so will you.",
          )}
          link={`/filter-nav${linkSuffix || "?category=APARTMENT_SALE"}`}
          cta={t("pages.communities.popular_cta", "Explore Popular Areas")}
        />

        <IllustrationCard
          icon={<Coins className="size-7 sm:size-9" />}
          bg="bg-amber-50"
          iconBg="bg-card"
          iconColor="text-amber-600"
          title={t("pages.communities.budget_title", "Budget-Friendly")}
          description={t(
            "pages.communities.budget_desc",
            "Discover communities within your budget without compromise.",
          )}
          link={`/filter-nav${linkSuffix || "?category=APARTMENT_RENT"}`}
          cta={t("pages.communities.budget_cta", "Explore Affordable Areas")}
        />

        <IllustrationCard
          icon={<HeartHandshake className="size-7 sm:size-9" />}
          bg="bg-violet-50"
          iconBg="bg-card"
          iconColor="text-violet-600"
          title={t("pages.communities.family_title", "Family-Friendly")}
          description={t(
            "pages.communities.family_desc",
            "Uncover the best areas to live with your family.",
          )}
          link={`/filter-nav${linkSuffix || "?category=APARTMENT_SALE"}`}
          cta={t("pages.communities.family_cta", "Explore Family-Friendly Areas")}
        />

        <IllustrationCard
          icon={<TrendingUp className="size-7 sm:size-9" />}
          bg="bg-sky-50"
          iconBg="bg-card"
          iconColor="text-sky-600"
          title={t("pages.communities.invest_title", "Best Areas for Investment")}
          description={t(
            "pages.communities.invest_desc",
            "Invest wisely in these highly demanded areas.",
          )}
          link="/projects"
          cta={t("pages.communities.invest_cta", "Invest in the Best")}
        />

        <IllustrationCard
          icon={<Home className="size-7 sm:size-9" />}
          bg="bg-emerald-50"
          iconBg="bg-card"
          iconColor="text-emerald-600"
          title={t(
            "pages.communities.luxury_title",
            "Luxury Homes",
          )}
          description={t(
            "pages.communities.luxury_desc",
            "Browse top-tier residences in Qashqadaryo's most prestigious neighborhoods.",
          )}
          link="/filter-nav?category=APARTMENT_SALE"
          cta={t("pages.communities.luxury_cta", "Explore Luxury")}
        />
      </div>
    </section>
  );
}
