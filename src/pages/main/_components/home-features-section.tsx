import { useTranslation } from "react-i18next";
import {
  Apple,
  BellRing,
  Bookmark,
  Heart,
  LineChart,
  Play,
  Sparkles,
} from "lucide-react";

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

/** App Store / Google Play badge tugmasi (lucide ikon + matn). */
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

/** Telefon mockup — CSS-only iPhone frame, ichida property card preview. */
function PhoneMockup({ city }: Readonly<{ city: string }>) {
  return (
    <div className="relative mx-auto w-[240px] sm:w-[280px]">
      {/* Phone frame */}
      <div className="relative aspect-[9/19] rounded-[2.5rem] border-[10px] border-gray-900 bg-gray-900 shadow-2xl">
        {/* Screen */}
        <div className="relative h-full w-full overflow-hidden rounded-[1.8rem] bg-gradient-to-b from-sky-50 to-white">
          {/* Notch */}
          <div className="absolute left-1/2 top-1.5 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-gray-900" />

          {/* Status bar */}
          <div className="flex items-center justify-between px-5 pt-3 text-[10px] font-semibold text-gray-900">
            <span>3:14</span>
            <span className="opacity-0">•</span>
          </div>

          {/* Search bar */}
          <div className="mx-3 mt-4 flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-sm">
            <div className="size-5 rounded-full bg-primary/15" />
            <span className="text-[10px] text-gray-500">Search</span>
          </div>

          {/* Title */}
          <div className="mt-3 px-3">
            <p className="text-[10px] text-gray-500">2,839 properties</p>
            <p className="text-sm font-bold text-gray-900">
              Properties in {city}
            </p>
          </div>

          {/* Property card */}
          <div className="mx-3 mt-3 overflow-hidden rounded-xl bg-white shadow-md">
            {/* Image */}
            <div className="relative h-24 bg-gradient-to-br from-indigo-300 via-purple-300 to-pink-300">
              <span className="absolute left-2 top-2 rounded-md bg-amber-500 px-1.5 py-0.5 text-[8px] font-bold text-white">
                NEW
              </span>
              <Heart className="absolute right-2 top-2 size-4 text-white" />
            </div>
            {/* Body */}
            <div className="p-2">
              <p className="text-[10px] font-semibold text-gray-900">
                Premium Apartment
              </p>
              <p className="mt-0.5 text-[11px] font-bold text-primary">
                2,575,000 AED
              </p>
              <div className="mt-1 flex items-center gap-1.5 text-[8px] text-gray-500">
                <span>Studio</span>
                <span>•</span>
                <span>1 ba</span>
                <span>•</span>
                <span>586 sqft</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * QR code placeholder. Real QR code generator kerak bo'lsa qr-code library
 * o'rnatish kerak. Hozircha SVG bilan oddiy 9x9 pattern.
 */
function QrCodePlaceholder() {
  // Determined pattern, ko'rinishda QR'ga o'xshaydi
  const cells = [
    "111110101111101",
    "100010001110001",
    "101110111100101",
    "101110100001101",
    "101110110011101",
    "100010101010001",
    "111110101011111",
    "000000110100000",
    "110111010111011",
    "010010110001011",
    "111110100010101",
    "100010110110011",
    "101110101100101",
    "101110011001101",
    "111111001011111",
  ];
  return (
    <div className="grid w-fit gap-px rounded-xl bg-white p-3">
      {cells.map((row) => (
        <div key={row} className="flex gap-px">
          {row.split("").map((cell, j) => (
            <div
              key={`${row}-${j}`}
              className={`size-1.5 ${cell === "1" ? "bg-gray-900" : "bg-white"}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function HomeFeaturesSection() {
  const { t } = useTranslation();
  const city = t("pages.home_features.city", { defaultValue: "Toshkent" });

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

            <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <div className="flex flex-col gap-2.5 sm:flex-row">
                <StoreBadge store="ios" href="#" />
                <StoreBadge store="android" href="#" />
              </div>
              <div className="sm:ml-3">
                <QrCodePlaceholder />
              </div>
            </div>
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

          {/* Right — phone mockup */}
          <div className="flex justify-center lg:justify-end">
            <PhoneMockup city={city} />
          </div>
        </div>
      </div>
    </section>
  );
}
