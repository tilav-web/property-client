import { Skeleton } from "@/components/ui/skeleton";

export default function PropertyMiniCardSkeleton() {
  return (
    <div className="rounded-md shadow-xl h-full overflow-hidden w-full px-2 border border-black">
      <div className="w-full h-48 relative">
        <Skeleton className="w-full h-full rounded-none" />

        {/* Like button skeleton */}
        <div className="absolute top-2 flex items-center justify-between w-full px-2">
          <span></span>
          <Skeleton className="h-8 w-8 rounded" />
        </div>

        {/* Map button skeleton */}
        <Skeleton className="absolute right-2 bottom-2 h-9 w-9 rounded" />

        {/* Badge skeletonlari */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <Skeleton className="h-5 w-12 rounded" />
          <Skeleton className="h-5 w-14 rounded" />
        </div>
      </div>

      <div className="p-3">
        {/* Sarlavha va reyting */}
        <div className="flex items-start justify-between mb-2">
          <Skeleton className="h-5 flex-1 mr-2 rounded" />
          <div className="flex items-center gap-1 flex-shrink-0">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-3 w-3 rounded" />
              ))}
            </div>
            <Skeleton className="h-4 w-6 rounded" />
          </div>
        </div>

        {/* Manzil */}
        <div className="flex items-center gap-1 text-gray-600 mb-3">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-32 rounded" />
        </div>

        {/* Mulk ma'lumotlari */}
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
          <Skeleton className="h-4 w-10 rounded" />
          <Skeleton className="h-4 w-12 rounded" />
          <Skeleton className="h-4 w-11 rounded" />
        </div>

        {/* Narx */}
        <Skeleton className="h-6 w-28 rounded mb-2" />

        {/* Qurilish holati */}
        <Skeleton className="h-5 w-20 rounded" />
      </div>
    </div>
  );
}
