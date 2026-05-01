import { cn } from "@/lib/utils";
import { Suspense, lazy, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const HeroSearchControls = lazy(() => import("./hero-search-controls"));

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  // Raw matn — i18n key emas. titleText/subtitleText berilsa, t() chaqirilmaydi.
  titleText?: string;
  subtitleText?: string;
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
  titleText,
  subtitleText,
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

  const resolvedTitle = titleText ?? (title ? t(title) : "");
  const resolvedSubtitle = subtitleText ?? (subtitle ? t(subtitle) : "");

  return (
    <div className={cn("relative w-full overflow-hidden", className)}>
      <div className="relative h-[420px] w-full transition-all duration-300 md:h-[600px] lg:h-[680px]">
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

        {/* Premium dark gradient — pastdan kuchliroq */}
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/30 via-foreground/20 to-foreground/60" />

        {/* Content overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 py-6">
          {resolvedTitle ? (
            <h1
              className="font-display mb-3 text-center text-4xl font-semibold leading-[1.1] tracking-tight text-white drop-shadow-2xl md:max-w-4xl md:text-6xl lg:text-7xl"
            >
              {resolvedTitle}
            </h1>
          ) : null}

          {resolvedSubtitle ? (
            <p className="mb-2 text-center text-base text-white/90 drop-shadow md:text-lg max-w-2xl">
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
