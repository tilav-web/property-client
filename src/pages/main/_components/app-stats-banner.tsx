import { Button } from "@/components/ui/button";
import { ArrowRight, Download, Home, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const STATS = [
  {
    icon: Download,
    value: "2.5K+",
    labelKey: "pages.main_page.app_banner.downloads",
    color: "text-blue-600 bg-blue-50",
  },
  {
    icon: Home,
    value: "500+",
    labelKey: "pages.main_page.app_banner.properties",
    color: "text-green-600 bg-green-50",
  },
  {
    icon: Users,
    value: "10K+",
    labelKey: "pages.main_page.app_banner.happy_users",
    color: "text-purple-600 bg-purple-50",
  },
];

export default function AppStatsBanner() {
  const { t } = useTranslation();

  return (
    <section className="py-10 [content-visibility:auto] [contain-intrinsic-size:1px_350px]">
      <div className="overflow-hidden rounded-2xl bg-gray-900 shadow-xl">
        <div className="grid items-center gap-8 md:grid-cols-2">
          {/* Left - Text */}
          <div className="px-8 py-10 md:px-12 md:py-14">
            <h2 className="text-2xl font-bold text-white md:text-3xl">
              {t("pages.main_page.app_banner.title")}
            </h2>
            <p className="mt-3 text-gray-400">
              {t("pages.main_page.app_banner.description")}
            </p>

            {/* Stats */}
            <div className="mt-8 flex gap-6">
              {STATS.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.labelKey} className="text-center">
                    <div
                      className={`mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}
                    >
                      <Icon size={20} />
                    </div>
                    <p className="text-xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-gray-500">{t(stat.labelKey)}</p>
                  </div>
                );
              })}
            </div>

            <Link to="/search" className="mt-8 inline-block">
              <Button className="h-12 rounded-xl bg-purple-600 px-8 font-semibold text-white hover:bg-purple-700">
                {t("pages.main_page.app_banner.get_started")}
                <ArrowRight className="ml-2" size={18} />
              </Button>
            </Link>
          </div>

          {/* Right - Visual */}
          <div className="hidden items-center justify-center bg-gradient-to-br from-purple-600/20 to-purple-900/40 p-10 md:flex">
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-28 w-36 rounded-xl bg-white/10 backdrop-blur-sm"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
