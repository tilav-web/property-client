import BannerAds from "@/components/common/ads/banner-ads";
import BannerAdsSkeleton from "@/components/common/ads/banner-ads-skeleton";
import ImageAds from "@/components/common/ads/image-ads";
import ImageAdsSkeleton from "@/components/common/ads/image-ads-skeleton";
import ApartmentRentCard from "@/components/common/cards/property/cards/categories/apartment-rent-card";
import PropertyMiniCardSkeleton from "@/components/common/cards/property/skeletons/property-mini-card-skeleton";
import type { PropertyType } from "@/interfaces/property/property.interface";

export default function FilterNavLayoutBlock({
  properties,
  isLoading,
}: {
  properties: PropertyType[];
  isLoading: boolean;
}) {
  return (
    <>
      {isLoading && (
        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {[...Array(4)].map((_, i) => (
              <PropertyMiniCardSkeleton key={`sk-top-${i}`} />
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {[...Array(2)].map((_, i) => (
              <PropertyMiniCardSkeleton key={`sk-bottom-${i}`} />
            ))}
            <div className="lg:col-span-2">
              <ImageAdsSkeleton />
            </div>
          </div>
          <div className="mb-4">
            <BannerAdsSkeleton />
          </div>
        </div>
      )}
      {!isLoading && (
        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {properties.slice(0, 4).map((property) => {
              return <ApartmentRentCard property={property} />;
            })}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {properties.slice(4).map((property) => {
              return <ApartmentRentCard property={property} />;
            })}
            <div className="lg:col-span-2">
              <ImageAds />
            </div>
          </div>
          <div className="mb-4">
            <BannerAds />
          </div>
        </div>
      )}
    </>
  );
}
