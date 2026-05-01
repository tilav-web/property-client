import HeroSection from "@/components/common/hero-section";
import { heroImage, heroImageSrcSet } from "@/utils/shared";
import { Suspense, lazy, useEffect, useState } from "react";
import { siteSettingsService } from "@/services/site-settings.service";

const HomeFeaturesSection = lazy(
  () => import("./_components/home-features-section"),
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
const MortgageCashbackSection = lazy(
  () => import("./_components/mortgage-cashback-section"),
);
const ValuationTeaserSection = lazy(
  () => import("./_components/valuation-teaser-section"),
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
  const [heroOverride, setHeroOverride] = useState<{
    img?: string;
    srcset?: string;
    title?: string;
    subtitle?: string;
  } | null>(null);

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

  // Site settings'dan hero override (admin paneldan o'zgartirilgan bo'lsa)
  useEffect(() => {
    let cancelled = false;
    siteSettingsService
      .get()
      .then((s) => {
        if (cancelled) return;
        if (s.hero_image || s.hero_title_override || s.hero_subtitle_override) {
          setHeroOverride({
            img: s.hero_image ?? undefined,
            srcset: s.hero_image_srcset ?? undefined,
            title: s.hero_title_override ?? undefined,
            subtitle: s.hero_subtitle_override ?? undefined,
          });
        }
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="w-full">
      <HeroSection
        title={heroOverride?.title ? "" : "pages.hero.title"}
        subtitle={
          heroOverride?.subtitle ? "" : "pages.main_page.hero_subheadline"
        }
        titleText={heroOverride?.title}
        subtitleText={heroOverride?.subtitle}
        img={heroOverride?.img || heroImage}
        imgSrcSet={heroOverride?.srcset || heroImageSrcSet}
        imageWidth={1600}
        imageHeight={1019}
      />

      <div className="container mx-auto px-4 lg:px-8">
        {showDeferredSections ? (
          <Suspense fallback={<DeferredHomeFallback />}>
            {/* 1. Home search, simplified — 4 feature cards */}
            <HomeFeaturesSection />

            {/* 2. Featured properties carousel */}
            <FeaturedPropertiesSection />

            {/* 3. Projects by developers */}
            <DevelopersSection />

            {/* 4. AI valuation teaser (dark feature) */}
            <ValuationTeaserSection />

            {/* 5. Popular communities — 4 illustration cards */}
            <CommunitiesSection />

            {/* 6. Mortgage Cashback */}
            <MortgageCashbackSection />

            {/* 7. Explore more — city + category links */}
            <ExploreMoreSection />

            {/* 8. List your property CTA */}
            <ListPropertyCta />
          </Suspense>
        ) : (
          <DeferredHomeFallback />
        )}
      </div>
    </div>
  );
}
