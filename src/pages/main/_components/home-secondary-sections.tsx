import { Button } from "@/components/ui/button";
import { heroImage, heroImageSrcSet } from "@/utils/shared";
import { ArrowRight, Contact, Map, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import ListPropertyCta from "./list-property-cta";
import AppStatsBanner from "./app-stats-banner";
import SeoLinksSection from "./seo-links-section";

function HowItWorks() {
  const { t } = useTranslation();
  const steps = [
    {
      icon: <Search className="h-8 w-8" />,
      title: t("pages.main_page.how_it_works.step1_title"),
      description: t("pages.main_page.how_it_works.step1_desc"),
      color: "bg-yellow-50 text-yellow-600",
      step: "01",
    },
    {
      icon: <Contact className="h-8 w-8" />,
      title: t("pages.main_page.how_it_works.step2_title"),
      description: t("pages.main_page.how_it_works.step2_desc"),
      color: "bg-blue-50 text-blue-600",
      step: "02",
    },
    {
      icon: <Map className="h-8 w-8" />,
      title: t("pages.main_page.how_it_works.step3_title"),
      description: t("pages.main_page.how_it_works.step3_desc"),
      color: "bg-green-50 text-green-600",
      step: "03",
    },
  ];

  return (
    <section className="py-12 [content-visibility:auto] [contain-intrinsic-size:1px_420px]">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
          {t("pages.main_page.how_it_works.title")}
        </h2>
        <p className="mt-2 text-gray-500">
          {t("pages.main_page.how_it_works.subtitle")}
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {steps.map((step) => (
          <div
            key={step.title}
            className="relative rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <span className="absolute right-4 top-4 text-3xl font-bold text-gray-100">
              {step.step}
            </span>
            <div
              className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl ${step.color}`}
            >
              {step.icon}
            </div>
            <h3 className="mb-2 text-lg font-bold text-gray-900">
              {step.title}
            </h3>
            <p className="text-sm leading-relaxed text-gray-500">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function MapCta() {
  const { t } = useTranslation();

  return (
    <section className="py-8 [content-visibility:auto] [contain-intrinsic-size:1px_380px]">
      <div className="relative overflow-hidden rounded-2xl">
        <img
          src={heroImage}
          srcSet={heroImageSrcSet}
          loading="lazy"
          fetchPriority="low"
          decoding="async"
          sizes="100vw"
          width={1600}
          height={1019}
          className="absolute inset-0 h-full w-full object-cover"
          alt="Map background"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative px-8 py-16 text-center text-white md:py-20">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
            <Map className="h-8 w-8" />
          </div>
          <h2 className="mb-3 text-2xl font-bold md:text-3xl">
            {t("pages.main_page.map.title")}
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-gray-300">
            {t("pages.main_page.map.description")}
          </p>
          <Link to="/map">
            <Button
              size="lg"
              className="h-12 rounded-xl bg-yellow-400 px-8 font-semibold text-black hover:bg-yellow-500"
            >
              {t("pages.main_page.map.button")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function HomeSecondarySections() {
  return (
    <>
      <MapCta />
      <ListPropertyCta />
      <HowItWorks />
      <AppStatsBanner />
      <SeoLinksSection />
    </>
  );
}
