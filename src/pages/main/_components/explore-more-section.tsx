import { Link } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

const CITIES = [
  "Kuala Lumpur",
  "Penang",
  "Johor Bahru",
  "Selangor",
  "Kota Kinabalu",
  "Kuching",
  "Ipoh",
  "Putrajaya",
];

interface ExploreCategory {
  key: string;
  labelKey: string;
  fallback: string;
  links: { labelKey: string; fallback: string; href: string }[];
}

const RENT_CATEGORIES: ExploreCategory[] = [
  {
    key: "find_apartments",
    labelKey: "pages.explore.find_apartments",
    fallback: "Find apartments",
    links: [
      {
        labelKey: "pages.explore.apartments_kl",
        fallback: "Apartments for rent in Kuala Lumpur",
        href: "/filter-nav?category=APARTMENT_RENT",
      },
      {
        labelKey: "pages.explore.studio_kl",
        fallback: "Studio Apartments for rent in KL",
        href: "/filter-nav?category=APARTMENT_RENT",
      },
      {
        labelKey: "pages.explore.furnished_kl",
        fallback: "Furnished Apartments for rent in KL",
        href: "/filter-nav?category=APARTMENT_RENT",
      },
      {
        labelKey: "pages.explore.apartments_penang",
        fallback: "Apartments for rent in Penang",
        href: "/filter-nav?category=APARTMENT_RENT",
      },
      {
        labelKey: "pages.explore.apartments_jb",
        fallback: "Apartments for rent in Johor Bahru",
        href: "/filter-nav?category=APARTMENT_RENT",
      },
      {
        labelKey: "pages.explore.apartments_selangor",
        fallback: "Apartments for rent in Selangor",
        href: "/filter-nav?category=APARTMENT_RENT",
      },
      {
        labelKey: "pages.explore.apartments_monthly",
        fallback: "Monthly Apartments for rent",
        href: "/filter-nav?category=APARTMENT_RENT",
      },
      {
        labelKey: "pages.explore.apartments_montkiara",
        fallback: "Apartments for rent in Mont Kiara",
        href: "/filter-nav?category=APARTMENT_RENT",
      },
      {
        labelKey: "pages.explore.apartments_bangsar",
        fallback: "Apartments for rent in Bangsar",
        href: "/filter-nav?category=APARTMENT_RENT",
      },
      {
        labelKey: "pages.explore.apartments_klcc",
        fallback: "Apartments for rent in KLCC",
        href: "/filter-nav?category=APARTMENT_RENT",
      },
    ],
  },
];

const BUY_CATEGORIES: ExploreCategory[] = [
  {
    key: "find_apartments",
    labelKey: "pages.explore.find_apartments_buy",
    fallback: "Find apartments to buy",
    links: [
      {
        labelKey: "pages.explore.buy_kl",
        fallback: "Apartments for sale in Kuala Lumpur",
        href: "/filter-nav?category=APARTMENT_SALE",
      },
      {
        labelKey: "pages.explore.buy_studio_kl",
        fallback: "Studio Apartments for sale in KL",
        href: "/filter-nav?category=APARTMENT_SALE",
      },
      {
        labelKey: "pages.explore.buy_penang",
        fallback: "Apartments for sale in Penang",
        href: "/filter-nav?category=APARTMENT_SALE",
      },
      {
        labelKey: "pages.explore.buy_jb",
        fallback: "Apartments for sale in Johor Bahru",
        href: "/filter-nav?category=APARTMENT_SALE",
      },
      {
        labelKey: "pages.explore.buy_montkiara",
        fallback: "Apartments for sale in Mont Kiara",
        href: "/filter-nav?category=APARTMENT_SALE",
      },
      {
        labelKey: "pages.explore.buy_bangsar",
        fallback: "Apartments for sale in Bangsar",
        href: "/filter-nav?category=APARTMENT_SALE",
      },
      {
        labelKey: "pages.explore.buy_klcc",
        fallback: "Apartments for sale in KLCC",
        href: "/filter-nav?category=APARTMENT_SALE",
      },
      {
        labelKey: "pages.explore.buy_subang",
        fallback: "Apartments for sale in Subang Jaya",
        href: "/filter-nav?category=APARTMENT_SALE",
      },
    ],
  },
];

