"use client";
import { useQuery } from "@tanstack/react-query";
import { advertiseService } from "@/services/advertise.service";
import type { IAdvertise } from "@/interfaces/advertise/advertise.interface";
import AsideAdsSkeleton from "./aside-ads-skeleton";
import { useEffect, useState } from "react";

export default function AsideAds({ className }: { className?: string }) {
  const { data: ads, isLoading } = useQuery<IAdvertise | null, Error>({
    queryKey: ["aside-ad"],
    queryFn: () =>
      advertiseService.findOneByType("aside") as Promise<IAdvertise | null>,
    staleTime: 1000 * 60,
  });

  const [hasViewed, setHasViewed] = useState(false);

  useEffect(() => {
    if (ads && !hasViewed) {
      advertiseService.incrementView(ads._id);
      setHasViewed(true);
    }
  }, [ads, hasViewed]);

  const handleClick = () => {
    if (ads) {
      advertiseService.incrementClick(ads._id);
    }
  };

  if (isLoading) return <AsideAdsSkeleton />;
  if (!ads) return null;

  return (
    <div
      className={`max-w-[395px] w-full border relative border-black rounded-2xl overflow-hidden ${className}`}
    >
      <img className="w-full h-full" src={ads.image ?? ""} alt={"aside ad"} />
      {ads.target && (
        <a
          href={ads.target}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0"
          onClick={handleClick}
        />
      )}
    </div>
  );
}
