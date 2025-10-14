import HeroSection from "@/components/common/hero-section";
import PropertyCard from "@/components/common/cards/property-card";
import PropertyBannerCard from "@/components/common/cards/property-banner-card";
import { Button } from "@/components/ui/button";
import { categories } from "@/constants/mack-data";
import { asideImage } from "@/utils/shared";
import { useTranslation } from "react-i18next";
import { mainImage } from "@/utils/shared";
import { useQuery } from "@tanstack/react-query";
import { propertyService } from "@/services/property.service";
import type { IProperty } from "@/interfaces/property.interface";

export default function Main() {
  const { t } = useTranslation();
  const { data } = useQuery({
    queryKey: ["properties"],
    queryFn: () => propertyService.findAll({ limit: 9, sample: false }),
  });

  return (
    <>
      <div className="shadow-xl my-4">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-center gap-8 flex-wrap">
            {categories.map(({ key, count }) => (
              <Button key={key} variant="ghost" className="text-sm group">
                {t(`categories.${key}`)}
                <span className="text-muted-foreground group-hover:text-foreground ml-1">
                  ({count})
                </span>
              </Button>
            ))}
          </div>
        </div>
      </div>
      <HeroSection
        img={mainImage}
        title={"pages.hero.title"}
        handlePropertyType={() => {}}
      />
      <div>
        <div className="flex items-stretch gap-4 mb-4 flex-col md:flex-row mt-4">
          <div className="flex-1 flex flex-col gap-4">
            {data?.properties?.slice(0, 4)?.map((property: IProperty) => {
              return <PropertyCard key={property?._id} property={property} />;
            })}
          </div>
          <div className="max-w-[395px] w-full">
            <img
              className="w-full h-[629px] mb-2"
              src={asideImage}
              alt="image"
            />
            <p className="text-center mb-12">{t("pages.main_page.popular_searches")}</p>
            <div className="px-6">
              <p>
                {t("pages.main_page.popular_searches_text")}
              </p>
              <ul className="list-disc pl-8">
                <li>
                  {t("pages.main_page.list_item_1")}
                </li>
                <li>
                  {t("pages.main_page.list_item_2")}
                </li>
                <li>
                  {t("pages.main_page.list_item_3")}
                </li>
              </ul>
            </div>
          </div>
        </div>
        {data?.properties?.slice(4, 5)[0] && (
          <PropertyBannerCard property={data?.properties?.slice(4, 5)[0]} />
        )}
      </div>
      <div>
        <div className="flex items-stretch gap-4 mb-4 flex-col md:flex-row mt-4">
          <div className="flex-1 flex flex-col gap-4">
            {data?.properties?.slice(5, 8)?.map((property: IProperty) => {
              return <PropertyCard key={property?._id} property={property} />;
            })}
          </div>
          <div className="max-w-[395px] w-full">
            <img
              className="w-full h-[629px] mb-2"
              src={asideImage}
              alt="image"
            />
            <p className="text-center mb-12">{t("pages.main_page.popular_searches")}</p>
            <div className="px-6">
              <p>
                {t("pages.main_page.popular_searches_text")}
              </p>
              <ul className="list-disc pl-8">
                <li>
                  {t("pages.main_page.list_item_1")}
                </li>
                <li>
                  {t("pages.main_page.list_item_2")}
                </li>
                <li>
                  {t("pages.main_page.list_item_3")}
                </li>
              </ul>
            </div>
          </div>
        </div>
        {data?.properties?.slice(8)[0] && (
          <PropertyBannerCard property={data?.properties?.slice(4, 5)[0]} />
        )}
      </div>
    </>
  );
}
