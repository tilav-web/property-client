import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import {
  Apple,
  BellRing,
  Bookmark,
  LineChart,
  Play,
  Sparkles,
} from "lucide-react";
import { siteSettingsService } from "@/services/site-settings.service";
import mobileMockup from "@/assets/images/mobile.webp";

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

/** App Store / Google Play badge (lucide ikon + matn). */
function StoreBadge({
  store,
  href,
}: Readonly<{ store: "ios" | "android"; href: string }>) {
  const Icon = store === "ios" ? Apple : Play;
  const label = store === "ios" ? "Download on the" : "GET IT ON";
  const name = store === "ios" ? "App Store" : "Google Play";
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2.5 rounded-xl bg-black px-4 py-2 text-white transition-transform hover:scale-[1.02]"
    >
      <Icon className="size-6" />
      <div className="flex flex-col leading-tight">
        <span className="text-[10px] uppercase tracking-wide opacity-80">
          {label}
        </span>
        <span className="text-sm font-semibold">{name}</span>
      </div>
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
  const hasAnyCta = appStoreUrl || playStoreUrl || qrImage;

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

            {hasAnyCta && (
              <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                {(appStoreUrl || playStoreUrl) && (
                  <div className="flex flex-col gap-2.5 sm:flex-row">
                    {appStoreUrl && <StoreBadge store="ios" href={appStoreUrl} />}
                    {playStoreUrl && (
                      <StoreBadge store="android" href={playStoreUrl} />
                    )}
                  </div>
                )}
                {qrImage && (
                  <div className="rounded-xl bg-white p-2 shadow-lg sm:ml-2">
                    <img
                      src={qrImage}
                      alt="QR code"
                      className="size-24 object-contain"
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

          {/* Right — telefon mockup (lokal asset) */}
          <div className="flex justify-center lg:justify-end">
            <img
              src={mobileMockup}
              alt="Mobile app preview"
              className="w-[240px] drop-shadow-2xl sm:w-[280px] lg:w-[300px]"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
