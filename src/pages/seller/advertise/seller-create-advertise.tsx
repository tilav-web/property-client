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
import type { AdvertiseType } from "@/interfaces/advertise/advertise.interface";
import BannerTypeTab from "./_components/tabs/banner-type-tab";
import AsideTypeTab from "./_components/tabs/aside-type-tab";
import ImageTypeTab from "./_components/tabs/image-type-tab";
import { toast } from "sonner";
import { advertiseService } from "@/services/advertise.service";

export default function SellerCreateAdvertise() {
  const [adType, setAdType] = useState<"aside" | "banner" | "image">("aside");
  const [targetUrl, setTargetUrl] = useState("");
  const [days, setDays] = useState<string>("1");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [priceCalculus, setPriceCalculus] = useState<{
    days: number;
    totalPrice: number;
    currency: string;
  }>();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage) {
      toast.error("Xatolik", {
        description: "Iltimos, reklama rasmini yuklang",
      });
      return;
    }

    if (!targetUrl) {
      toast.error("Xatolik", {
        description: "Iltimos, havolani kiriting",
      });
      return;
    }

    if (!days) {
      toast.error("Xatolik", {
        description: "Iltimos, reklama muddatini kiriting",
      });
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("target", targetUrl);
      formData.append("type", adType);
      formData.append("days", days);
      formData.append("image", selectedImage);

      const data = await advertiseService.create(formData);
      console.log(data);
      toast.success("Muvaffaqiyatli", {
        description: "Reklama muvaffaqiyatli yaratildi!",
      });
      setTargetUrl("");
      setDays("1");
      setSelectedImage(null);
      setImagePreview("");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        if (days) {
          const data = await advertiseService.priceCalculus(days);
          setPriceCalculus(data);
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, [days]);

  return (
    <div className="container mx-auto p-6 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reklama Yaratish</h1>
        <p className="text-gray-600 mt-2">
          Reklama turini tanlang va ma'lumotlarni to'ldiring. Pastda reklamangiz
          qanday ko'rinishini ko'rasiz.
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
                Reklama Rasmı *
              </Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center transition-colors hover:border-gray-400">
                <input
                  type="file"
                  id="adImage"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  required
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
                          Rasm yuklandi
                        </p>
                        <p className="text-xs text-gray-500">
                          Yangilash uchun yana bosing
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
                defaultValue={1}
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
              defaultValue="aside"
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
                  {adType === "aside" && "395px kenglik"}
                  {adType === "banner" && "To'liq kenglik, 302px balandlik"}
                  {adType === "image" && "Adaptiv o'lcham"}
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
        className="w-full h-9 text-sm"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <i className="fas fa-spinner fa-spin mr-2 text-xs"></i>
            Joylanmoqda...
          </>
        ) : (
          <>
            <i className="fas fa-paper-plane mr-2 text-xs"></i>
            Reklamani Joylash
          </>
        )}
      </Button>
    </div>
  );
}