const INVEST_CATEGORIES: ExploreCategory[] = [
  {
    key: "find_projects",
    labelKey: "pages.explore.find_projects",
    fallback: "New off-plan projects",
    links: [
      {
        labelKey: "pages.explore.projects_kl",
        fallback: "New projects in Kuala Lumpur",
        href: "/projects?city=Kuala%20Lumpur",
      },
      {
        labelKey: "pages.explore.projects_penang",
        fallback: "New projects in Penang",
        href: "/projects?city=Penang",
      },
      {
        labelKey: "pages.explore.projects_jb",
        fallback: "New projects in Johor Bahru",
        href: "/projects?city=Johor%20Bahru",
      },
      {
        labelKey: "pages.explore.projects_pre_launch",
        fallback: "Pre-launch projects",
        href: "/projects?status=pre_launch",
      },
      {
        labelKey: "pages.explore.projects_on_sale",
        fallback: "Projects on sale",
        href: "/projects?status=on_sale",
      },
      {
        labelKey: "pages.explore.developers_all",
        fallback: "All developers",
        href: "/developers",
      },
    ],
  },
];

const TAB_DATA: Record<string, ExploreCategory[]> = {
  rent: RENT_CATEGORIES,
  buy: BUY_CATEGORIES,
  invest: INVEST_CATEGORIES,
};

export default function ExploreMoreSection() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<keyof typeof TAB_DATA>("rent");
  const [activeCity, setActiveCity] = useState(CITIES[0]);

  const tabs = [
    { key: "rent", labelKey: "common.rent_apartments", fallback: "Rent" },
    { key: "buy", labelKey: "common.buy", fallback: "Buy" },
    { key: "invest", labelKey: "pages.explore.invest", fallback: "Invest" },
  ] as const;

  return (
    <section className="py-12">
      <div className="mb-8">
        <h2 className="font-display text-3xl text-foreground sm:text-4xl">
          {t("pages.explore.title", "Explore more")}
        </h2>
        <p className="mt-2 text-muted-foreground">
          {t(
            "pages.explore.subtitle",
            "Browse listings by area and category across Malaysia.",
          )}
        </p>
      </div>

      {/* Top tabs */}
      <div className="border-b border-border/60">
        <div className="flex items-center gap-1">
          {tabs.map((tb) => (
            <button
              key={tb.key}
              type="button"
              onClick={() => setTab(tb.key)}
              className={cn(
                "border-b-2 px-4 py-3 text-sm font-semibold transition-all",
                tab === tb.key
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {t(tb.labelKey, tb.fallback)}
            </button>
          ))}
        </div>
      </div>

      {/* City pills */}
      <div className="mt-6 flex flex-wrap gap-2">
        {CITIES.map((city) => (
          <button
            key={city}
            type="button"
            onClick={() => setActiveCity(city)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-xs font-semibold transition-all",
              activeCity === city
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-foreground hover:border-foreground/30",
            )}
          >
            {city}
          </button>
        ))}
      </div>

      {/* Links list */}
      <div className="mt-8 space-y-8">
        {TAB_DATA[tab].map((cat) => (
          <div key={cat.key}>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">
              {t(cat.labelKey, cat.fallback)}
            </h3>
            <div className="grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
              {cat.links.map((lnk) => (
                <Link
                  key={lnk.labelKey}
                  to={lnk.href}
                  className="text-sm text-foreground/80 hover:text-primary hover:underline transition-colors"
                >
                  {t(lnk.labelKey, lnk.fallback)}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
