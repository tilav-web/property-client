import PropertyBannerCard from "@/components/common/cards/property-banner-card";
import PropertyImageCard from "@/components/common/cards/property-image-card";
import PropertyMiniCard from "@/components/common/cards/property-mini-card";
import HeroSection from "@/components/common/hero-section";
import {
  type IProperty,
  type PropertyCategory,
  type PropertyPriceType,
  type PropertyPurpose,
} from "@/interfaces/property.interface";
import { propertyService } from "@/services/property.service";
import { heroImage } from "@/utils/shared";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

// Property grid item komponenti
const PropertyGridItem = ({
  property,
  index,
}: {
  property: IProperty;
  index: number;
}) => {
  const six = (index + 1) % 7;

  if (six === 0) {
    return (
      <div className="contents">
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
    <div className="w-full sm:w-1/2 lg:w-1/4 px-2">
      <PropertyMiniCard property={property} />
    </div>
  );
};

export default function FilterNav() {
  const [params] = useSearchParams();
  const purpose = params.get("purpose") as PropertyPurpose;
  const category = params.get("category") as PropertyCategory;
  const price_type = params.get("price_type") as PropertyPriceType;
  const { t } = useTranslation();

  // Query key ni dynamic qilish
  const queryKey = useMemo(() => ["properties", "purpose", purpose], [purpose]);

  const { data, refetch } = useQuery({
    queryKey,
    queryFn: () =>
      propertyService.findAll({
        limit: 24,
        sample: true,
        price_type,
        purpose,
        category,
      }),
    // Cache vaqtini sozlash
    staleTime: 5 * 60 * 1000, // 5 minut
  });

  // Faqat category o'zgarganda refetch qilish
  useEffect(() => {
    refetch();
  }, [purpose, category, price_type]);

  // Memoized properties
  const properties = useMemo(() => data?.properties || [], [data?.properties]);

  return (
    <div className="py-12">
      <HeroSection
        title={t("pages.category_page.title")}
        img={heroImage}
        className="text-white"
      />
      <div className="flex flex-wrap -mx-2 items-stretch gap-y-4">
        {properties.map((property: IProperty, index: number) => (
          <PropertyGridItem
            key={property._id || index}
            property={property}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
