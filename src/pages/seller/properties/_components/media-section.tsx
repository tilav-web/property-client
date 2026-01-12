// components/property/sections/MediaSection.tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Image, Video, X, Upload, FileWarning } from "lucide-react";
import { cn } from "@/lib/utils";

interface PhotoFile {
  file: File;
  preview: string;
}

interface VideoFile {
  file: File;
  preview: string;
}

interface Props {
  photos: PhotoFile[];
  setPhotos: React.Dispatch<React.SetStateAction<PhotoFile[]>>;
  videos: VideoFile[];
  setVideos: React.Dispatch<React.SetStateAction<VideoFile[]>>;
}

export default function MediaSection({
  photos,
  setPhotos,
  videos,
  setVideos,
}: Props) {
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "photo" | "video"
  ) => {
    const files = Array.from(e.target.files || []);
    const newItems = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    if (type === "photo") {
      setPhotos((prev) => [...prev, ...newItems]);
    } else {
      setVideos((prev) => [...prev, ...newItems]);
    }
  };

  const removePhoto = (index: number) => {
    URL.revokeObjectURL(photos[index].preview);
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index: number) => {
    URL.revokeObjectURL(videos[index].preview);
    setVideos((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-12">
      {/* Photos Section */}
      <Card className="border-2 border-transparent hover:border-blue-100 transition-all duration-300">
        <CardContent className="p-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <Image className="w-7 h-7 text-blue-600" />
                  Rasmlar
                </h3>
                <p className="text-gray-600 mt-2">
                  Ko'proq rasmlar obyekt haqida to'liqroq tasavvur beradi
                </p>
              </div>
              <div className="text-sm text-gray-500 bg-blue-50 px-4 py-2 rounded-full">
                {photos.length} ta rasm
              </div>
            </div>

            <div
              className={cn(
                "border-3 border-dashed rounded-2xl p-12 text-center transition-all duration-300",
                photos.length === 0
                  ? "border-blue-200 bg-blue-50 hover:bg-blue-100"
                  : "border-gray-200 bg-gray-50 hover:bg-gray-100"
              )}
            >
              <div className="max-w-md mx-auto">
                <Input
                  id="photo-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "photo")}
                  className="hidden"
                />
                <Label
                  htmlFor="photo-upload"
                  className="cursor-pointer block space-y-4"
                >
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white border-4 border-blue-100 shadow-lg">
                    <Upload className="w-10 h-10 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-gray-900 mb-2">
                      Rasm yuklash
                    </p>
                    <p className="text-gray-600 mb-4">
                      PNG, JPG yoki WebP formatlari, maksimal 5MB
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      className="bg-white border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400"
                    >
                      Fayllarni tanlash
                    </Button>
                  </div>
                </Label>
              </div>
            </div>

            {/* Photos Grid */}
            {photos.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">
                    Yuklangan rasmlar
                  </h4>
                  <button
                    onClick={() => setPhotos([])}
                    className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    Barchasini o'chirish
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {photos.map((photo, i) => (
                    <div
                      key={i}
                      className="relative group aspect-square rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <img
                        src={photo.preview}
                        alt={`Rasm ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <button
                          onClick={() => removePhoto(i)}
                          className="bg-red-500 text-white rounded-full p-1.5 transform translate-x-4 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-600 shadow-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        {i + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Videos Section */}
      <Card className="border-2 border-transparent hover:border-purple-100 transition-all duration-300">
        <CardContent className="p-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <Video className="w-7 h-7 text-purple-600" />
                  Videolar
                  <span className="text-sm font-normal text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                    Ixtiyoriy
                  </span>
                </h3>
                <p className="text-gray-600 mt-2">
                  360° tur va virtual sayr videolari mijozlarga yordam beradi
                </p>
              </div>
              <div className="text-sm text-gray-500 bg-purple-50 px-4 py-2 rounded-full">
                {videos.length} ta video
              </div>
            </div>

            <div
              className={cn(
                "border-3 border-dashed rounded-2xl p-12 text-center transition-all duration-300",
                videos.length === 0
                  ? "border-purple-200 bg-purple-50 hover:bg-purple-100"
                  : "border-gray-200 bg-gray-50 hover:bg-gray-100"
              )}
            >
              <div className="max-w-md mx-auto">
                <Input
                  id="video-upload"
                  type="file"
                  multiple
                  accept="video/*"
                  onChange={(e) => handleFileUpload(e, "video")}
                  className="hidden"
                />
                <Label
                  htmlFor="video-upload"
                  className="cursor-pointer block space-y-4"
                >
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white border-4 border-purple-100 shadow-lg">
                    <Video className="w-10 h-10 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-gray-900 mb-2">
                      Video yuklash
                    </p>
                    <p className="text-gray-600 mb-4">
                      MP4, MOV yoki WebM formatlari, maksimal 100MB
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      className="bg-white border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-400"
                    >
                      Videolarni tanlash
                    </Button>
                  </div>
                </Label>
              </div>
            </div>

            {/* Videos Grid */}
            {videos.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">
                    Yuklangan videolar
                  </h4>
                  <button
                    onClick={() => setVideos([])}
                    className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    Barchasini o'chirish
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videos.map((video, i) => (
                    <div
                      key={i}
                      className="relative group rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                    >
                      <div className="aspect-video bg-gray-900 relative">
                        <video
                          src={video.preview}
                          controls
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3">
                          <button
                            onClick={() => removeVideo(i)}
                            className="bg-red-500 text-white rounded-full p-2 transform translate-x-4 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-600 shadow-lg"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="absolute bottom-3 left-3 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
                          Video {i + 1}
                        </div>
                      </div>
                      <div className="p-4 bg-white">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {video.file.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {(video.file.size / (1024 * 1024)).toFixed(1)} MB
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Help Text */}
            {videos.length === 0 && (
              <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                <FileWarning className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800">
                    Video tavsiya etiladi
                  </p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Obyekt haqida to'liq tasavvur berish uchun kamida bitta
                    video yuklang. Bu mijozlar qaror qabul qilishda yordam
                    beradi.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
