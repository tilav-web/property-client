import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Building } from "lucide-react";

export default function ListPropertyCta() {
  const { t } = useTranslation();

  return (
    <section className="py-8 [content-visibility:auto] [contain-intrinsic-size:1px_200px]">
      <div className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-border/60 bg-card px-8 py-10 sm:flex-row sm:px-12">
        <div className="flex items-center gap-5 text-center sm:text-left">
          <div className="hidden size-14 flex-shrink-0 items-center justify-center rounded-2xl bg-accent text-foreground sm:flex">
            <Building className="size-6" />
          </div>
          <div>
            <h2 className="font-display text-2xl text-foreground sm:text-3xl">
              {t(
                "pages.main_page.list_property_cta.title",
                "Looking to advertise a property? We can help.",
              )}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t(
                "pages.main_page.list_property_cta.description",
                "Reach thousands of buyers and renters across Malaysia and Central Asia.",
              )}
            </p>
          </div>
        </div>
        <Link
          to="/seller/profile"
          className="inline-flex flex-shrink-0 items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98]"
        >
          {t(
            "pages.main_page.list_property_cta.button",
            "List your property with us",
          )}
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
