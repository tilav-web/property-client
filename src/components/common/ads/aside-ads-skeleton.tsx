import { Skeleton } from "@/components/ui/skeleton";

export default function AsideAdsSkeleton() {
  return (
    <div className="max-w-[395px] w-full border border-black rounded-2xl overflow-hidden">
      <Skeleton className="h-full w-full" />
    </div>
  );
}
