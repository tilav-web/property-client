import AsideAdsSkeleton from "@/components/common/ads/aside-ads-skeleton";
import BannerAdsSkeleton from "@/components/common/ads/banner-ads-skeleton";
import PropertyCardSkeleton from "@/components/common/cards/property-card-skeleton";
import { TabsContent } from "@/components/ui/tabs";

export default function BannerTypeTab({
  image,
  target,
}: {
  image: string;
  target: string;
}) {
  return (
    <TabsContent value="banner">
      <div className="flex items-stretch gap-2 mb-4">
        <div className="flex-1 flex flex-col gap-2">
          <PropertyCardSkeleton />
          <PropertyCardSkeleton />
          <PropertyCardSkeleton />
        </div>
        <AsideAdsSkeleton />
      </div>
      {image ? (
        <div
          onClick={() => window.open(target, "_blank")}

          className="w-full h-[302px] relative my-2 rounded-md overflow-hidden cursor-pointer"
        >
          <img
            className="w-full h-full object-cover"
            src={image}
            alt="ads image"
          />
        </div>
      ) : (
        <BannerAdsSkeleton />
      )}
    </TabsContent>
  );
}
