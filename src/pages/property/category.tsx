import PropertyBannerCard from "@/components/common/cards/property-banner-card";
import PropertyImageCard from "@/components/common/cards/property-image-card";
import PropertyMiniCard from "@/components/common/cards/property-mini-card";
import HeroSection from "@/components/common/hero-section";
import type { IProperty, PropertyType } from "@/interfaces/property.interface";
import { propertyService } from "@/services/property.service";
import { heroImage } from "@/utils/shared";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

export default function Category() {
  const [params] = useSearchParams();
  const category = params.get("category");
  const [property_type, setPropertyType] = useState<PropertyType | undefined>();
  const { t } = useTranslation();

  const { data, refetch } = useQuery({
    queryKey: ["properties/category"],
    queryFn: () =>
      propertyService.findAll({
        limit: 24,
        sample: true,
        price_type: "rent",
        category:
          category === "villa" ||
          category === "shop" ||
          category === "office" ||
          category === "land" ||
          category === "house" ||
          category === "garage" ||
          category === "apartment"
            ? category
            : "apartment",
        property_type,
      }),
  });

  useEffect(() => {
    refetch();
  }, [category, refetch, property_type]);

  const handlePropertyType = (value: PropertyType) => {
    setPropertyType(value);
  };

  return (
    <div className="py-12">
      <HeroSection
        title={t("pages.category_page.title")}
        img={heroImage}
        className="text-white"
        handlePropertyType={handlePropertyType}
        property_type={property_type}
      />
      <div className="flex flex-wrap -mx-2 items-stretch gap-y-4">
        {data?.properties?.map((property: IProperty, index: number) => {
          const six = (index + 1) % 7;

          if (six === 0) {
            return (
              <div key={index} className="contents">
                <div className="w-full lg:w-1/2">
                  <PropertyImageCard />
                </div>
                <div className="w-full">
                  <PropertyBannerCard property={property} />
                </div>
              </div>
            );
          }

          return (
            <div key={index} className="w-full sm:w-1/2 lg:w-1/4 px-2">
              <PropertyMiniCard property={property} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
