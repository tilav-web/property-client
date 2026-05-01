import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";

export default function ValuationTeaserSection() {
  const { t } = useTranslation();

  return (
    <section className="py-12">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-foreground to-foreground/95 p-8 text-background sm:p-12">
        {/* Decorative gold gradient blob */}
        <div className="pointer-events-none absolute -right-16 -top-16 size-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/2 size-96 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="size-3" />
              {t("pages.valuation.beta", "BETA")}
            </div>
            <h2 className="mt-4 font-display text-4xl leading-tight text-background sm:text-5xl">
              {t("pages.valuation.title", "Your property's future?")}
              <br />
              <span className="text-primary">
                {t("pages.valuation.title_2", "Let's find out.")}
              </span>
            </h2>
            <p className="mt-4 max-w-lg text-background/70">
              {t(
                "pages.valuation.subtitle",
                "Your dream home starts with clarity. Discover what a property is worth today and where it's headed over the next six months.",
              )}
            </p>
            <Link
              to="/ai-chat"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98]"
            >
              {t("pages.valuation.cta", "Try AI Assistant")}
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="hidden lg:flex justify-end">
            <div className="relative">
              <div className="flex size-48 items-center justify-center rounded-3xl bg-primary/10 backdrop-blur">
                <TrendingUp className="size-24 text-primary" />
              </div>
              <div className="absolute -right-4 -top-4 rounded-2xl bg-card px-4 py-3 text-foreground shadow-elevated">
                <p className="text-xs text-muted-foreground">
                  {t("pages.valuation.estimate", "Estimated value")}
                </p>
                <p className="font-display text-xl">RM 1.8M</p>
                <p className="text-xs text-emerald-700 font-semibold">
                  +12% YoY
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
