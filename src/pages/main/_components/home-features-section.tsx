import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { BellRing, Bookmark, LineChart, Sparkles } from "lucide-react";
import { siteSettingsService } from "@/services/site-settings.service";
import mobileMockup from "@/assets/images/mobile.jpg";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  bg: string;
  iconColor: string;
}

function FeatureCard({ icon, title, bg, iconColor }: Readonly<FeatureCardProps>) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-card p-4 shadow-card sm:p-5">
      <div
        className={`flex size-11 items-center justify-center rounded-xl ${bg} ${iconColor}`}
      >
        {icon}
      </div>
      <p className="text-sm font-semibold leading-snug text-foreground">
        {title}
      </p>
    </div>
  );
}

/**
 * Apple App Store rasmiy badge SVG — Apple Marketing Guidelines bo'yicha
 * (qora fon, oq Apple logo, "Download on the App Store").
 */
function AppStoreBadge({ href }: Readonly<{ href: string }>) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Download on the App Store"
      className="inline-block transition-transform hover:scale-[1.03]"
    >
      <svg
        viewBox="0 0 135 40"
        className="h-10 w-auto sm:h-12"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="0" y="0" width="135" height="40" rx="6" fill="#000" />
        {/* Apple logo */}
        <path
          d="M21.27 19.91c-.03-2.97 2.43-4.41 2.54-4.48-1.39-2.03-3.55-2.31-4.31-2.34-1.83-.19-3.58 1.08-4.51 1.08-.94 0-2.37-1.06-3.9-1.03-2 .03-3.86 1.17-4.89 2.95-2.09 3.62-.53 8.98 1.5 11.92 1 1.44 2.19 3.05 3.75 2.99 1.51-.06 2.08-.97 3.91-.97 1.82 0 2.34.97 3.94.94 1.63-.03 2.66-1.46 3.65-2.91 1.16-1.67 1.63-3.29 1.65-3.37-.04-.02-3.17-1.22-3.2-4.83zm-2.95-8.87c.82-1 1.37-2.39 1.22-3.78-1.18.05-2.61.79-3.46 1.78-.75.87-1.41 2.28-1.24 3.64 1.32.1 2.66-.66 3.48-1.64z"
          fill="#fff"
        />
        {/* "Download on the" */}
        <text
          x="32"
          y="15"
          fill="#fff"
          fontFamily="-apple-system, system-ui, sans-serif"
          fontSize="7"
        >
          Download on the
        </text>
        {/* "App Store" */}
        <text
          x="32"
          y="30"
          fill="#fff"
          fontFamily="-apple-system, system-ui, sans-serif"
          fontSize="16"
          fontWeight="600"
        >
          App Store
        </text>
      </svg>
    </a>
  );
}

/**
 * Google Play rasmiy badge SVG — Google Play Brand Guidelines bo'yicha
 * (qora fon, rangli Play triangle, "GET IT ON Google Play").
 */
function GooglePlayBadge({ href }: Readonly<{ href: string }>) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Get it on Google Play"
      className="inline-block transition-transform hover:scale-[1.03]"
    >
      <svg
        viewBox="0 0 135 40"
        className="h-10 w-auto sm:h-12"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="0" y="0" width="135" height="40" rx="6" fill="#000" />
        {/* Google Play triangle (multi-color) */}
        <g transform="translate(9, 8)">
          <path
            d="M0 0v24l12-12L0 0z"
            fill="url(#playGradBlue)"
          />
          <path
            d="M0 0l12 12 4-4L4 -2C2 -1 0 -0.5 0 0z"
            fill="url(#playGradGreen)"
          />
          <path
            d="M16 8l-4 4 4 4 6-3c1-1 1-3 0-4l-6-1z"
            fill="url(#playGradYellow)"
          />
          <path
            d="M0 24l12-12 4 4-12 10c-2 1-4 0-4-2z"
            fill="url(#playGradRed)"
          />
          <defs>
            <linearGradient id="playGradBlue" x1="0" x2="12" y1="0" y2="24">
              <stop offset="0" stopColor="#00A0FF" />
              <stop offset="1" stopColor="#00E2FF" />
            </linearGradient>
            <linearGradient id="playGradGreen" x1="0" x2="16" y1="0" y2="0">
              <stop offset="0" stopColor="#00C261" />
              <stop offset="1" stopColor="#00FF7B" />
            </linearGradient>
            <linearGradient id="playGradYellow" x1="12" x2="22" y1="8" y2="16">
              <stop offset="0" stopColor="#FFD500" />
              <stop offset="1" stopColor="#FFBD00" />
            </linearGradient>
            <linearGradient id="playGradRed" x1="0" x2="16" y1="24" y2="16">
              <stop offset="0" stopColor="#FF3A44" />
              <stop offset="1" stopColor="#C31162" />
            </linearGradient>
          </defs>
        </g>
        {/* "GET IT ON" */}
        <text
          x="35"
          y="15"
          fill="#fff"
          fontFamily="Roboto, system-ui, sans-serif"
          fontSize="7"
        >
          GET IT ON
        </text>
        {/* "Google Play" */}
        <text
          x="35"
          y="30"
          fill="#fff"
          fontFamily="Roboto, system-ui, sans-serif"
          fontSize="16"
          fontWeight="500"
        >
          Google Play
        </text>
      </svg>
    </a>
  );
}

