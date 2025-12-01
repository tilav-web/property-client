import BannerAdsSkeleton from "@/components/common/ads/banner-ads-skeleton";
import ImageAdsSkeleton from "@/components/common/ads/image-ads-skeleton";
import PropertyMiniCardSkeleton from "@/components/common/cards/property/skeletons/property-mini-card-skeleton";
import { TabsContent } from "@/components/ui/tabs";

export default function ImageTypeTab({
  image,
  target,
}: {
  image: string;
  target: string;
}) {
  return (
    <TabsContent value="image">
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <PropertyMiniCardSkeleton />
          <PropertyMiniCardSkeleton />
          <PropertyMiniCardSkeleton />
          <PropertyMiniCardSkeleton />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PropertyMiniCardSkeleton />
            <PropertyMiniCardSkeleton />
          </div>
          {image ? (
            <div
              onClick={() => window.open(target, "_blank")}
              className="w-full h-[22rem] rounded-md overflow-hidden shadow-lg cursor-pointer"
            >
              <img
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                src={image}
                alt="ads image"
              />
            </div>
          ) : (
            <ImageAdsSkeleton />
          )}
        </div>
        <BannerAdsSkeleton />
      </div>
    </TabsContent>
  );
}
