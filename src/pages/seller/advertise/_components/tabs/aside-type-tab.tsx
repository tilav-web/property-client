import AsideAdsSkeleton from "@/components/common/ads/aside-ads-skeleton";
import BannerAdsSkeleton from "@/components/common/ads/banner-ads-skeleton";
import PropertyCardSkeleton from "@/components/common/cards/property-card-skeleton";
import { TabsContent } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

export default function AsideTypeTab({
  image,
  target,
}: {
  image: string;
  target: string;
}) {
  const navigate = useNavigate();

  return (
    <TabsContent value="aside">
      <div className="flex items-stretch gap-2">
        <div className="flex-1 flex flex-col gap-2">
          <PropertyCardSkeleton />
          <PropertyCardSkeleton />
          <PropertyCardSkeleton />
        </div>
        {image ? (
          <div
            onClick={() => navigate(target)}
            className="max-w-[395px] w-full cursor-pointer"
          >
            <img className="w-full h-full" src={image} alt="ads image" />
          </div>
        ) : (
          <AsideAdsSkeleton />
        )}
      </div>
      <BannerAdsSkeleton />
    </TabsContent>
  );
}
