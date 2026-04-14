import HeroSection from "@/components/common/hero-section";
import { heroImage, heroImageSrcSet } from "@/utils/shared";
import { Suspense, lazy, useEffect, useState } from "react";

const FeaturedPropertiesSection = lazy(
  () => import("./_components/featured-properties-section")
);
const HomeSecondarySections = lazy(
  () => import("./_components/home-secondary-sections")
);
const SuperchargeSection = lazy(
  () => import("./_components/supercharge-section")
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
        title="pages.hero.title"
        subtitle="pages.main_page.hero_subheadline"
        img={heroImage}
        imgSrcSet={heroImageSrcSet}
        imageWidth={1600}
        imageHeight={1019}
      />

      <div className="container mx-auto px-4 py-8">
        {showDeferredSections ? (
          <Suspense fallback={<DeferredHomeFallback />}>
            <SuperchargeSection />
            <FeaturedPropertiesSection />
            <HomeSecondarySections />
          </Suspense>
        ) : (
          <DeferredHomeFallback />
        )}
      </div>
    </div>
  );
}
