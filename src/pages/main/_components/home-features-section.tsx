import { useTranslation } from "react-i18next";
import {
  BellRing,
  Bookmark,
  LineChart,
  Search,
  Sparkles,
} from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  bg: string;
  iconColor: string;
}

function FeatureCard({ icon, title, bg, iconColor }: FeatureCardProps) {
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

export default function HomeFeaturesSection() {
  const { t } = useTranslation();

  return (
    <section className="py-10 md:py-14">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary/90 px-6 py-10 sm:px-10 sm:py-14 lg:px-14">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-white/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 size-72 rounded-full bg-white/10 blur-3xl" />

        <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
          {/* Left — title + subtitle + decorative phone */}
          <div className="text-background">
            <h2 className="font-display text-3xl leading-tight sm:text-4xl lg:text-5xl">
              {t("pages.home_features.title", "Home search, simplified")}
            </h2>
            <p className="mt-4 max-w-md text-sm text-background/70 sm:text-base">
              {t(
                "pages.home_features.subtitle",
                "Find, track and secure properties with the most powerful search experience in Malaysia.",
              )}
            </p>

            {/* Decorative search pill — stand-in for the PF phone mockup */}
            <div className="mt-8 hidden max-w-sm rounded-2xl border border-background/15 bg-background/5 p-4 backdrop-blur-sm sm:flex sm:items-center sm:gap-3">
              <div className="flex size-9 flex-shrink-0 items-center justify-center rounded-full bg-background text-primary">
                <Search className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs uppercase tracking-wide text-background/50">
                  {t("pages.home_features.search_hint", "Try AI search")}
                </p>
                <p className="truncate text-sm font-medium text-background">
                  {t(
                    "pages.home_features.search_example",
                    "2-bedroom condo in Mont Kiara under RM 1.2M",
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Right — 2x2 feature card grid */}
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
        </div>
      </div>
    </section>
  );
}
