import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { IAdvertise, AdvertiseType } from "@/interfaces/advertise/advertise.interface";
import BannerTypeTab from "./_components/tabs/banner-type-tab";
import AsideTypeTab from "./_components/tabs/aside-type-tab";
import ImageTypeTab from "./_components/tabs/image-type-tab";
import { toast } from "sonner";
import { advertiseService } from "@/services/advertise.service";
import { useNavigate, useParams } from "react-router-dom";
import { Trash2 } from "lucide-react";

export default function SellerEditAdvertise() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Initial data
  const [initialData, setInitialData] = useState<IAdvertise | null>(null);

  // Form state
  const [adType, setAdType] = useState<"aside" | "banner" | "image">("aside");
  const [targetUrl, setTargetUrl] = useState("");
  const [days, setDays] = useState<string>("1");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isImageMarkedForDeletion, setIsImageMarkedForDeletion] = useState(false);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [priceCalculus, setPriceCalculus] = useState<{
    days: number;
    totalPrice: number;
    currency: string;
  }>();

  useEffect(() => {
    if (id) {
      (async () => {
        try {
          setIsLoading(true);
          const data = await advertiseService.findOne(id);
          setInitialData(data);
          setAdType(data.type);
          setTargetUrl(data.target);
          setDays(String(data.days));
          if (data.image) {
            setImagePreview(data.image);
          }
        } catch (error) {
          console.error(error);
          toast.error("Xatolik", {
            description: "Reklama ma'lumotlarini yuklashda xatolik yuz berdi",
          });
          navigate("/seller/advertise");
        } finally {
          setIsLoading(false);
        }
      })();
    }
  }, [id, navigate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setIsImageMarkedForDeletion(false); // Unmark for deletion if a new image is selected
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageDelete = () => {
    setSelectedImage(null);
    setImagePreview("");
    setIsImageMarkedForDeletion(true);
    toast.info("Rasm o'chirishga belgilandi. O'zgarishlarni saqlashni unutmang.");
  };

  const handleSubmit = async () => {
    if (!targetUrl || !days) {
      toast.error("Xatolik", {
        description: "Iltimos, barcha majburiy maydonlarni to'ldiring",
      });
      return;
    }

    if (!id || !initialData) return;

    setIsLoading(true);

    try {
      const formData = new FormData();
      let hasChanges = false;

      // Append changed fields
      if (targetUrl !== initialData.target) {
        formData.append("target", targetUrl);
        hasChanges = true;
      }
      if (adType !== initialData.type) {
        formData.append("type", adType);
        hasChanges = true;
      }
      if (days !== String(initialData.days)) {
        formData.append("days", days);
        hasChanges = true;
      }
      if (selectedImage) {
        formData.append("image", selectedImage);
        hasChanges = true;
      }
      if (isImageMarkedForDeletion) {
        formData.append("image_to_delete", "true");
        hasChanges = true;
      }

      if (!hasChanges) {
        toast.info("Hech qanday o'zgarish qilinmadi");
        return;
      }

      await advertiseService.update(id, formData);
      toast.success("Muvaffaqiyatli", {
        description: "Reklama muvaffaqiyatli yangilandi!",
      });
      navigate("/seller/advertise");

    } catch (error) {
      console.error(error);
      toast.error("Xatolik", {
        description: "Reklamani yangilashda xatolik yuz berdi",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (days) {
      advertiseService.priceCalculus(days)
        .then(setPriceCalculus)
        .catch(console.error);
    }
  }, [days]);

  if (!initialData && isLoading) {
      return <div className="container mx-auto p-6 w-full">Yuklanmoqda...</div>
  }

  return (
    <div className="container mx-auto p-6 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reklamani Tahrirlash</h1>
        <p className="text-gray-600 mt-2">
          Reklama ma'lumotlarini o'zgartiring. Pastda reklamangiz qanday
          ko'rinishini ko'rasiz.
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Reklama Ma'lumotlari</CardTitle>
          <CardDescription>
            Ma'lumotlarni to'ldiring - reklama turini pastdan tanlang
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="adImage" className="text-sm">
                Reklama Rasmi
              </Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center transition-colors hover:border-gray-400 relative">
                <input
                  type="file"
                  id="adImage"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label htmlFor="adImage" className="cursor-pointer block">
                  {imagePreview ? (
                    <div className="space-y-2">
                      <img
                        src={imagePreview}
                        alt="Tanlangan rasm"
                        className="mx-auto h-24 object-cover rounded shadow-sm"
                      />
                      <div>
                        <p className="text-green-600 font-medium text-sm">
                          {selectedImage ? "Yangi rasm yuklandi" : "Mavjud rasm"}
                        </p>
                        <p className="text-xs text-gray-500">
                          O'zgartirish uchun rasm ustiga bosing
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <i className="fas fa-cloud-upload-alt text-3xl text-gray-400"></i>
                      <div>
                        <p className="text-gray-600 font-medium text-sm">
                          Rasm yuklash
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, WEBP</p>
                      </div>
                    </div>
                  )}
                </label>
                {imagePreview && !selectedImage && (
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-7 w-7"
                    onClick={handleImageDelete}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetUrl" className="text-sm">
                Havola (URL) *
              </Label>
              <Input
                id="targetUrl"
                type="text"
                placeholder="/products/123 yoki https://..."
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                className="h-9 text-sm"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fromDate" className="text-sm">
                Qancha muddat (kun) *
              </Label>
              <Input
                id="days"
                type="number"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                className="h-9 text-sm"
                required
              />
            </div>
            {priceCalculus?.days &&
              priceCalculus?.totalPrice &&
              priceCalculus?.currency && (
                <div className="text-sm opacity-80">
                  {priceCalculus?.days} kun uchun{" "}
                  {priceCalculus?.totalPrice.toLocaleString()}{" "}
                  {priceCalculus?.currency}
                </div>
              )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Reklama Ko'rinishi</span>
            <Badge variant="secondary" className="capitalize">
              {adType} turi
            </Badge>
          </CardTitle>
          <CardDescription>
            Reklama turini tanlang va sizning reklamangiz qanday ko'rinishini
            ko'ring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Tabs
              value={adType}
              onValueChange={(value) => setAdType(value as AdvertiseType)}
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="aside" className="flex items-center gap-2">
                  <i className="fas fa-columns"></i>
                  <span>Yon Reklama</span>
                </TabsTrigger>
                <TabsTrigger value="banner" className="flex items-center gap-2">
                  <i className="fas fa-image"></i>
                  <span>Banner</span>
                </TabsTrigger>
                <TabsTrigger value="image" className="flex items-center gap-2">
                  <i className="fas fa-photo"></i>
                  <span>Rasm</span>
                </TabsTrigger>
              </TabsList>
              <AsideTypeTab target={targetUrl} image={imagePreview} />
              <BannerTypeTab image={imagePreview} target={targetUrl} />
              <ImageTypeTab target={targetUrl} image={imagePreview} />
            </Tabs>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <i className="fas fa-expand-arrows-alt text-blue-500 text-lg mb-2"></i>
                <p className="font-medium">O'lcham</p>
                <p className="text-gray-600">
                  {adType === "aside" && "395xAuto (kenglik)"}
                  {adType === "banner" && "100%x302px (kenglik x balandlik)"}
                  {adType === "image" && "Adaptiv o'lcham (konteynerga moslashadi)"}
                </p>
              </div>

              <div className="text-center p-4 bg-green-50 rounded-lg">
                <i className="fas fa-mouse-pointer text-green-500 text-lg mb-2"></i>
                <p className="font-medium">Harakat</p>
                <p className="text-gray-600">
                  {adType === "aside" && "Yon panelda joylashadi"}
                  {adType === "banner" && "Sahifa yuqorisida"}
                  {adType === "image" && "Kontent ichida, hover effekti"}
                </p>
              </div>

              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <i className="fas fa-mobile-alt text-purple-500 text-lg mb-2"></i>
                <p className="font-medium">Responsive</p>
                <p className="text-gray-600">
                  {adType === "aside" && "Mobilda ko'rinmaydi"}
                  {adType === "banner" && "Barcha qurilmalarda"}
                  {adType === "image" && "Barcha qurilmalarda"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Button
        onClick={handleSubmit}
        className="w-full h-9 text-sm mt-4"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <i className="fas fa-spinner fa-spin mr-2 text-xs"></i>
            Yangilanmoqda...
          </>
        ) : (
          <>
            <i className="fas fa-save mr-2 text-xs"></i>
            O'zgarishlarni Saqlash
          </>
        )}
      </Button>
    </div>
  );
}
