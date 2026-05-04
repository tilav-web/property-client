import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Home, Sparkles, TrendingUp } from "lucide-react";

export default function ValuationTeaserSection() {
  const { t } = useTranslation();

  return (
    <section className="py-12">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary/90 p-6 text-background sm:p-10 lg:p-14">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -right-16 -top-16 size-72 rounded-full bg-white/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/2 size-96 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />

        <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-destructive px-3 py-1 text-xs font-semibold uppercase tracking-wide text-background">
              <Sparkles className="size-3" />
              {t("pages.valuation.beta", "BETA")}
            </div>
            <h2 className="mt-4 font-display text-3xl leading-tight text-background sm:text-4xl lg:text-5xl">
              {t("pages.valuation.title", "Your property's future?")}
              <br />
              <span className="text-background/90">
                {t("pages.valuation.title_2", "Let's find out.")}
              </span>
            </h2>
            <p className="mt-4 max-w-lg text-sm text-background/70 sm:text-base">
              {t(
                "pages.valuation.subtitle",
                "Your dream home starts with clarity. Discover what a property is worth today and where it's headed over the next six months.",
              )}
            </p>
            <Link
              to="/ai-chat"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-semibold text-primary transition-all hover:bg-background/90 active:scale-[0.98]"
            >
              {t("pages.valuation.cta", "Try AI Assistant")}
              <ArrowRight className="size-4" />
            </Link>
          </div>

          {/* Right — house illustration card */}
          <div className="relative hidden lg:block">
            <div className="relative mx-auto max-w-md">
              {/* Background glow */}
              <div className="absolute -inset-6 rounded-[40px] bg-primary/5 blur-2xl" />

              {/* Top — house image placeholder */}
              <div className="relative flex h-44 items-center justify-center overflow-hidden rounded-t-3xl bg-gradient-to-br from-sky-200 via-sky-100 to-amber-100">
                <Home className="size-24 text-foreground/30" strokeWidth={1.2} />
                <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-foreground/80 px-2.5 py-1 text-[10px] font-semibold uppercase text-background">
                  <Sparkles className="size-3 text-primary" />
                  {t("pages.valuation.beta", "BETA")}
                </div>
              </div>

              {/* Bottom — price card */}
              <div className="relative flex items-center justify-between rounded-b-3xl bg-card px-6 py-4 text-foreground shadow-elevated">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground line-through">
                    RM 1,800k
                  </p>
                </div>
                <div className="text-center">
                  <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {t("pages.valuation.today", "Today")}
                  </p>
                  <p className="font-display text-2xl font-semibold text-foreground">
                    RM 2,800k
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground line-through">
                    RM 3,800k
                  </p>
                </div>
              </div>

              {/* Floating growth pill */}
              <div className="absolute -right-4 -top-4 flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white shadow-card">
                <TrendingUp className="size-3" />
                +12% YoY
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
