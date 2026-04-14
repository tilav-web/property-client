import PropertyCard from "@/components/common/property-card";
import { Button } from "@/components/ui/button";
import type { IProperty } from "@/interfaces/property/property.interface";
import { propertyService } from "@/services/property.service";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function FeaturedSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-xl bg-gray-100">
          <div className="h-48 rounded-t-xl bg-gray-200" />
          <div className="space-y-3 p-4">
            <div className="h-4 w-2/3 rounded bg-gray-200" />
            <div className="h-3 w-full rounded bg-gray-200" />
            <div className="h-3 w-1/2 rounded bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

function FeaturedProperties() {
  const { t } = useTranslation();
  const {
    data: properties,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["featured-properties"],
    queryFn: () => propertyService.findAll({ limit: 6, sample: true }),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) return <FeaturedSkeleton />;

  if (isError || !properties?.properties?.length) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 py-16 text-center">
        <h3 className="text-lg font-semibold text-gray-600">
          {t("pages.main_page.featured_properties.showcase_title")}
        </h3>
        <p className="mt-2 text-sm text-gray-400">
          {t("pages.main_page.featured_properties.showcase_description")}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {properties.properties.map((property: IProperty) => (
        <PropertyCard key={property._id} property={property} />
      ))}
    </div>
  );
}

export default function FeaturedPropertiesSection() {
  const { t } = useTranslation();

  return (
    <section className="py-12 [content-visibility:auto] [contain-intrinsic-size:1px_900px]">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
            {t("pages.main_page.featured_properties.title")}
          </h2>
          <p className="mt-1.5 text-gray-500">
            {t("pages.main_page.featured_properties.subtitle")}
          </p>
        </div>
        <Link to="/search" className="hidden sm:block">
          <Button variant="outline" className="gap-2 rounded-lg">
            {t("pages.main_page.featured_properties.view_all")}
            <ArrowRight size={16} />
          </Button>
        </Link>
      </div>

      <FeaturedProperties />

      <div className="mt-8 text-center sm:hidden">
        <Link to="/search">
          <Button variant="outline" className="gap-2 rounded-lg">
            {t("pages.main_page.featured_properties.view_all")}
            <ArrowRight size={16} />
          </Button>
        </Link>
      </div>
    </section>
  );
}
