import {
  BarChart3,
  Building2,
  CheckCircle,
  Map,
  Calculator,
  TrendingUp,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const FEATURES = [
  {
    icon: BarChart3,
    titleKey: "pages.main_page.supercharge.area_insights",
    descKey: "pages.main_page.supercharge.area_insights_desc",
    href: "/search",
  },
  {
    icon: Calculator,
    titleKey: "pages.main_page.supercharge.mortgage_calc",
    descKey: "pages.main_page.supercharge.mortgage_calc_desc",
    href: "/search",
  },
  {
    icon: TrendingUp,
    titleKey: "pages.main_page.supercharge.price_trends",
    descKey: "pages.main_page.supercharge.price_trends_desc",
    href: "/search",
  },
  {
    icon: CheckCircle,
    titleKey: "pages.main_page.supercharge.verified_listings",
    descKey: "pages.main_page.supercharge.verified_listings_desc",
    href: "/search?is_premium=true",
  },
  {
    icon: Map,
    titleKey: "pages.main_page.supercharge.explore_map",
    descKey: "pages.main_page.supercharge.explore_map_desc",
    href: "/map",
  },
  {
    icon: Building2,
    titleKey: "pages.main_page.supercharge.new_projects",
    descKey: "pages.main_page.supercharge.new_projects_desc",
    href: "/search?is_new=true",
  },
];

export default function SuperchargeSection() {
  const { t } = useTranslation();

  return (
    <section className="py-12 [content-visibility:auto] [contain-intrinsic-size:1px_600px]">
      <div className="mb-8">
        <h2 className="font-display text-3xl text-foreground sm:text-4xl">
          {t("pages.main_page.home_search_simplified")}
        </h2>
        <p className="mt-2 text-muted-foreground">
          {t("pages.main_page.home_search_simplified_desc")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link
              key={feature.titleKey}
              to={feature.href}
              className="group flex items-start gap-4 rounded-2xl border border-border/60 bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card-hover"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-foreground transition-colors group-hover:bg-primary/15 group-hover:text-primary">
                <Icon size={22} />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-foreground group-hover:text-primary">
                  {t(feature.titleKey)}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {t(feature.descKey)}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
