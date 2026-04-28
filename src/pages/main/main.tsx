import HeroSection from "@/components/common/hero-section";
import { heroImage, heroImageSrcSet } from "@/utils/shared";
import { Suspense, lazy, useEffect, useState } from "react";
import { siteSettingsService } from "@/services/site-settings.service";

const FeaturedPropertiesSection = lazy(
  () => import("./_components/featured-properties-section")
);
const HomeSecondarySections = lazy(
  () => import("./_components/home-secondary-sections")
);
const SuperchargeSection = lazy(
  () => import("./_components/supercharge-section")
);
const TransactionsSection = lazy(
  () => import("./_components/transactions-section")
);
const DevelopersSection = lazy(
  () => import("./_components/developers-section")
);

function DeferredHomeFallback() {
  return (
    <div className="space-y-10 pt-8">
      <div className="space-y-3 text-center">
        <div className="mx-auto h-8 w-64 animate-pulse rounded bg-gray-200" />
        <div className="mx-auto h-5 w-96 max-w-full animate-pulse rounded bg-gray-100" />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="aspect-[4/3] animate-pulse rounded-xl bg-gray-200"
          />
        ))}
      </div>
      <div className="h-72 animate-pulse rounded-2xl bg-gray-200" />
      <div className="h-72 animate-pulse rounded-2xl bg-gray-200" />
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
        if (
          s.hero_image ||
          s.hero_title_override ||
          s.hero_subtitle_override
        ) {
          setHeroOverride({
            img: s.hero_image ?? undefined,
            srcset: s.hero_image_srcset ?? undefined,
            title: s.hero_title_override ?? undefined,
            subtitle: s.hero_subtitle_override ?? undefined,
          });
        }
      })
      .catch(() => {
        // settings yo'q bo'lsa default ishlatiladi
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="w-full">
      <HeroSection
        title={heroOverride?.title ? "" : "pages.hero.title"}
        subtitle={heroOverride?.subtitle ? "" : "pages.main_page.hero_subheadline"}
        titleText={heroOverride?.title}
        subtitleText={heroOverride?.subtitle}
        img={heroOverride?.img || heroImage}
        imgSrcSet={heroOverride?.srcset || heroImageSrcSet}
        imageWidth={1600}
        imageHeight={1019}
      />

      <div className="container mx-auto px-4 py-8">
        {showDeferredSections ? (
          <Suspense fallback={<DeferredHomeFallback />}>
            <SuperchargeSection />
            <FeaturedPropertiesSection />
            <DevelopersSection />
            <TransactionsSection />
            <HomeSecondarySections />
          </Suspense>
        ) : (
          <DeferredHomeFallback />
        )}
      </div>
    </div>
  );
}
