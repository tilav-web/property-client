"use client";
import { useQuery } from "@tanstack/react-query";
import { advertiseService } from "@/services/advertise.service";
import type { IAdvertise } from "@/interfaces/advertise/advertise.interface";

export default function AsideAds() {
  const { data: ads, isLoading } = useQuery<IAdvertise | null, Error>({
    queryKey: ["aside-ad"],
    queryFn: () =>
      advertiseService.findOneByType("aside") as Promise<IAdvertise | null>,
    staleTime: 1000 * 60,
  });

  if (isLoading) return <div>Loading...</div>;
  if (!ads) return null;

  return (
    <div className="max-w-[395px] w-full border relative border-black rounded-2xl overflow-hidden">
      <img className="w-full h-full" src={ads.image ?? ""} alt={"aside ad"} />
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
