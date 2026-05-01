import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  DollarSign,
  Home,
  Sparkles,
  TrendingUp,
} from "lucide-react";

interface CardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  cta: string;
  accent: string;
}

function CommunityCard({
  icon,
  title,
  description,
  link,
  cta,
  accent,
}: CardProps) {
  return (
    <Link
      to={link}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card p-6 transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
    >
      <div
        className={`mb-4 flex size-14 items-center justify-center rounded-2xl ${accent}`}
      >
        {icon}
      </div>
      <h3 className="font-display text-xl text-foreground">{title}</h3>
      <p className="mt-2 flex-1 text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
      <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
        {cta}
        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}

export default function CommunitiesSection() {
  const { t } = useTranslation();

  return (
    <section className="py-12">
      <div className="mb-8">
        <h2 className="font-display text-3xl text-foreground sm:text-4xl">
          {t("pages.communities.title", "Find your perfect area")}
        </h2>
        <p className="mt-2 text-muted-foreground">
          {t(
            "pages.communities.subtitle",
            "Curated areas across Malaysia for every lifestyle and budget.",
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <CommunityCard
          icon={<Sparkles className="size-7 text-primary" />}
          accent="bg-accent"
          title={t("pages.communities.popular_title", "Popular Communities")}
          description={t(
            "pages.communities.popular_desc",
            "Most loved neighborhoods — KLCC, Mont Kiara, Bangsar.",
          )}
          link="/filter-nav?category=APARTMENT_SALE"
          cta={t("pages.communities.popular_cta", "Explore Popular Areas")}
        />
        <CommunityCard
          icon={<DollarSign className="size-7 text-emerald-700" />}
          accent="bg-emerald-50"
          title={t("pages.communities.budget_title", "Budget-Friendly")}
          description={t(
            "pages.communities.budget_desc",
            "Discover communities within your budget without compromise.",
          )}
          link="/filter-nav?category=APARTMENT_RENT"
          cta={t("pages.communities.budget_cta", "Explore Affordable Areas")}
        />
        <CommunityCard
          icon={<Home className="size-7 text-orange-700" />}
          accent="bg-orange-50"
          title={t("pages.communities.family_title", "Family-Friendly")}
          description={t(
            "pages.communities.family_desc",
            "Best schools, parks and quiet neighborhoods for your family.",
          )}
          link="/filter-nav?category=APARTMENT_SALE"
          cta={t("pages.communities.family_cta", "Explore Family Areas")}
        />
        <CommunityCard
          icon={<TrendingUp className="size-7 text-blue-700" />}
          accent="bg-blue-50"
          title={t("pages.communities.invest_title", "Best for Investment")}
          description={t(
            "pages.communities.invest_desc",
            "High-yield areas with strong rental demand and capital growth.",
          )}
          link="/projects"
          cta={t("pages.communities.invest_cta", "Invest in the Best")}
        />
      </div>
    </section>
  );
}
