import PropertyBannerCard from "@/components/common/cards/property-banner-card";
import PropertyImageCard from "@/components/common/cards/property-image-card";
import PropertyMiniCard from "@/components/common/cards/property-mini-card";
import HeroSection from "@/components/common/hero-section";
import { property, user } from "@/constants/mack-data";
import { heroImage } from "@/utils/shared";

export default function RentApartments() {
  const propertyWithAuthor = { ...property, author: user };

  const properties = Array.from({ length: 20 }, (_, index) => {
    const six = (index + 1) % 7;

    if (six === 0) {
      return (
        <div key={index} className="contents">
          <div className="w-full lg:w-1/2">
            <PropertyImageCard />
          </div>
          <div className="w-full">
            <PropertyBannerCard property={propertyWithAuthor} />
          </div>
        </div>
      );
    }

    return (
      <div key={index} className="w-full sm:w-1/2 lg:w-1/4 px-2">
        <PropertyMiniCard property={propertyWithAuthor} />
      </div>
    );
  });

  return (
    <div className="py-12">
      <HeroSection
        title="Dream apartments in the
 heart of Uzbekistan"
        img={heroImage}
        className="text-white"
      />
      <div className="flex flex-wrap -mx-2 items-stretch gap-y-4">
        {properties}
      </div>
    </div>
  );
}
