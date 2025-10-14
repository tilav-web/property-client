import { useTranslation } from "react-i18next";
import { useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, ImageIcon } from "lucide-react";
import { useCreatePropertyStore } from "@/stores/create-property.store";

interface FileUploadProps<T extends File | File[] | null> {
  type: "banner" | "photos" | "video";
  maxFiles?: number;
  files: T;
  setFiles: (files: T) => void;
}

const FileUpload = <T extends File | File[] | null>({
  type,
  maxFiles = 1,
  files,
  setFiles,
}: FileUploadProps<T>) => {
  const { t } = useTranslation();
  const isMultiple = type === "photos";
  const inputId = `${type}-upload`;

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newFiles = Array.from(e.target.files || []);
      if (isMultiple) {
        const currentFiles = Array.isArray(files) ? files : [];
        const updated = [...currentFiles, ...newFiles].slice(0, maxFiles);
        setFiles(updated as T);
      } else {
        setFiles((newFiles[0] || null) as T);
      }
    },
    [isMultiple, maxFiles, files, setFiles]
  );

  const handleRemove = useCallback(
    (index?: number) => {
      if (isMultiple && index !== undefined) {
        const currentFiles = Array.isArray(files) ? files : [];
        const updated = currentFiles.filter((_, i) => i !== index);
        setFiles(updated as T);
      } else {
        setFiles(null as T);
      }
    },
    [isMultiple, files, setFiles]
  );

  const handleButtonClick = useCallback(() => {
    const input = document.getElementById(inputId) as HTMLInputElement;
    input?.click();
  }, [inputId]);

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
      {files &&
      (isMultiple ? Array.isArray(files) && files.length > 0 : files) ? (
        <div
          className={
            isMultiple ? "grid grid-cols-2 md:grid-cols-3 gap-4" : "relative"
          }
        >
          {isMultiple && Array.isArray(files)
            ? files.map((file, index) => (
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
            : files && (
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
                    className={`absolute top-2 left-2 ${
                      type === "video" ? "bg-green-500" : "bg-blue-500"
                    }`}
                  >
                    {type === "video" ? t("pages.create_property.media_tab.video") : t("pages.create_property.media_tab.banner_image")}
                  </Badge>
                </div>
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
                ? t("pages.create_property.media_tab.images")
                : type === "video"
                ? t("pages.create_property.media_tab.video")
                : t("pages.create_property.media_tab.banner_image")}
            </p>
            <p className="text-sm text-gray-500">
              {isMultiple ? t("pages.create_property.media_tab.images", { count: 5 }) : t("common.optional")}
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
              ? `${t("pages.create_property.media_tab.add_images")} (${
                  Array.isArray(files) ? files.length : 0
                }/5)`
              : `${t("pages.create_property.media_tab.choose_file")}...`}
          </Button>
        </div>
      )}
    </div>
  );
};

export default function MediaTab() {
  const { t } = useTranslation();
  const { data, updateData } = useCreatePropertyStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          {t("pages.create_property.media_tab.media_files")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-medium mb-3 text-sm text-gray-700">
            {t("pages.create_property.media_tab.banner_image")}
          </h4>
          <FileUpload<File | null>
            type="banner"
            files={data?.banner || null}
            setFiles={(file) => updateData({ banner: file })}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-3 text-sm text-gray-700">
              {t("pages.create_property.media_tab.images")}
            </h4>
            <FileUpload<File[]>
              type="photos"
              maxFiles={5}
              files={data?.photos || []}
              setFiles={(files) => updateData({ photos: files })}
            />
          </div>
          <div>
            <h4 className="font-medium mb-3 text-sm text-gray-700">{t("pages.create_property.media_tab.video")}</h4>
            <FileUpload<File | null>
              type="video"
              files={data?.video || null}
              setFiles={(file) => updateData({ video: file })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
