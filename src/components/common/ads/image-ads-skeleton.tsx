import { Skeleton } from "@/components/ui/skeleton";

export default function ImageAdsSkeleton() {
  return (
    <div className="w-full h-full rounded-md overflow-hidden shadow-lg border border-black">
      <Skeleton className="w-full h-full" />
    </div>
  );
}
