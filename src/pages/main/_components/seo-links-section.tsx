import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

interface LinkGroup {
  titleKey: string;
  links: { label: string; href: string }[];
}

const SEO_LINK_GROUPS: LinkGroup[] = [
  {
    titleKey: "pages.main_page.seo_links.apartments_for_rent",
    links: [
      { label: "1 Bedroom Apartments for Rent", href: "/search?category=APARTMENT_RENT&bdr=1" },
      { label: "2 Bedroom Apartments for Rent", href: "/search?category=APARTMENT_RENT&bdr=2" },
      { label: "3 Bedroom Apartments for Rent", href: "/search?category=APARTMENT_RENT&bdr=3" },
      { label: "4 Bedroom Apartments for Rent", href: "/search?category=APARTMENT_RENT&bdr=4" },
      { label: "Studio Apartments for Rent", href: "/search?category=APARTMENT_RENT&bdr=0" },
      { label: "Furnished Apartments for Rent", href: "/search?category=APARTMENT_RENT&furnished=true" },
    ],
  },
  {
    titleKey: "pages.main_page.seo_links.apartments_for_sale",
    links: [
      { label: "1 Bedroom Apartments for Sale", href: "/search?category=APARTMENT_SALE&bdr=1" },
      { label: "2 Bedroom Apartments for Sale", href: "/search?category=APARTMENT_SALE&bdr=2" },
      { label: "3 Bedroom Apartments for Sale", href: "/search?category=APARTMENT_SALE&bdr=3" },
      { label: "4 Bedroom Apartments for Sale", href: "/search?category=APARTMENT_SALE&bdr=4" },
      { label: "Studio Apartments for Sale", href: "/search?category=APARTMENT_SALE&bdr=0" },
      { label: "Premium Properties for Sale", href: "/search?category=APARTMENT_SALE&is_premium=true" },
    ],
  },
  {
    titleKey: "pages.main_page.seo_links.properties_by_type",
    links: [
      { label: "All Rentals", href: "/search?category=APARTMENT_RENT" },
      { label: "All Sales", href: "/search?category=APARTMENT_SALE" },
      { label: "Premium Properties", href: "/search?is_premium=true" },
      { label: "New Listings", href: "/search?is_new=true" },
      { label: "Properties on Map", href: "/map" },
      { label: "AI Property Search", href: "/ai-agent" },
    ],
  },
  {
    titleKey: "pages.main_page.seo_links.explore_areas",
    links: [
      { label: "Browse All Sellers", href: "/sellers" },
      { label: "Top Rated Properties", href: "/search?rating=4" },
      { label: "Affordable Rentals", href: "/search?category=APARTMENT_RENT&maxPrice=5000" },
      { label: "Luxury Properties", href: "/search?minPrice=50000" },
      { label: "Properties with Parking", href: "/search?parking=true" },
      { label: "Furnished Properties", href: "/search?furnished=true" },
    ],
  },
];

export default function SeoLinksSection() {
  const { t } = useTranslation();

  return (
    <section className="border-t border-gray-200 py-10 [content-visibility:auto] [contain-intrinsic-size:1px_400px]">
      <h2 className="mb-6 text-xl font-bold text-gray-900">
        {t("pages.main_page.seo_links.popular_searches")}
      </h2>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {SEO_LINK_GROUPS.map((group) => (
          <div key={group.titleKey}>
            <h3 className="mb-3 text-sm font-semibold text-gray-800">
              {t(group.titleKey)}
            </h3>
            <ul className="space-y-2">
              {group.links.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-500 transition-colors hover:text-purple-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
