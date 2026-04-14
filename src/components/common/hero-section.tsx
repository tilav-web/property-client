import { cn } from "@/lib/utils";
import { Suspense, lazy, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const HeroSearchControls = lazy(() => import("./hero-search-controls"));

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  img: string;
  className?: string;
  imgSrcSet?: string;
  imgSizes?: string;
  imageWidth?: number;
  imageHeight?: number;
  enableSearch?: boolean;
}

export default function HeroSection({
  img,
  title,
  subtitle,
  className,
  imgSrcSet,
  imgSizes = "100vw",
  imageWidth = 1600,
  imageHeight = 1019,
  enableSearch = true,
}: HeroSectionProps) {
  const { t } = useTranslation();
  const [shouldLoadSearchControls, setShouldLoadSearchControls] =
    useState(!enableSearch);

  useEffect(() => {
    if (!enableSearch) return;

    const idleWindow = window as Window & typeof globalThis;

    if (typeof idleWindow.requestIdleCallback === "function") {
      const idleId = idleWindow.requestIdleCallback(
        () => setShouldLoadSearchControls(true),
        { timeout: 900 }
      );

      return () => idleWindow.cancelIdleCallback(idleId);
    }

    const timeoutId = globalThis.setTimeout(
      () => setShouldLoadSearchControls(true),
      180
    );

    return () => globalThis.clearTimeout(timeoutId);
  }, [enableSearch]);

  const resolvedTitle = title ? t(title) : "";
  const resolvedSubtitle = subtitle ? t(subtitle) : "";

  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative h-[340px] w-full transition-all duration-300 md:h-[520px]">
        <img
          src={img}
          srcSet={imgSrcSet}
          sizes={imgSizes}
          alt={resolvedTitle || "Amaar Properties"}
          fetchPriority="high"
          loading="eager"
          decoding="async"
          width={imageWidth}
          height={imageHeight}
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />

        {/* Content overlay — title, subtitle, va search controls */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 py-6">
          {resolvedTitle ? (
            <h1
              className="mb-2 text-center text-3xl leading-tight text-white drop-shadow-lg md:max-w-4xl md:text-5xl"
              style={{ fontFamily: "Edu NSW ACT Foundation" }}
            >
              {resolvedTitle}
            </h1>
          ) : null}

          {resolvedSubtitle ? (
            <p className="mb-4 text-center text-base text-white/90 drop-shadow md:text-lg">
              {resolvedSubtitle}
            </p>
          ) : null}
        </div>

        {/* Search controls — absolute positioned */}
        {shouldLoadSearchControls ? (
          <Suspense fallback={null}>
            <HeroSearchControls />
          </Suspense>
        ) : null}
      </div>
    </div>
  );
}
