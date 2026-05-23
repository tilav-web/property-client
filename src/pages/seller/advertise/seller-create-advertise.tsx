import React, { useEffect, useMemo, useState } from "react";
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
import { toast } from "sonner";
import {
  Calendar,
  CreditCard,
  ExternalLink,
  Image as ImageIcon,
  ImagePlus,
  Loader2,
  PanelLeft,
  PanelTop,
  Receipt,
  Rocket,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AdvertiseType } from "@/interfaces/advertise/advertise.interface";
import BannerTypeTab from "./_components/tabs/banner-type-tab";
import AsideTypeTab from "./_components/tabs/aside-type-tab";
import ImageTypeTab from "./_components/tabs/image-type-tab";
import { advertiseService } from "@/services/advertise.service";

interface TypeOption {
  key: AdvertiseType;
  title: string;
  description: string;
  icon: typeof PanelTop;
  recommendedSize: string;
  placement: string;
  responsive: string;
  gradient: string;
}

const TYPE_OPTIONS: TypeOption[] = [
  {
    key: "aside",
    title: "Yon reklama",
    description: "Sahifaning yon panelida vertikal joylashadi",
    icon: PanelLeft,
    recommendedSize: "395 × auto px",
    placement: "Bosh sahifa va qidiruv yon paneli",
    responsive: "Faqat desktop (mobile'da yashirin)",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    key: "banner",
    title: "Banner",
    description: "Sahifa kengligi bo'ylab gorizontal banner",
    icon: PanelTop,
    recommendedSize: "Kenglik 100% × 302 px",
    placement: "Bosh sahifa va qidiruv natijasi tepasida",
    responsive: "Barcha qurilmalarda ko'rinadi",
    gradient: "from-rose-500 to-orange-500",
  },
  {
    key: "image",
    title: "Rasm reklama",
    description: "Kontent ichida grid hujayrasi",
    icon: ImageIcon,
    recommendedSize: "Kvadrat yoki 16:9 (kontent shaklida)",
    placement: "Qidiruv natijalari grid'i ichida",
    responsive: "Barcha qurilmalarda",
    gradient: "from-emerald-500 to-teal-500",
  },
];

const QUICK_DAYS = [1, 7, 14, 30];

