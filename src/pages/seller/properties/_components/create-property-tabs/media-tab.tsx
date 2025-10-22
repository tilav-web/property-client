import { useTranslation } from "react-i18next";
import { useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, ImageIcon, FileText } from "lucide-react";
import { useCreatePropertyStore } from "@/stores/create-property.store";

interface FileUploadProps<T extends File | File[] | null> {
  type: "contract_file" | "photos" | "video";
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

  // Fayl turi bo'yicha accept va icon aniqlash
  const getFileConfig = () => {
    switch (type) {
      case "contract_file":
        return {
          accept: ".pdf",
          icon: <FileText className="mx-auto h-8 w-8 text-gray-400" />,
        };
      case "video":
        return {
          accept: "video/*",
          icon: <Upload className="mx-auto h-12 w-12 text-gray-400" />,
        };
      case "photos":
        return {
          accept: "image/*",
          icon: <ImageIcon className="mx-auto h-8 w-8 text-gray-400" />,
        };
      default:
        return {
          accept: "*/*",
          icon: <Upload className="mx-auto h-12 w-12 text-gray-400" />,
        };
    }
  };

  const fileConfig = getFileConfig();

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newFiles = Array.from(e.target.files || []);
      
      // PDF fayl tekshiruvi
      if (type === "contract_file" && newFiles.length > 0) {
        const file = newFiles[0];
        if (file.type !== "application/pdf") {
          alert(t("pages.create_property.media_tab.only_pdf_allowed"));
          return;
        }
      }

      if (isMultiple) {
        const currentFiles = Array.isArray(files) ? files : [];
        const updated = [...currentFiles, ...newFiles].slice(0, maxFiles);
        setFiles(updated as T);
      } else {
        setFiles((newFiles[0] || null) as T);
      }
    },
    [isMultiple, maxFiles, files, setFiles, type, t]
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

  // Fayl nomini qisqartirish
  const getFileName = (file: File) => {
    if (file.name.length > 20) {
      return `${file.name.substring(0, 10)}...${file.name.substring(file.name.length - 7)}`;
    }
    return file.name;
  };

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
                  ) : type === "contract_file" ? (
                    <div className="flex flex-col items-center justify-center w-full h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 p-4">
                      <FileText className="h-16 w-16 text-blue-500 mb-2" />
                      <p className="text-sm font-medium text-gray-900 text-center">
                        {getFileName(files as File)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PDF {(files as File).size > 1024 ? `${Math.round((files as File).size / 1024)} KB` : `${(files as File).size} bytes`}
                      </p>
                    </div>
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
                      type === "video" 
                        ? "bg-green-500" 
                        : type === "contract_file"
                        ? "bg-purple-500"
                        : "bg-blue-500"
                    }`}
                  >
                    {type === "video"
                      ? t("pages.create_property.media_tab.video")
                      : type === "contract_file"
                      ? t("pages.create_property.media_tab.contract_file")
                      : t("pages.create_property.media_tab.banner_image")}
                  </Badge>
                </div>
              )}
        </div>
      ) : (
        <div className="text-center">
          {fileConfig.icon}
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-900">
              {type === "photos"
                ? t("pages.create_property.media_tab.images")
                : type === "video"
                ? t("pages.create_property.media_tab.video")
                : t("pages.create_property.media_tab.contract_file")}
            </p>
            <p className="text-sm text-gray-500">
              {isMultiple
                ? t("pages.create_property.media_tab.images", { count: 5 })
                : type === "contract_file"
                ? t("pages.create_property.media_tab.only_pdf")
                : t("common.optional")}
            </p>
          </div>
          <Input
            type="file"
            accept={fileConfig.accept}
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
              : type === "contract_file"
              ? t("pages.create_property.media_tab.choose_pdf")
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
            {t("pages.create_property.media_tab.contract_file")}
          </h4>
          <FileUpload<File | null>
            type="contract_file"
            files={data?.contract_file || null}
            setFiles={(file) => updateData({ contract_file: file })}
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
            <h4 className="font-medium mb-3 text-sm text-gray-700">
              {t("pages.create_property.media_tab.video")}
            </h4>
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