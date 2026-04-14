import {
  BarChart3,
  BrainCircuit,
  Building2,
  CheckCircle,
  Map,
  Calculator,
  TrendingUp,
  Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const FEATURES = [
  {
    icon: BarChart3,
    titleKey: "pages.main_page.supercharge.area_insights",
    descKey: "pages.main_page.supercharge.area_insights_desc",
    href: "/search",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Calculator,
    titleKey: "pages.main_page.supercharge.mortgage_calc",
    descKey: "pages.main_page.supercharge.mortgage_calc_desc",
    href: "/search",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: BrainCircuit,
    titleKey: "pages.main_page.supercharge.ai_search",
    descKey: "pages.main_page.supercharge.ai_search_desc",
    href: "/ai-agent",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: Users,
    titleKey: "pages.main_page.supercharge.super_agents",
    descKey: "pages.main_page.supercharge.super_agents_desc",
    href: "/sellers",
    color: "bg-orange-50 text-orange-600",
  },
  {
    icon: TrendingUp,
    titleKey: "pages.main_page.supercharge.price_trends",
    descKey: "pages.main_page.supercharge.price_trends_desc",
    href: "/search",
    color: "bg-rose-50 text-rose-600",
  },
  {
    icon: CheckCircle,
    titleKey: "pages.main_page.supercharge.verified_listings",
    descKey: "pages.main_page.supercharge.verified_listings_desc",
    href: "/search?is_premium=true",
    color: "bg-teal-50 text-teal-600",
  },
  {
    icon: Map,
    titleKey: "pages.main_page.supercharge.explore_map",
    descKey: "pages.main_page.supercharge.explore_map_desc",
    href: "/map",
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    icon: Building2,
    titleKey: "pages.main_page.supercharge.new_projects",
    descKey: "pages.main_page.supercharge.new_projects_desc",
    href: "/search?is_new=true",
    color: "bg-amber-50 text-amber-600",
  },
];

export default function SuperchargeSection() {
  const { t } = useTranslation();

  return (
    <section className="py-12 [content-visibility:auto] [contain-intrinsic-size:1px_600px]">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
          {t("pages.main_page.home_search_simplified")}
        </h2>
        <p className="mt-2 text-gray-500">
          {t("pages.main_page.home_search_simplified_desc")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link
              key={feature.titleKey}
              to={feature.href}
              className="group flex items-start gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:border-purple-100 hover:shadow-md"
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${feature.color}`}
              >
                <Icon size={22} />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-purple-700">
                  {t(feature.titleKey)}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-gray-500">
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
