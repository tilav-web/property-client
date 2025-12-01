import { Skeleton } from "@/components/ui/skeleton";

export default function PropertyCardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-black">
      <div className="flex flex-col lg:flex-row items-stretch gap-4 lg:p-2">
        {/* Rasmlar qismi */}
        <div className="w-full lg:max-w-[320px] h-[240px] relative">
          <Skeleton className="w-full h-full rounded-none" />

          {/* Badge skeletonlari */}
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            <Skeleton className="h-6 w-20 rounded" />
            <Skeleton className="h-6 w-16 rounded" />
          </div>

          {/* Map button skeleton */}
          <Skeleton className="absolute right-4 bottom-4 h-8 w-8 rounded-md" />

          {/* Photo/video count skeleton */}
          <Skeleton className="absolute bottom-0 left-0 h-6 w-24 rounded-none" />
        </div>

        {/* Kontent qismi */}
        <div className="flex-1 flex flex-col justify-between gap-3 p-2">
          {/* Kategoriya va purpose */}
          <div className="flex flex-wrap gap-2 items-center">
            <Skeleton className="h-4 w-20 rounded" />
            <Skeleton className="h-2 w-2 rounded-full" />
            <Skeleton className="h-4 w-24 rounded" />
          </div>

          {/* Narx */}
          <Skeleton className="h-8 w-40 rounded" />

          {/* Tavsif */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-3/4 rounded" />
          </div>

          {/* Manzil */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-32 rounded" />
          </div>

          {/* Mulk ma'lumotlari */}
          <div className="flex flex-wrap gap-4">
            <Skeleton className="h-4 w-16 rounded" />
            <Skeleton className="h-4 w-12 rounded" />
            <Skeleton className="h-4 w-14 rounded" />
            <Skeleton className="h-4 w-20 rounded" />
          </div>

          {/* Qurilish holati */}
          <Skeleton className="h-6 w-24 rounded" />
        </div>

        {/* Sidebar (logo va stats) */}
        <div className="hidden lg:block space-y-2">
          <Skeleton className="w-[95px] h-[125px] rounded" />
          <Skeleton className="h-4 w-16 mx-auto rounded" />
          <Skeleton className="h-3 w-20 mx-auto rounded" />
        </div>
      </div>

      {/* Footer actions */}
      <div className="bg-[#B7B7B7] p-3 lg:p-2 rounded-b-xl">
        <div className="flex flex-col lg:flex-row items-center gap-3 justify-between">
          {/* Left buttons */}
          <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
            <Skeleton className="h-9 w-24 rounded" />
            <Skeleton className="h-9 w-28 rounded" />
          </div>

          {/* Right buttons */}
          <div className="flex flex-wrap gap-2 justify-center lg:justify-end">
            <Skeleton className="h-9 w-9 rounded" />
            <Skeleton className="h-9 w-9 rounded" />
            <Skeleton className="h-9 w-9 rounded" />
            <Skeleton className="h-9 w-9 rounded" />
            <Skeleton className="h-9 w-9 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
