import HeroSection from "@/components/common/hero-section";
import { heroImage, heroImageSrcSet } from "@/utils/shared";
import { Suspense, lazy, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { siteSettingsService } from "@/services/site-settings.service";

const HomeFeaturesSection = lazy(
  () => import("./_components/home-features-section"),
);
const TravelTimesSection = lazy(
  () => import("./_components/travel-times-section"),
);
const TransactionsSection = lazy(
  () => import("./_components/transactions-section"),
);
const ExploreProjectsSection = lazy(
  () => import("./_components/explore-projects-section"),
);
const FeaturedPropertiesSection = lazy(
  () => import("./_components/featured-properties-section"),
);
const DevelopersSection = lazy(
  () => import("./_components/developers-section"),
);
const CommunitiesSection = lazy(
  () => import("./_components/communities-section"),
);
const TopCommunitiesSection = lazy(
  () => import("./_components/top-communities-section"),
);
const MortgageCashbackSection = lazy(
  () => import("./_components/mortgage-cashback-section"),
);
const ValuationTeaserSection = lazy(
  () => import("./_components/valuation-teaser-section"),
);
const ComparePricesSection = lazy(
  () => import("./_components/compare-prices-section"),
);
const ExploreMoreSection = lazy(
  () => import("./_components/explore-more-section"),
);
const ListPropertyCta = lazy(
  () => import("./_components/list-property-cta"),
);

function DeferredHomeFallback() {
  return (
    <div className="space-y-12 pt-8">
      <div className="space-y-3">
        <div className="h-8 w-64 animate-pulse rounded-full bg-muted" />
        <div className="h-5 w-96 max-w-full animate-pulse rounded-full bg-muted/60" />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="aspect-[4/3] animate-pulse rounded-2xl bg-muted"
          />
        ))}
      </div>
    </div>
  );
}

export default function Main() {
  const [showDeferredSections, setShowDeferredSections] = useState(false);

  const { data: siteSettings } = useQuery({
    queryKey: ["site-settings"],
    queryFn: () => siteSettingsService.get(),
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    const enableDeferredSections = () => setShowDeferredSections(true);
    const idleWindow = window as Window & typeof globalThis;

    if (typeof idleWindow.requestIdleCallback === "function") {
      const idleId = idleWindow.requestIdleCallback(enableDeferredSections, {
        timeout: 1200,
      });

      return () => idleWindow.cancelIdleCallback(idleId);
    }

    const timeoutId = globalThis.setTimeout(enableDeferredSections, 250);

    return () => globalThis.clearTimeout(timeoutId);
  }, []);

  return (
    <div className="w-full">
      <HeroSection
        title={siteSettings?.hero_title_override ? "" : "pages.hero.title"}
        subtitle={
          siteSettings?.hero_subtitle_override
            ? ""
            : "pages.main_page.hero_subheadline"
        }
        titleText={siteSettings?.hero_title_override || undefined}
        subtitleText={siteSettings?.hero_subtitle_override || undefined}
        img={siteSettings?.hero_image || heroImage}
        imgSrcSet={
          siteSettings?.hero_image
            ? siteSettings.hero_image_srcset || undefined
            : heroImageSrcSet
        }
        imageWidth={1600}
        imageHeight={1019}
      />

      <div className="container mx-auto px-4 lg:px-8">
        {showDeferredSections ? (
          <Suspense fallback={<DeferredHomeFallback />}>
            {/* 1. Home search, simplified — dark banner + 4 feature cards */}
            <HomeFeaturesSection />

            {/* 1.5 Top communities (PropertyFinder-style filter pills + cards) */}
            <TopCommunitiesSection />

            {/* 2. Search by travel times — slider + property carousel */}
            <TravelTimesSection />

            {/* 3. Browse property transactions */}
            <TransactionsSection />

            {/* 4. Explore new projects — off-plan grid with city tabs */}
            <ExploreProjectsSection />

            {/* 5. Featured properties carousel */}
            <FeaturedPropertiesSection />

            {/* 6. Projects by developers — logo carousel */}
            <DevelopersSection />

            {/* 7. Mortgage Cashback */}
            <MortgageCashbackSection />

            {/* 8. AI valuation teaser (dark feature, kept) */}
            <ValuationTeaserSection />

            {/* 9. Compare prices by area — bar chart legend */}
            <ComparePricesSection />

            {/* 10. Supercharge your search — illustration cards with tabs */}
            <CommunitiesSection />

            {/* 11. Explore more — city + category links */}
            <ExploreMoreSection />

            {/* 12. List your property CTA */}
            <ListPropertyCta />
          </Suspense>
        ) : (
          <DeferredHomeFallback />
        )}
      </div>
    </div>
  );
}
