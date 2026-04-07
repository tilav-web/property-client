import BrowseSellersCta from "@/components/common/browse-sellers-cta";
import { Button } from "@/components/ui/button";
import { heroImage } from "@/utils/shared";
import {
  ArrowRight,
  BarChart,
  BrainCircuit,
  Contact,
  Home,
  Map,
  Search,
  Smile,
  Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function AiAgentCta() {
  const { t } = useTranslation();

  return (
    <section className="[content-visibility:auto] [contain-intrinsic-size:1px_320px]">
      <div className="my-16 rounded-2xl bg-gray-800 p-8 text-white shadow-2xl md:p-12">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="text-center md:w-1/2 md:text-left">
            <BrainCircuit className="mx-auto mb-4 h-16 w-16 text-yellow-400 md:mx-0" />
            <h2 className="mb-3 text-3xl font-bold md:text-4xl">
              {t("pages.main_page.ai_agent.title")}
            </h2>
            <p className="mx-auto max-w-lg text-gray-300 md:mx-0">
              {t("pages.main_page.ai_agent.description")}
            </p>
          </div>
          <div className="flex justify-center md:w-1/2 md:justify-end">
            <Link to="/ai-agent">
              <Button
                size="lg"
                className="h-14 rounded-full bg-yellow-400 px-8 text-lg font-bold text-black hover:bg-yellow-300"
              >
                {t("pages.main_page.ai_agent.button")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const { t } = useTranslation();
  const steps = [
    {
      icon: <Search className="mb-4 h-10 w-10 text-yellow-400" />,
      title: t("pages.main_page.how_it_works.step1_title"),
      description: t("pages.main_page.how_it_works.step1_desc"),
    },
    {
      icon: <Contact className="mb-4 h-10 w-10 text-yellow-400" />,
      title: t("pages.main_page.how_it_works.step2_title"),
      description: t("pages.main_page.how_it_works.step2_desc"),
    },
    {
      icon: <BarChart className="mb-4 h-10 w-10 text-yellow-400" />,
      title: t("pages.main_page.how_it_works.step3_title"),
      description: t("pages.main_page.how_it_works.step3_desc"),
    },
  ];

  return (
    <section className="my-16 [content-visibility:auto] [contain-intrinsic-size:1px_520px]">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold">
          {t("pages.main_page.how_it_works.title")}
        </h2>
        <p className="mt-2 text-gray-500">
          {t("pages.main_page.how_it_works.subtitle")}
        </p>
      </div>
      <div className="grid gap-8 text-center md:grid-cols-3">
        {steps.map((step) => (
          <div
            key={step.title}
            className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg"
          >
            <div className="flex justify-center">{step.icon}</div>
            <h3 className="mb-2 text-xl font-bold">{step.title}</h3>
            <p className="text-gray-600">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function MapCta() {
  const { t } = useTranslation();

  return (
    <section className="[content-visibility:auto] [contain-intrinsic-size:1px_420px]">
      <div className="relative my-16 overflow-hidden rounded-2xl">
        <img
          src={heroImage}
          loading="lazy"
          fetchPriority="low"
          decoding="async"
          width={1899}
          height={1209}
          className="absolute inset-0 h-full w-full object-cover"
          alt="Map background"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative container mx-auto px-4 py-16 text-center text-white">
          <Map className="mx-auto mb-4 h-16 w-16 text-yellow-400" />
          <h2 className="mb-3 text-3xl font-bold md:text-4xl">
            {t("pages.main_page.map.title")}
          </h2>
          <p className="mx-auto mb-8 max-w-2xl">
            {t("pages.main_page.map.description")}
          </p>
          <Link to="/map">
            <Button
              size="lg"
              className="h-14 rounded-full bg-yellow-400 px-8 text-lg font-bold text-black hover:bg-yellow-300"
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

function StatisticsSection() {
  const { t } = useTranslation();
  const stats = [
    {
      icon: <Home className="mb-2 h-10 w-10 text-blue-500" />,
      value: "500+",
      label: "pages.main_page.statistics.properties_listed",
    },
    {
      icon: <Users className="mb-2 h-10 w-10 text-green-500" />,
      value: "10K+",
      label: "pages.main_page.statistics.satisfied_users",
    },
    {
      icon: <Smile className="mb-2 h-10 w-10 text-yellow-500" />,
      value: "99%",
      label: "pages.main_page.statistics.positive_feedback",
    },
  ];

  return (
    <section className="my-16 [content-visibility:auto] [contain-intrinsic-size:1px_420px]">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold">
          {t("pages.main_page.statistics.title")}
        </h2>
        <p className="mt-2 text-gray-500">
          {t("pages.main_page.statistics.subtitle")}
        </p>
      </div>
      <div className="grid gap-8 rounded-lg bg-white p-8 text-center shadow-md md:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center">
            {stat.icon}
            <p className="text-4xl font-bold text-gray-800">{stat.value}</p>
            <p className="mt-1 text-gray-600">{t(stat.label)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function HomeSecondarySections() {
  return (
    <>
      <BrowseSellersCta />
      <MapCta />
      <AiAgentCta />
      <HowItWorks />
      <StatisticsSection />
    </>
  );
}
