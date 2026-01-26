import ApartmentCard from "@/components/common/cards/property/cards/categories/apartment-card";
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
        </div>
      )}
      {!isLoading && (
        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {properties.map((property) => {
              return <ApartmentCard key={property._id} property={property} />;
            })}
          </div>
        </div>
      )}
    </>
  );
}
