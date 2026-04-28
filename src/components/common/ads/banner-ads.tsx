"use client";
import { useQuery } from "@tanstack/react-query";
import { advertiseService } from "@/services/advertise.service";
import type { IAdvertise } from "@/interfaces/advertise/advertise.interface";
import { useEffect, useState } from "react";
import ProjectPromoBanner from "./project-promo-banner";

export default function BannerAds() {
  const { data: ads, isLoading } = useQuery<IAdvertise | null, Error>({
    queryKey: ["banner-ad"],
    queryFn: () =>
      advertiseService.findOneByType("banner") as Promise<IAdvertise | null>,
    staleTime: 1000 * 60 * 5,
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

  // Loading paytida skeleton ko'rsatmaymiz — flicker'ning oldi olinadi.
  if (isLoading) return null;
  // Reklama yo'q bo'lsa — featured project banner promo
  if (!ads) return <ProjectPromoBanner />;

  return (
    <div className="my-4">
      <div className="w-full h-[302px] relative rounded-md overflow-hidden border border-black">
        <img
          className="w-full h-full object-cover"
          src={ads.image ?? ""}
          alt={"banner ad"}
        />
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
    </div>
  );
}
