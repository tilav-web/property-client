import { cn } from "@/lib/utils";
import { Suspense, lazy, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const HeroSearchControls = lazy(() => import("./hero-search-controls"));

interface HeroSectionProps {
  title: string;
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

  return (
    <div className={cn("relative mb-4 w-full overflow-hidden", className)}>
      <div className="relative h-[300px] w-full transition-all duration-300 md:h-[450px]">
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

        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 p-6">
          {resolvedTitle ? (
            <h1
              className="text-center text-3xl leading-tight text-white drop-shadow-lg md:max-w-4xl md:text-6xl"
              style={{ fontFamily: "Edu NSW ACT Foundation" }}
            >
              {resolvedTitle}
            </h1>
          ) : null}

          {shouldLoadSearchControls ? (
            <Suspense fallback={null}>
              <HeroSearchControls />
            </Suspense>
          ) : null}
        </div>
      </div>
    </div>
  );
}
