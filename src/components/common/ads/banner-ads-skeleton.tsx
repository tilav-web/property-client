import { Skeleton } from "@/components/ui/skeleton";

export default function BannerAdsSkeleton() {
  return (
    <div className="w-full h-[302px] relative my-2 rounded-md overflow-hidden border border-black">
      <Skeleton className="w-full h-full" />
    </div>
  );
}
