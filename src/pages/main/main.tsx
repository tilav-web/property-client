import HeroSection from "@/components/common/hero-section";
import PropertyCard from "@/components/common/property-card";
import PropertyBannerCard from "@/components/common/property-banner-card";
import { Button } from "@/components/ui/button";
import { categories } from "@/constants/mack-data";
import { asideImage } from "@/utils/shared";
import { useTranslation } from "react-i18next";
import { mainImage } from "@/utils/shared";

export default function Main() {
  const { t } = useTranslation();
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
        title={"O‘zbekistonning yuragida orzu xonadonlari"}
      />
      <div className="flex items-stretch gap-4 mb-4">
        <div className="flex-1">
          <PropertyCard />
          <PropertyCard />
          <PropertyCard />
          <PropertyCard />
        </div>
        <div className="max-w-[395px] w-full">
          <img className="w-full h-[629px] mb-2" src={asideImage} alt="image" />
          <p className="text-center mb-12">Популярные поиски</p>
          <div className="px-6">
            <p>
              Аренда квартир — особенно в районах Ташкента: Чиланзар, Сергели,
              Мирзо-Улугбек, Юнусабад, Миробад, Яшнабад. Эти районы чаще всего
              фигурируют в поиске жизни, как на карте, так и в текстовых
              запросах. Кроме аренды квартир, популярны запросы по аренде и
              покупке домов, продаже земли, а также аренде и продаже помещений.
            </p>
            <ul className="list-disc pl-8">
              <li>
                Вы получаете максимально релевантные результаты по районам,
                которых больше всего хотят найти.
              </li>
              <li>
                Обновлённые фильтры позволяют выбрать жильё по типу (квартира,
                дом, участок, помещение) и не тратить время на лишние параметры.
              </li>
              <li>
                Мы рекомендуем сразу просматривать объекты в самых
                востребованных районах — это сэкономит ваши усилия и нервы.
              </li>
            </ul>
          </div>
        </div>
      </div>
      <PropertyBannerCard />
    </>
  );
}
