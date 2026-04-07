import PropertyCard from "@/components/common/property-card";
import { Button } from "@/components/ui/button";
import type { IProperty } from "@/interfaces/property/property.interface";
import { propertyService } from "@/services/property.service";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function FeaturedProperties() {
  const { t } = useTranslation();
  const {
    data: properties,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["featured-properties"],
    queryFn: () => propertyService.findAll({ limit: 3, sample: true }),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="aspect-[4/3] animate-pulse rounded-lg bg-gray-200"
          />
        ))}
      </div>
    );
  }

  if (isError || !properties?.properties?.length) {
    return (
      <div className="rounded-lg bg-gray-100 py-12 text-center">
        <h3 className="text-xl font-semibold text-gray-700">
          {t("pages.main_page.featured_properties.showcase_title")}
        </h3>
        <p className="mt-2 text-gray-500">
          {t("pages.main_page.featured_properties.showcase_description")}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {properties.properties.map((property: IProperty) => (
        <PropertyCard key={property._id} property={property} />
      ))}
    </div>
  );
}

export default function FeaturedPropertiesSection() {
  const { t } = useTranslation();

  return (
    <section className="[content-visibility:auto] [contain-intrinsic-size:1px_900px]">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold">
          {t("pages.main_page.featured_properties.title")}
        </h2>
        <p className="mt-2 text-gray-500">
          {t("pages.main_page.featured_properties.subtitle")}
        </p>
      </div>

      <FeaturedProperties />

      <div className="mt-12 text-center">
        <Link to="/search">
          <Button variant="outline" size="lg">
            {t("pages.main_page.featured_properties.view_all")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