export default function SellerCreateAdvertise() {
  const [adType, setAdType] = useState<AdvertiseType>("aside");
  const [targetUrl, setTargetUrl] = useState("");
  const [days, setDays] = useState<string>("7");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [priceCalculus, setPriceCalculus] = useState<{
    days: number;
    totalPrice: number;
    currency: string;
    pricePerDay?: number;
  }>();
  const [paymentPending, setPaymentPending] = useState<{
    url: string;
    amount: number;
    currency: string;
  } | null>(null);

  const activeType = useMemo(
    () => TYPE_OPTIONS.find((t) => t.key === adType) ?? TYPE_OPTIONS[0],
    [adType],
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Rasm hajmi 5 MB dan oshmasligi kerak");
      return;
    }
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const synthetic = {
        target: { files: [file] },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleImageChange(synthetic);
    }
  };

  const validate = (): string | null => {
    if (!selectedImage) return "Iltimos, reklama rasmini yuklang";
    if (!targetUrl.trim()) return "Iltimos, havolani kiriting";
    const daysNum = parseInt(days, 10);
    if (!daysNum || daysNum < 1) return "Reklama muddati 1 kundan kam bo'lmasin";
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("target", targetUrl);
      formData.append("type", adType);
      formData.append("days", days);
      formData.append("image", selectedImage!);

      const data = await advertiseService.create(formData);
      setTargetUrl("");
      setDays("7");
      setSelectedImage(null);
      setImagePreview("");

      if (data.checkoutUrl) {
        toast.success("Reklama yaratildi", {
          description: "To'lov sahifasiga yo'naltirilyapsiz...",
        });
        window.open(data.checkoutUrl, "_blank", "noopener,noreferrer");
        setPaymentPending({
          url: data.checkoutUrl,
          amount: priceCalculus?.totalPrice ?? 0,
          currency: priceCalculus?.currency ?? "",
        });
      } else {
        toast.success("Reklama yaratildi", {
          description: "Admin tasdiqlashini kuting",
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const n = parseInt(days, 10);
        if (n > 0) {
          const data = await advertiseService.priceCalculus(String(n));
          setPriceCalculus({
            ...data,
            pricePerDay: data.totalPrice / Math.max(n, 1),
          });
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, [days]);

  const formattedPrice = priceCalculus?.totalPrice?.toLocaleString() ?? "0";
  const formattedPerDay =
    priceCalculus?.pricePerDay?.toLocaleString(undefined, {
      maximumFractionDigits: 0,
    }) ?? "0";

  return (
    <div className="container mx-auto px-4 py-6 pb-24 sm:px-6 lg:pb-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex size-12 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <Rocket className="size-6" />
          </div>
          <div>
            <h1 className="font-display text-2xl text-foreground sm:text-3xl">
              Reklama joylash
            </h1>
            <p className="text-sm text-muted-foreground">
              Sayt bo'ylab ko'rinadigan banner reklamangizni 3 qadamda joylang
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="w-fit">
          <Sparkles className="mr-1 size-3" />
          Yangi
        </Badge>
      </div>

      {/* Payment pending banner */}
      {paymentPending && (
        <div className="mb-6 flex items-start gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-full bg-amber-500 text-white">
            <CreditCard className="size-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-amber-900">To'lov kutilmoqda</h3>
            <p className="mt-1 text-sm text-amber-800">
              Faollashishi uchun{" "}
              <strong>
                {paymentPending.amount.toLocaleString()} {paymentPending.currency}
              </strong>{" "}
              to'lash kerak. Yangi tab ochilgan bo'lishi kerak — agar yopib
              qo'ygan bo'lsangiz qaytadan bosing.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                onClick={() =>
                  window.open(
                    paymentPending.url,
                    "_blank",
                    "noopener,noreferrer",
                  )
                }
                className="bg-amber-600 hover:bg-amber-700"
              >
                <CreditCard className="mr-2 size-4" />
                Payme'ga o'tish
              </Button>
              <Button
                variant="outline"
                onClick={() => setPaymentPending(null)}
              >
                Yopish
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        {/* Left: Form */}
        <div className="space-y-6">
          {/* Step 1: Type */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  1
                </span>
                Reklama turini tanlang
              </CardTitle>
              <CardDescription>
                Har bir tur saytning turli joylarida ko'rinadi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {TYPE_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const active = adType === opt.key;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setAdType(opt.key)}
                      className={cn(
                        "relative overflow-hidden rounded-2xl border-2 p-4 text-left transition-all",
                        active
                          ? "border-primary shadow-md"
                          : "border-border hover:border-primary/40",
                      )}
                    >
                      <div
                        className={cn(
                          "absolute inset-0 opacity-10 bg-gradient-to-br",
                          opt.gradient,
                        )}
                      />
                      <div className="relative">
                        <div
                          className={cn(
                            "mb-3 flex size-10 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm",
                            opt.gradient,
                          )}
                        >
                          <Icon className="size-5" />
                        </div>
                        <h3 className="text-sm font-semibold text-foreground">
                          {opt.title}
                        </h3>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {opt.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Type info row */}
              <div className="mt-4 grid grid-cols-1 gap-3 rounded-xl bg-accent/40 p-3 text-xs sm:grid-cols-3">
                <div>
                  <span className="font-semibold text-foreground">📐 O'lcham:</span>
                  <p className="text-muted-foreground">{activeType.recommendedSize}</p>
                </div>
                <div>
                  <span className="font-semibold text-foreground">📍 Joylashuv:</span>
                  <p className="text-muted-foreground">{activeType.placement}</p>
                </div>
                <div>
                  <span className="font-semibold text-foreground">📱 Qurilmalar:</span>
                  <p className="text-muted-foreground">{activeType.responsive}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 2: Image upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  2
                </span>
                Reklama rasmini yuklang
              </CardTitle>
              <CardDescription>
                Tavsiya: {activeType.recommendedSize} • PNG/JPG/WEBP • max 5 MB
              </CardDescription>
            </CardHeader>
            <CardContent>
              <label
                htmlFor="adImage"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className={cn(
                  "block cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed transition-all",
                  imagePreview
                    ? "border-emerald-300 bg-emerald-50/50"
                    : "border-border hover:border-primary/40 hover:bg-accent/30",
                )}
              >
                <input
                  type="file"
                  id="adImage"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Reklama preview"
                      className="max-h-72 w-full object-contain"
                    />
                    <div className="flex items-center justify-between border-t border-emerald-200 bg-emerald-50 px-4 py-2 text-xs">
                      <span className="font-medium text-emerald-800">
                        ✓ Rasm yuklandi
                      </span>
                      <span className="text-emerald-700">
                        Yangilash uchun bosing yoki tashlang
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-3 px-6 py-10 text-center">
                    <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <ImagePlus className="size-7" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        Rasmni bu yerga tashlang yoki bosing
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        PNG, JPG, WEBP • {activeType.recommendedSize}
                      </p>
                    </div>
                  </div>
                )}
              </label>
            </CardContent>
          </Card>

          {/* Step 3: URL + days */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  3
                </span>
                Havola va muddat
              </CardTitle>
              <CardDescription>
                Reklama bosilganda qaerga olib borishi va qancha kun
                ko'rsatilishi
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="targetUrl" className="text-sm">
                  Havola (URL)
                </Label>
                <div className="relative">
                  <ExternalLink className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="targetUrl"
                    type="text"
                    placeholder="https://uybos.uz/property/... yoki /search?city=..."
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    className="pl-9"
                  />
                  {targetUrl && (
                    <button
                      type="button"
                      onClick={() => setTargetUrl("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground hover:bg-accent"
                      aria-label="Tozalash"
                    >
                      <X className="size-3.5" />
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Tashqi link (https://) yoki ichki sayt yo'li (/property/...)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="days" className="flex items-center gap-1 text-sm">
                  <Calendar className="size-3.5" />
                  Reklama muddati (kun)
                </Label>
                <div className="flex flex-wrap gap-2">
                  {QUICK_DAYS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDays(String(d))}
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
                        Number(days) === d
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-foreground hover:border-primary/40",
                      )}
                    >
                      {d} kun
                    </button>
                  ))}
                </div>
                <Input
                  id="days"
                  type="number"
                  min={1}
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Live preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-2 text-base">
                <span className="flex items-center gap-2">
                  <Sparkles className="size-4 text-primary" />
                  Live preview
                </span>
                <Badge variant="secondary" className="capitalize">
                  {activeType.title}
                </Badge>
              </CardTitle>
              <CardDescription>
                Reklamangiz saytda quyidagi kabi ko'rinadi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border bg-muted/30 p-3">
                {adType === "aside" && (
                  <AsideTypeTab target={targetUrl} image={imagePreview} />
                )}
                {adType === "banner" && (
                  <BannerTypeTab image={imagePreview} target={targetUrl} />
                )}
                {adType === "image" && (
                  <ImageTypeTab target={targetUrl} image={imagePreview} />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Sticky summary (desktop) */}
        <div className="hidden lg:block">
          <div className="sticky top-24 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Receipt className="size-4" />
                  Hisob-kitob
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Tur:</span>
                  <span className="font-semibold text-foreground">
                    {activeType.title}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Kun:</span>
                  <span className="font-semibold text-foreground">
                    {days || 0}
                  </span>
                </div>
                {priceCalculus?.pricePerDay !== undefined && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Kunlik narx:</span>
                    <span className="font-semibold text-foreground">
                      {formattedPerDay} {priceCalculus.currency}
                    </span>
                  </div>
                )}
                <div className="border-t pt-3">
                  <div className="flex items-end justify-between">
                    <span className="text-sm text-muted-foreground">
                      Jami to'lov:
                    </span>
                    <div className="text-right">
                      <p className="font-display text-2xl font-bold text-primary">
                        {formattedPrice}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {priceCalculus?.currency}
                      </p>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Joylanmoqda...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 size-4" />
                      Reklamani joylash
                    </>
                  )}
                </Button>
                <p className="text-center text-[10px] text-muted-foreground">
                  Joylashtirgach Payme orqali to'laysiz. Admin tasdiqlagach
                  reklama saytda paydo bo'ladi.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Mobile sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-card p-3 shadow-lg lg:hidden">
        <div className="container mx-auto flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
              Jami:
            </p>
            <p className="font-bold text-primary">
              {formattedPrice} {priceCalculus?.currency}
            </p>
          </div>
          <Button onClick={handleSubmit} disabled={isLoading} size="lg">
            {isLoading ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Send className="mr-2 size-4" />
            )}
            Joylash
          </Button>
        </div>
      </div>
    </div>
  );
}
