import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Camera,
  CirclePlay,
  MapPin,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import type { PropertyStatusType } from "@/interfaces/types/property.status.type";

interface MediaItem {
  type: "image" | "video";
  src: string;
}

export default function PropertyMediaGallery({
  photos = [],
  videos = [],
  status = "PENDING",
  isPremium = false,
}: {
  photos?: string[];
  videos?: string[];
  status?: PropertyStatusType;
  isPremium?: boolean;
}) {
  const allMedia: MediaItem[] = [
    ...videos.map((v) => ({ type: "video" as const, src: v })),
    ...photos.map((p) => ({ type: "image" as const, src: p })),
  ];

  if (allMedia.length === 0) {
    return (
      <div className="relative aspect-[16/10] rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-2xl">
        <div className="text-center">
          <Camera className="w-20 h-20 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Rasm mavjud emas</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-12">
      <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-black/50">
        <Carousel
          opts={{ loop: true }}
          plugins={[
            Autoplay({
              delay: 5000,
              stopOnMouseEnter: true,
              stopOnInteraction: false,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent className="-ml-0">
            {allMedia.map((media, index) => (
              <CarouselItem key={index} className="pl-0">
                <div className="relative aspect-[16/10] md:aspect-[16/8] lg:aspect-[16/7] overflow-hidden">
                  {/* Media */}
                  {media.type === "image" ? (
                    <img
                      src={media.src}
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                  ) : (
                    <video
                      src={media.src}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  )}

                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                  {/* Premium Badges - Glassmorphism */}
                  <div className="absolute top-6 left-6 flex flex-col gap-3">
                    {status && (
                      <Badge className="bg-emerald-500/20 backdrop-blur-lg border border-emerald-400/30 text-emerald-300 shadow-xl">
                        <ShieldCheck className="w-4 h-4 mr-1.5" />
                        Tasdiqlangan
                      </Badge>
                    )}
                    {isPremium && (
                      <Badge className="bg-gradient-to-r from-amber-400/30 to-orange-500/30 backdrop-blur-lg border border-amber-400/40 text-amber-200 shadow-2xl">
                        <Sparkles className="w-4 h-4 mr-1.5" />
                        Premium
                      </Badge>
                    )}
                  </div>

                  {/* Video Play Icon */}
                  {media.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="bg-white/20 backdrop-blur-md rounded-full p-6 shadow-2xl border border-white/30 animate-pulse">
                        <CirclePlay className="w-16 h-16 text-white fill-white" />
                      </div>
                    </div>
                  )}

                  {/* Bottom Left - Media Counter */}
                  <div className="absolute bottom-6 left-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-5 py-3 shadow-2xl">
                    <div className="flex items-center gap-3 text-white font-semibold text-sm">
                      <Camera className="w-5 h-5" />
                      <span>{photos.length}</span>
                      {videos.length > 0 && (
                        <>
                          <CirclePlay className="w-5 h-5" />
                          <span>{videos.length}</span>
                        </>
                      )}
                      <span className="ml-2 opacity-80">
                        {index + 1} / {allMedia.length}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Right - Map Button */}
                  <Button
                    variant="secondary"
                    size="lg"
                    className="absolute flex items-center gap-2 bottom-6 right-6 bg-white/20 backdrop-blur-xl hover:bg-white/30 border border-white/30 text-white shadow-2xl transition-all hover:scale-105"
                  >
                    <MapPin className="w-6 h-6" />
                    <span className="hidden sm:block">Xaritada ko‘rish</span>
                  </Button>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation Arrows */}
          {allMedia.length > 1 && (
            <>
              <CarouselPrevious className="left-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-xl hover:bg-white/40 border border-white/30 text-white shadow-2xl hover:scale-110 transition-all" />
              <CarouselNext className="right-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-xl hover:bg-white/40 border border-white/30 text-white shadow-2xl hover:scale-110 transition-all" />
            </>
          )}
        </Carousel>
      </div>
    </div>
  );
}