export default function HomeFeaturesSection() {
  const { t } = useTranslation();
  const { data: settings } = useQuery({
    queryKey: ["public-site-settings"],
    queryFn: () => siteSettingsService.get(),
    staleTime: 5 * 60 * 1000,
  });

  const appStoreUrl = settings?.app_store_url?.trim() || null;
  const playStoreUrl = settings?.play_store_url?.trim() || null;
  const qrImage = settings?.qr_code_image?.trim() || null;
  const hasStoreBadges = appStoreUrl || playStoreUrl;

  return (
    <section className="py-10 md:py-14">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary/90 px-6 py-10 sm:px-10 sm:py-14 lg:px-14">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-white/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 size-72 rounded-full bg-white/10 blur-3xl" />

        <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.1fr_1fr_0.9fr]">
          {/* Left — title + subtitle + download CTAs */}
          <div className="text-background">
            <h2 className="font-display text-3xl leading-tight sm:text-4xl lg:text-5xl">
              {t("pages.home_features.title", "Home search, simplified")}
            </h2>
            <p className="mt-4 max-w-md text-sm text-background/80 sm:text-base">
              {t(
                "pages.home_features.subtitle",
                "Download the app to find, track and secure a property, right from your pocket.",
              )}
            </p>

            {(hasStoreBadges || qrImage) && (
              <div className="mt-6 flex items-center gap-5">
                {hasStoreBadges && (
                  <div className="flex flex-col gap-2.5">
                    {appStoreUrl && <AppStoreBadge href={appStoreUrl} />}
                    {playStoreUrl && <GooglePlayBadge href={playStoreUrl} />}
                  </div>
                )}
                {qrImage && (
                  <div className="rounded-xl bg-white p-2 shadow-lg">
                    <img
                      src={qrImage}
                      alt="QR code"
                      className="size-24 object-contain sm:size-28"
                      loading="lazy"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Middle — 2x2 feature card grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <FeatureCard
              icon={<Sparkles className="size-5" />}
              bg="bg-primary/15"
              iconColor="text-primary"
              title={t(
                "pages.home_features.tools_title",
                "Unlock exclusive tools & insights",
              )}
            />
            <FeatureCard
              icon={<BellRing className="size-5" />}
              bg="bg-sky-100"
              iconColor="text-sky-600"
              title={t(
                "pages.home_features.alerts_title",
                "Be notified of any price change",
              )}
            />
            <FeatureCard
              icon={<Bookmark className="size-5" />}
              bg="bg-rose-100"
              iconColor="text-rose-600"
              title={t(
                "pages.home_features.save_title",
                "Save and track your properties",
              )}
            />
            <FeatureCard
              icon={<LineChart className="size-5" />}
              bg="bg-emerald-100"
              iconColor="text-emerald-600"
              title={t(
                "pages.home_features.value_title",
                "Track properties to see what they're worth",
              )}
            />
          </div>

          {/* Right — telefon mockup + dekorativ doira + sparkle accent'lar.
              Parent'ga aniq height berildi, rasm absolute joylashgan,
              z-index past — PropertyFinder layoutdagi kabi. */}
          <div className="relative h-[460px] w-full sm:h-[500px] lg:h-[520px]">
            {/* Ochiq ko'k doira (orqa fon, markazlashgan) */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 z-0 size-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-100 sm:size-[380px]"
            />

            {/* Telefon — absolute, parent ichida joylashgan, borderli */}
            <img
              src={mobileMockup}
              alt="Mobile app preview"
              className="absolute left-1/2 top-1/2 z-[1] w-[260px] -translate-x-1/2 -translate-y-1/2 -rotate-[8deg] rounded-[2rem] border-[6px] border-gray-900 object-cover shadow-2xl sm:w-[300px] lg:w-[320px]"
              loading="lazy"
            />

            {/* Top-right pink star */}
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute right-4 top-4 z-[2] size-8 text-rose-400 drop-shadow sm:right-8 sm:top-6"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2L13.5 10.5L22 12L13.5 13.5L12 22L10.5 13.5L2 12L10.5 10.5Z" />
            </svg>

            {/* Bottom-right dark accent kvadrat (PF kabi) */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-16 right-2 z-[2] size-6 rotate-12 rounded-sm bg-violet-900/60 sm:right-6"
            />

            {/* Bottom-left pink star */}
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute bottom-8 left-2 z-[2] size-7 text-rose-400 drop-shadow sm:left-6"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2L13.5 10.5L22 12L13.5 13.5L12 22L10.5 13.5L2 12L10.5 10.5Z" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
