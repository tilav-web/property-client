"use client";
import { useQuery } from "@tanstack/react-query";
import { advertiseService } from "@/services/advertise.service";
import type { IAdvertise } from "@/interfaces/advertise/advertise.interface";
import ImageAdsSkeleton from "./image-ads-skeleton";

export default function ImageAds() {
  const { data: ads, isLoading } = useQuery<IAdvertise | null, Error>({
    queryKey: ["image-ad"],
    queryFn: () =>
      advertiseService.findOneByType("image") as Promise<IAdvertise | null>,
    staleTime: 1000 * 60,
  });

  if (isLoading) return <ImageAdsSkeleton />;
  if (!ads) return null;

  return (
    <div className="w-full h-full relative lg:h-86 rounded-md overflow-hidden shadow-lg">
      <img
        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        src={ads.image ?? ""}
        alt={"ads image"}
      />
      {ads.target && (
        <a
          href={ads.target}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0"
        />
      )}
    </div>
  );
}
