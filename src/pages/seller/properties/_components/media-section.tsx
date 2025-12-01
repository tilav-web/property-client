// components/property/sections/MediaSection.tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Image, Video, X } from "lucide-react";

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
    <div className="space-y-8">
      {/* Rasm yuklash */}
      <div>
        <div className="border-2 border-dashed border-blue-300 rounded-xl p-10 text-center hover:border-blue-500 transition-colors">
          <Input
            id="photo-upload"
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFileUpload(e, "photo")}
            className="hidden"
          />
          <Label htmlFor="photo-upload" className="cursor-pointer">
            <Image className="w-16 h-16 mx-auto mb-4 text-blue-600" />
            <p className="text-lg font-semibold text-blue-700">Rasm yuklash</p>
            <p className="text-sm text-gray-600 mt-2">
              Bir nechta rasm tanlashingiz mumkin
            </p>
          </Label>
        </div>

        {photos.length > 0 && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {photos.map((photo, i) => (
              <div key={i} className="relative group">
                <img
                  src={photo.preview}
                  alt={`Rasm ${i + 1}`}
                  className="w-full h-32 object-cover rounded-lg border-2 border-blue-200"
                />
                <button
                  onClick={() => removePhoto(i)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Video yuklash */}
      <div>
        <div className="border-2 border-dashed border-purple-300 rounded-xl p-10 text-center hover:border-purple-500 transition-colors">
          <Input
            id="video-upload"
            type="file"
            multiple
            accept="video/*"
            onChange={(e) => handleFileUpload(e, "video")}
            className="hidden"
          />
          <Label htmlFor="video-upload" className="cursor-pointer">
            <Video className="w-16 h-16 mx-auto mb-4 text-purple-600" />
            <p className="text-lg font-semibold text-purple-700">
              Video yuklash
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Ixtiyoriy, lekin tavsiya etiladi
            </p>
          </Label>
        </div>

        {videos.length > 0 && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-6">
            {videos.map((video, i) => (
              <div key={i} className="relative group">
                <video
                  src={video.preview}
                  controls
                  className="w-full h-48 object-cover rounded-lg border-2 border-purple-200"
                />
                <button
                  onClick={() => removeVideo(i)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
