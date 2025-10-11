"use client";
import { useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, ImageIcon } from "lucide-react";

interface FileUploadProps<T extends File | File[] | null> {
  type: "banner" | "photos" | "video";
  maxFiles?: number;
  files: T;
  setFiles: React.Dispatch<React.SetStateAction<T>>;
}

const FileUpload = <T extends File | File[] | null>({ type, maxFiles = 1, files, setFiles }: FileUploadProps<T>) => {
  const isMultiple = type === "photos";
  const inputId = `${type}-upload`;

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newFiles = Array.from(e.target.files || []);
      if (isMultiple) {
        setFiles((prev) => {
          const currentFiles = Array.isArray(prev) ? prev : [];
          return [...currentFiles, ...newFiles].slice(0, maxFiles) as T;
        });
      } else {
        // TypeScriptga newFiles[0] yoki null T tipiga mos kelishini bildirish
        setFiles((newFiles[0] || null) as T);
      }
    },
    [isMultiple, maxFiles, setFiles]
  );

  const handleRemove = useCallback(
    (index?: number) => {
      if (isMultiple && index !== undefined) {
        setFiles((prev) => {
          const currentFiles = Array.isArray(prev) ? prev : [];
          return currentFiles.filter((_, i) => i !== index) as T;
        });
      } else {
        setFiles(null as T);
      }
    },
    [isMultiple, setFiles]
  );

  const handleButtonClick = useCallback(() => {
    const input = document.getElementById(inputId) as HTMLInputElement;
    input?.click();
  }, [inputId]);

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
      {files && (isMultiple ? Array.isArray(files) && files.length > 0 : files) ? (
        <div className={isMultiple ? "grid grid-cols-2 md:grid-cols-3 gap-4" : "relative"}>
          {isMultiple && Array.isArray(files) ? (
            files.map((file, index) => (
              <div key={index} className="relative group">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
              </div>
            ))
          ) : (
            files && (
              <div className="relative">
                {type === "video" ? (
                  <video
                    src={URL.createObjectURL(files as File)}
                    className="w-full h-32 object-cover rounded-lg"
                    controls
                  />
                ) : (
                  <img
                    src={URL.createObjectURL(files as File)}
                    alt={`${type} preview`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                )}
                <button
                  type="button"
                  onClick={() => handleRemove()}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600"
                >
                  <X size={16} />
                </button>
                <Badge
                  className={`absolute top-2 left-2 ${type === "video" ? "bg-green-500" : "bg-blue-500"}`}
                >
                  {type === "video" ? "Video" : "Banner Rasm"}
                </Badge>
              </div>
            )
          )}
        </div>
      ) : (
        <div className="text-center">
          {type === "photos" ? (
            <ImageIcon className="mx-auto h-8 w-8 text-gray-400" />
          ) : (
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
          )}
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-900">
              {type === "photos"
                ? "Rasmlar"
                : type === "video"
                ? "Video yuklang"
                : "Banner rasmini yuklang"}
            </p>
            <p className="text-sm text-gray-500">
              {isMultiple ? "Maksimum 5 ta rasm" : "Faqat 1 ta fayl"}
            </p>
          </div>
          <Input
            type="file"
            accept={type === "video" ? "video/*" : "image/*"}
            multiple={isMultiple}
            onChange={handleFileChange}
            className="hidden"
            id={inputId}
          />
          <Button
            type="button"
            variant="outline"
            className="mt-2 bg-transparent"
            onClick={handleButtonClick}
          >
            {isMultiple
              ? `Rasmlar Qoʻshish (${(Array.isArray(files) ? files.length : 0)}/5)`
              : `${type === "video" ? "Video" : "Rasm"} Tanlash`}
          </Button>
        </div>
      )}
    </div>
  );
};

export default function MediaTab({
  bannerFile,
  setBannerFile,
  photoFiles,
  setPhotoFiles,
  videoFile,
  setVideoFile,
}: {
  bannerFile: File | null;
  setBannerFile: React.Dispatch<React.SetStateAction<File | null>>;
  photoFiles: File[];
  setPhotoFiles: React.Dispatch<React.SetStateAction<File[]>>;
  videoFile: File | null;
  setVideoFile: React.Dispatch<React.SetStateAction<File | null>>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Media Fayllar
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-medium mb-3 text-sm text-gray-700">Banner Rasm</h4>
          <FileUpload<File | null> type="banner" files={bannerFile} setFiles={setBannerFile} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-3 text-sm text-gray-700">Rasmlar (maksimum 5 ta)</h4>
            <FileUpload<File[]> type="photos" maxFiles={5} files={photoFiles} setFiles={setPhotoFiles} />
          </div>
          <div>
            <h4 className="font-medium mb-3 text-sm text-gray-700">Video</h4>
            <FileUpload<File | null> type="video" files={videoFile} setFiles={setVideoFile} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}