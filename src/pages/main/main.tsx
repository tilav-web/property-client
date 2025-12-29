import HeroSection from "@/components/common/hero-section";
import PropertyCard from "@/components/common/property-card";
import { Button } from "@/components/ui/button";
import type { IProperty } from "@/interfaces/property/property.interface";
import { propertyService } from "@/services/property.service";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BrainCircuit,
  Search,
  Contact,
  BarChart,
  Map,
  Users,
  Home,
  Smile,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import heroImage from "@/assets/images/hero-image.jpg";
import BannerAds from "@/components/common/ads/banner-ads";
import ImageAds from "@/components/common/ads/image-ads";
import AsideAds from "@/components/common/ads/aside-ads";
import SellerCta from "@/components/common/seller-cta";

function FeaturedProperties() {
  const { t } = useTranslation();
  const {
    data: properties,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["featured-properties"],
    queryFn: () => propertyService.findAll({ limit: 3, sample: true }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-gray-200 animate-pulse rounded-lg aspect-[4/3]"
          ></div>
        ))}
      </div>
    );
  }

  if (isError || !properties?.properties?.length) {
    return (
      <div className="text-center py-12 bg-gray-100 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-700">
          {t("pages.main_page.featured_properties.showcase_title")}
        </h3>
        <p className="text-gray-500 mt-2">
          {t("pages.main_page.featured_properties.showcase_description")}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.properties.map((property: IProperty) => (
        <PropertyCard key={property._id} property={property} />
      ))}
    </div>
  );
}

function AiAgentCta() {
  const { t } = useTranslation();
  return (
    <div className="bg-gray-800 text-white rounded-2xl p-8 md:p-12 my-16 shadow-2xl">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="md:w-1/2 text-center md:text-left">
          <BrainCircuit className="w-16 h-16 mx-auto md:mx-0 mb-4 text-yellow-400" />
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            {t("pages.main_page.ai_agent.title")}
          </h2>
          <p className="text-gray-300 max-w-lg mx-auto md:mx-0">
            {t("pages.main_page.ai_agent.description")}
          </p>
        </div>
        <div className="md:w-1/2 flex justify-center md:justify-end">
          <Link to="/ai-agent">
            <Button
              size="lg"
              className="bg-yellow-400 text-black hover:bg-yellow-300 font-bold text-lg h-14 px-8 rounded-full transition-transform hover:scale-105"
            >
              {t("pages.main_page.ai_agent.button")}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function HowItWorks() {
  const { t } = useTranslation();
  const steps = [
    {
      icon: <Search className="w-10 h-10 mb-4 text-yellow-400" />,
      title: t("pages.main_page.how_it_works.step1_title"),
      description: t("pages.main_page.how_it_works.step1_desc"),
    },
    {
      icon: <Contact className="w-10 h-10 mb-4 text-yellow-400" />,
      title: t("pages.main_page.how_it_works.step2_title"),
      description: t("pages.main_page.how_it_works.step2_desc"),
    },
    {
      icon: <BarChart className="w-10 h-10 mb-4 text-yellow-400" />,
      title: t("pages.main_page.how_it_works.step3_title"),
      description: t("pages.main_page.how_it_works.step3_desc"),
    },
  ];

  return (
    <div className="my-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold">
          {t("pages.main_page.how_it_works.title")}
        </h2>
        <p className="text-gray-500 mt-2">
          {t("pages.main_page.how_it_works.subtitle")}
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-8 text-center">
        {steps.map((step, index) => (
          <div
            key={index}
            className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-center">{step.icon}</div>
            <h3 className="font-bold text-xl mb-2">{step.title}</h3>
            <p className="text-gray-600">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function MapCta() {
  const { t } = useTranslation();
  return (
    <div className="relative rounded-2xl overflow-hidden my-16">
      <img
        src={heroImage}
        className="absolute inset-0 w-full h-full object-cover"
        alt="Map background"
      />
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative container mx-auto px-4 py-16 text-center text-white">
        <Map className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
        <h2 className="text-3xl md:text-4xl font-bold mb-3">
          {t("pages.main_page.map.title")}
        </h2>
        <p className="max-w-2xl mx-auto mb-8">
          {t("pages.main_page.map.description")}
        </p>
        <Link to="/map">
          <Button
            size="lg"
            className="bg-yellow-400 text-black hover:bg-yellow-300 font-bold text-lg h-14 px-8 rounded-full transition-transform hover:scale-105"
          >
            {t("pages.main_page.map.button")}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

function StatisticsSection() {
  const { t } = useTranslation();
  const stats = [
    {
      icon: <Home className="w-10 h-10 mb-2 text-blue-500" />,
      value: "500+",
      label: "pages.main_page.statistics.properties_listed",
    },
    {
      icon: <Users className="w-10 h-10 mb-2 text-green-500" />,
      value: "10K+",
      label: "pages.main_page.statistics.satisfied_users",
    },
    {
      icon: <Smile className="w-10 h-10 mb-2 text-yellow-500" />,
      value: "99%",
      label: "pages.main_page.statistics.positive_feedback",
    },
  ];

  return (
    <div className="my-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold">
          {t("pages.main_page.statistics.title")}
        </h2>
        <p className="text-gray-500 mt-2">
          {t("pages.main_page.statistics.subtitle")}
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-8 text-center bg-white p-8 rounded-lg shadow-md">
        {stats.map((stat, index) => (
          <div key={index} className="flex flex-col items-center">
            {stat.icon}
            <p className="text-4xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-gray-600 mt-1">{t(stat.label)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Main() {
  const { t } = useTranslation();
  return (
    <div className="w-full">
      <HeroSection title="pages.hero.title" img={heroImage} />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">
            {t("pages.main_page.featured_properties.title")}
          </h2>
          <p className="text-gray-500 mt-2">
            {t("pages.main_page.featured_properties.subtitle")}
          </p>
        </div>
        <FeaturedProperties />
        <div className="text-center mt-12">
          <Link to="/search">
            <Button variant="outline" size="lg">
              {t("pages.main_page.featured_properties.view_all")}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>

        <SellerCta />

        <MapCta />

        <AiAgentCta />

        <HowItWorks />

        <StatisticsSection />
      </div>
    </div>
  );
}
