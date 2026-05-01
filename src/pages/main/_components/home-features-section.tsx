import { useTranslation } from "react-i18next";
import {
  BellRing,
  Bookmark,
  LineChart,
  Sparkles,
} from "lucide-react";

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function Feature({ icon, title, description }: FeatureProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-12 flex-shrink-0 items-center justify-center rounded-2xl bg-accent text-foreground">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

export default function HomeFeaturesSection() {
  const { t } = useTranslation();

  return (
    <section className="py-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="font-display text-3xl text-foreground sm:text-4xl">
            {t(
              "pages.home_features.title",
              "Home search, simplified",
            )}
          </h2>
          <p className="mt-3 max-w-md text-muted-foreground">
            {t(
              "pages.home_features.subtitle",
              "Find, track and secure properties with the most powerful search experience in Malaysia.",
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Feature
            icon={<Sparkles className="size-5" />}
            title={t(
              "pages.home_features.tools_title",
              "Unlock exclusive tools & insights",
            )}
            description={t(
              "pages.home_features.tools_desc",
              "AI search, market trends and price comparisons across all areas.",
            )}
          />
          <Feature
            icon={<BellRing className="size-5" />}
            title={t(
              "pages.home_features.alerts_title",
              "Be notified of any price change",
            )}
            description={t(
              "pages.home_features.alerts_desc",
              "Set alerts for new listings and price drops in your favorite areas.",
            )}
          />
          <Feature
            icon={<Bookmark className="size-5" />}
            title={t(
              "pages.home_features.save_title",
              "Save and track your properties",
            )}
            description={t(
              "pages.home_features.save_desc",
              "Build your shortlist and review listings any time across devices.",
            )}
          />
          <Feature
            icon={<LineChart className="size-5" />}
            title={t(
              "pages.home_features.value_title",
              "Track properties to see what they're worth",
            )}
            description={t(
              "pages.home_features.value_desc",
              "AI-powered valuation reveals fair market prices and 6-month forecasts.",
            )}
          />
        </div>
      </div>
    </section>
  );
}
