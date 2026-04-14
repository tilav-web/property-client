import { Button } from "@/components/ui/button";
import { ArrowRight, Building } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function ListPropertyCta() {
  const { t } = useTranslation();

  return (
    <section className="py-8 [content-visibility:auto] [contain-intrinsic-size:1px_200px]">
      <div className="flex flex-col items-center justify-between gap-6 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-800 px-8 py-10 text-white shadow-lg md:flex-row md:px-12">
        <div className="flex items-center gap-5 text-center md:text-left">
          <div className="hidden rounded-xl bg-white/20 p-4 md:block">
            <Building size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">
              {t("pages.main_page.list_property_cta.title")}
            </h2>
            <p className="mt-2 text-purple-200">
              {t("pages.main_page.list_property_cta.description")}
            </p>
          </div>
        </div>
        <Link to="/auth/register" className="shrink-0">
          <Button
            size="lg"
            className="h-12 rounded-xl bg-white px-8 font-semibold text-purple-700 shadow-md hover:bg-gray-100"
          >
            {t("pages.main_page.list_property_cta.button")}
            <ArrowRight className="ml-2" size={18} />
          </Button>
        </Link>
      </div>
    </section>
  );
}
