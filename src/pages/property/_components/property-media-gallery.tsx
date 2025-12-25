import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import {
  Camera,
  CirclePlay,
  Sparkles,
  X,
} from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import { useState } from "react"; // Import useState
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog"; // Import Dialog components

interface MediaItem {
  type: "image" | "video";
  src: string;
}

export default function PropertyMediaGallery({
  photos = [],
  videos = [],
  isPremium = false,
}: {
  photos?: string[];
  videos?: string[];
  isPremium?: boolean;
}) {
  const allMedia: MediaItem[] = [
    ...videos.map((v) => ({ type: "video" as const, src: v })),
    ...photos.map((p) => ({ type: "image" as const, src: p })),
  ];

  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

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
                <div
                  className="relative aspect-[16/10] md:aspect-[16/8] lg:aspect-[16/7] overflow-hidden cursor-pointer"
                  onClick={() => {
                    setCurrentMediaIndex(index);
                    setIsGalleryOpen(true);
                  }}
                >
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

      {/* Full-screen Gallery Dialog */}
      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
        <DialogContent className="max-w-screen h-screen w-screen p-0 border-none bg-black flex items-center justify-center">
          <DialogClose className="absolute top-4 right-4 text-white z-50">
            <X className="h-6 w-6" />
          </DialogClose>
          <Carousel
            opts={{ initial: currentMediaIndex, loop: true }}
            className="w-full h-full flex items-center justify-center"
          >
            <CarouselContent className="h-full">
              {allMedia.map((media, index) => (
                <CarouselItem
                  key={index}
                  className="flex items-center justify-center h-full"
                >
                  {media.type === "image" ? (
                    <img
                      src={media.src}
                      alt=""
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <video
                      src={media.src}
                      controls
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="max-h-full max-w-full object-contain"
                    />
                  )}
                </CarouselItem>
              ))}
            </CarouselContent>
            {allMedia.length > 1 && (
              <>
                <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-white/20 backdrop-blur-xl hover:bg-white/40 border border-white/30 shadow-2xl hover:scale-110 transition-all" />
                <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-white/20 backdrop-blur-xl hover:bg-white/40 border border-white/30 shadow-2xl hover:scale-110 transition-all" />
              </>
            )}
          </Carousel>
        </DialogContent>
      </Dialog>
    </div>
  );
}
