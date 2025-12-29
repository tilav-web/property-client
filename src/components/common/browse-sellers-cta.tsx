import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Store } from "lucide-react";

export default function BrowseSellersCta() {
  const { t } = useTranslation();
  return (
    <div className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-2xl p-8 md:p-12 my-16 shadow-2xl">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="md:w-1/2 text-center md:text-left">
          <Store className="w-16 h-16 mx-auto md:mx-0 mb-4 text-white" />
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            {t("pages.main_page.browse_sellers_cta.title")}
          </h2>
          <p className="text-teal-100 max-w-lg mx-auto md:mx-0">
            {t("pages.main_page.browse_sellers_cta.description")}
          </p>
        </div>
        <div className="md:w-1/2 flex justify-center md:justify-end">
          <Link to="/sellers">
            <Button
              size="lg"
              className="bg-white text-teal-700 hover:bg-gray-100 font-bold text-lg h-14 px-8 rounded-full transition-transform hover:scale-105"
            >
              {t("pages.main_page.browse_sellers_cta.button")}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
