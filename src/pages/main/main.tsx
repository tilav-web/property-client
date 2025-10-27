import HeroSection from "@/components/common/hero-section";
import PropertyCard from "@/components/common/cards/property-card";
import { asideImage } from "@/utils/shared";
import { useTranslation } from "react-i18next";
import { mainImage } from "@/utils/shared";
import { useQuery } from "@tanstack/react-query";
import { propertyService } from "@/services/property.service";
import type {
  IProperty,
  PropertyCategory,
} from "@/interfaces/property.interface";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import CategoryFilter from "@/components/common/category-filter";

export default function Main() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const category = params.get("category") as PropertyCategory;
  const { data, refetch } = useQuery({
    queryKey: ["properties"],
    queryFn: () =>
      propertyService.findAll({ limit: 9, sample: false, category }),
  });

  // Faqat category o'zgarganda refetch qilish
  useEffect(() => {
    refetch();
  }, [category]);

  return (
    <>
      <CategoryFilter />
      <HeroSection img={mainImage} title={"pages.hero.title"} />
      <div>
        <div className="flex items-stretch gap-4 mb-4 flex-col md:flex-row mt-4">
          <div className="flex-1 flex flex-col gap-4">
            {data?.properties?.slice(0, 4)?.map((property: IProperty) => {
              return <PropertyCard key={property?._id} property={property} />;
            })}
          </div>
          <div className="max-w-[395px] w-full bg-red-500">
            <img className="w-full h-full" src="" alt="" />
          </div>
        </div>
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
            <p className="text-center mb-12">
              {t("pages.main_page.popular_searches")}
            </p>
            <div className="px-6">
              <p>{t("pages.main_page.popular_searches_text")}</p>
              <ul className="list-disc pl-8">
                <li>{t("pages.main_page.list_item_1")}</li>
                <li>{t("pages.main_page.list_item_2")}</li>
                <li>{t("pages.main_page.list_item_3")}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
