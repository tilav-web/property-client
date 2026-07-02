import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Bot, Crown, Loader2, MapPin, Phone, Plus, Settings, Smartphone, Trash2, Upload, X } from "lucide-react";
import {
  adminSiteSettingsService,
  type HeroSlot,
  type ISiteSettings,
} from "../../_services/admin-site-settings.service";

interface SlotConfig {
  slot: HeroSlot;
  label: string;
  description: string;
  imageField: keyof ISiteSettings;
  srcsetField: keyof ISiteSettings;
  formField: string;
  srcsetFormField: string;
}

const SLOTS: SlotConfig[] = [
  {
    slot: "main",
    label: "Bosh sahifa hero",
    description: "Bosh sahifa yuqorisidagi katta rasm",
    imageField: "hero_image",
    srcsetField: "hero_image_srcset",
    formField: "hero_image",
    srcsetFormField: "hero_image_srcset",
  },
  {
    slot: "buy",
    label: "Sotuv (Buy) sahifa hero",
    description: "Sotuv sahifasi yuqorisidagi rasm",
    imageField: "hero_image_buy",
    srcsetField: "hero_image_buy_srcset",
    formField: "hero_image_buy",
    srcsetFormField: "hero_image_buy_srcset",
  },
  {
    slot: "rent",
    label: "Ijara (Rent) sahifa hero",
    description: "Ijara sahifasi yuqorisidagi rasm",
    imageField: "hero_image_rent",
    srcsetField: "hero_image_rent_srcset",
    formField: "hero_image_rent",
    srcsetFormField: "hero_image_rent_srcset",
  },
];

export default function AdminSiteSettingsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-site-settings"],
    // Admin GET — telegram bot token ham keladi (public GET'da yashirilgan)
    queryFn: () => adminSiteSettingsService.getForAdmin(),
  });

  const [titleOverride, setTitleOverride] = useState("");
  const [subtitleOverride, setSubtitleOverride] = useState("");
  const [voiceDailyLimit, setVoiceDailyLimit] = useState<string>("");
  const [freePropertyLimit, setFreePropertyLimit] = useState<string>("");
  const [premiumPrice, setPremiumPrice] = useState<string>("");
  const [premiumDays, setPremiumDays] = useState<string>("");
  const [premiumPropertyDiscount, setPremiumPropertyDiscount] =
    useState<string>("");
  const [contactPhones, setContactPhones] = useState<string[]>([""]);
  const [defaultMapLat, setDefaultMapLat] = useState<string>("");
  const [defaultMapLng, setDefaultMapLng] = useState<string>("");
  const [appStoreUrl, setAppStoreUrl] = useState("");
  const [playStoreUrl, setPlayStoreUrl] = useState("");
  const [qrCodeFile, setQrCodeFile] = useState<File | null>(null);
  const [qrCodePreview, setQrCodePreview] = useState<string | null>(null);
  // Payme fiskal (Cheklar soliq oborotida ko'rinishi uchun)
  const [premiumMxik, setPremiumMxik] = useState<string>("");
  const [premiumPackageCode, setPremiumPackageCode] = useState<string>("");
  const [propertyPremiumMxik, setPropertyPremiumMxik] = useState<string>("");
  const [propertyPremiumPackageCode, setPropertyPremiumPackageCode] =
    useState<string>("");
  const [advertiseMxik, setAdvertiseMxik] = useState<string>("");
  const [advertisePackageCode, setAdvertisePackageCode] = useState<string>("");
  const [vatPercent, setVatPercent] = useState<string>("");
  // Telegram admin bot
  const [telegramBotToken, setTelegramBotToken] = useState<string>("");
  const [telegramChatIds, setTelegramChatIds] = useState<string[]>([""]);
  const [srcsets, setSrcsets] = useState<Record<HeroSlot, string>>({
    main: "",
    buy: "",
    rent: "",
  });
  const [files, setFiles] = useState<Record<HeroSlot, File | null>>({
    main: null,
    buy: null,
    rent: null,
  });
  const [previews, setPreviews] = useState<Record<HeroSlot, string | null>>({
    main: null,
    buy: null,
    rent: null,
  });

  useEffect(() => {
    if (data) {
      setTitleOverride(data.hero_title_override ?? "");
      setSubtitleOverride(data.hero_subtitle_override ?? "");
      setSrcsets({
        main: data.hero_image_srcset ?? "",
        buy: data.hero_image_buy_srcset ?? "",
        rent: data.hero_image_rent_srcset ?? "",
      });
      setVoiceDailyLimit(String(data.voice_daily_free_limit ?? ""));
      setFreePropertyLimit(String(data.free_property_limit ?? ""));
      setPremiumPrice(
        String(data.premium_price ?? data.voice_premium_price ?? ""),
      );
      setPremiumDays(
        String(
          data.premium_duration_days ?? data.voice_premium_duration_days ?? "",
        ),
      );
      setPremiumPropertyDiscount(
        String(data.premium_property_discount_percent ?? ""),
      );
      setContactPhones(data.contact_phones?.length ? data.contact_phones : [""]);
      setDefaultMapLat(String(data.default_map_lat ?? "38.8447459"));
      setDefaultMapLng(String(data.default_map_lng ?? "65.780332"));
      setAppStoreUrl(data.app_store_url ?? "");
      setPlayStoreUrl(data.play_store_url ?? "");
      setPremiumMxik(data.premium_mxik ?? "");
      setPremiumPackageCode(data.premium_package_code ?? "");
      setPropertyPremiumMxik(data.property_premium_mxik ?? "");
      setPropertyPremiumPackageCode(data.property_premium_package_code ?? "");
      setAdvertiseMxik(data.advertise_mxik ?? "");
      setAdvertisePackageCode(data.advertise_package_code ?? "");
      setVatPercent(String(data.vat_percent ?? ""));
      setTelegramBotToken(data.telegram_bot_token ?? "");
      setTelegramChatIds(
        data.telegram_admin_chat_ids?.length
          ? data.telegram_admin_chat_ids
          : [""],
      );
    }
  }, [data]);

  useEffect(() => {
    if (!qrCodeFile) {
      setQrCodePreview(null);
      return;
    }
    const url = URL.createObjectURL(qrCodeFile);
    setQrCodePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [qrCodeFile]);

  useEffect(() => {
    const urls: Record<HeroSlot, string | null> = {
      main: null,
      buy: null,
      rent: null,
    };
    const cleanups: string[] = [];
    for (const slot of ["main", "buy", "rent"] as HeroSlot[]) {
      const f = files[slot];
      if (f) {
        const url = URL.createObjectURL(f);
        urls[slot] = url;
        cleanups.push(url);
      }
    }
    setPreviews(urls);
    return () => {
      cleanups.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [files]);

  const updateMutation = useMutation({
    mutationFn: (formData: FormData) =>
      adminSiteSettingsService.update(formData),
    onSuccess: () => {
      toast.success("Sozlamalar saqlandi");
      setFiles({ main: null, buy: null, rent: null });
      queryClient.invalidateQueries({ queryKey: ["admin-site-settings"] });
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
    },
    onError: () => toast.error("Saqlashda xatolik"),
  });

  const clearMutation = useMutation({
    mutationFn: (slot: HeroSlot) => adminSiteSettingsService.clearHero(slot),
    onSuccess: () => {
      toast.success("Hero rasmi tozalandi");
      queryClient.invalidateQueries({ queryKey: ["admin-site-settings"] });
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("hero_title_override", titleOverride);
    formData.append("hero_subtitle_override", subtitleOverride);
    for (const cfg of SLOTS) {
      formData.append(cfg.srcsetFormField, srcsets[cfg.slot]);
      const f = files[cfg.slot];
      if (f) formData.append(cfg.formField, f);
    }
    if (voiceDailyLimit.trim()) {
      formData.append("voice_daily_free_limit", voiceDailyLimit.trim());
    }
    if (freePropertyLimit.trim()) {
      formData.append("free_property_limit", freePropertyLimit.trim());
    }
    if (premiumPrice.trim()) {
      formData.append("premium_price", premiumPrice.trim());
    }
    if (premiumDays.trim()) {
      formData.append("premium_duration_days", premiumDays.trim());
    }
    if (premiumPropertyDiscount.trim()) {
      formData.append(
        "premium_property_discount_percent",
        premiumPropertyDiscount.trim(),
      );
    }
    const validPhones = contactPhones.filter((p) => p.trim());
    formData.append("contact_phones", JSON.stringify(validPhones));
    if (defaultMapLat.trim()) formData.append("default_map_lat", defaultMapLat.trim());
    if (defaultMapLng.trim()) formData.append("default_map_lng", defaultMapLng.trim());
    formData.append("app_store_url", appStoreUrl.trim());
    formData.append("play_store_url", playStoreUrl.trim());
    if (qrCodeFile) {
      formData.append("qr_code_image", qrCodeFile);
    }
    // Payme fiskal
    if (premiumMxik.trim()) {
      formData.append("premium_mxik", premiumMxik.trim());
    }
    if (premiumPackageCode.trim()) {
      formData.append("premium_package_code", premiumPackageCode.trim());
    }
    if (propertyPremiumMxik.trim()) {
      formData.append("property_premium_mxik", propertyPremiumMxik.trim());
    }
    if (propertyPremiumPackageCode.trim()) {
      formData.append(
        "property_premium_package_code",
        propertyPremiumPackageCode.trim(),
      );
    }
    if (advertiseMxik.trim()) {
      formData.append("advertise_mxik", advertiseMxik.trim());
    }
    if (advertisePackageCode.trim()) {
      formData.append("advertise_package_code", advertisePackageCode.trim());
    }
    if (vatPercent.trim()) {
      formData.append("vat_percent", vatPercent.trim());
    }
    // Telegram (bo'sh string = token o'chirish, shuning uchun doim yuboriladi)
    formData.append("telegram_bot_token", telegramBotToken.trim());
    formData.append(
      "telegram_admin_chat_ids",
      JSON.stringify(telegramChatIds.map((id) => id.trim()).filter(Boolean)),
    );
    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return <div className="p-6 text-muted-foreground">Yuklanmoqda...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center gap-3">
        <Settings className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">Sayt sozlamalari</h1>
          <p className="text-sm text-muted-foreground">
            Hero rasm va matnlarni har bir sahifa uchun alohida sozlash
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl space-y-5 rounded-2xl border border-border/60 bg-card p-6"
      >
        {SLOTS.map((cfg) => {
          const currentImg = data?.[cfg.imageField] as string | null;
          const preview = previews[cfg.slot];
          const file = files[cfg.slot];
          return (
            <div
              key={cfg.slot}
              className="rounded-xl border border-border/60 p-4"
            >
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{cfg.label}</h3>
                  <p className="text-xs text-muted-foreground">{cfg.description}</p>
                </div>
              </div>

              <div className="overflow-hidden rounded-lg border border-border/60 bg-gray-50">
                {preview || currentImg ? (
                  <img
                    src={preview || (currentImg as string)}
                    alt={cfg.label}
                    className="aspect-[16/6] w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-[16/6] items-center justify-center text-sm text-muted-foreground/70">
                    Rasm yo'q (default ishlatiladi)
                  </div>
                )}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border bg-white px-3 py-1.5 text-sm hover:bg-accent">
                  <Upload size={14} />
                  {file ? file.name.slice(0, 24) : "Rasm tanlash"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      setFiles((s) => ({
                        ...s,
                        [cfg.slot]: e.target.files?.[0] || null,
                      }))
                    }
                  />
                </label>
                {currentImg && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-red-600"
                    disabled={clearMutation.isPending}
                    onClick={() => {
                      if (window.confirm("Hero rasmini tozalaysizmi?")) {
                        clearMutation.mutate(cfg.slot);
                      }
                    }}
                  >
                    <Trash2 size={14} className="mr-1" /> Tozalash
                  </Button>
                )}
              </div>

              <div className="mt-3">
                <Label className="text-xs text-muted-foreground">
                  SrcSet (ixtiyoriy)
                </Label>
                <textarea
                  rows={1}
                  value={srcsets[cfg.slot]}
                  onChange={(e) =>
                    setSrcsets((s) => ({ ...s, [cfg.slot]: e.target.value }))
                  }
                  placeholder="https://.../hero-800.webp 800w, https://.../hero-1600.webp 1600w"
                  className="mt-1 w-full rounded-md border border-border px-3 py-2 text-xs font-mono"
                />
              </div>
            </div>
          );
        })}

        <div className="rounded-xl border border-border/60 p-4">
          <h3 className="mb-3 font-semibold text-foreground">
            Bosh sahifa matni (override)
          </h3>
          <div className="space-y-3">
            <div>
              <Label>Sarlavha</Label>
              <Input
                value={titleOverride}
                onChange={(e) => setTitleOverride(e.target.value)}
                placeholder="Bo'sh qoldirilsa default i18n sarlavha ko'rinadi"
              />
            </div>
            <div>
              <Label>Pastki matn</Label>
              <Input
                value={subtitleOverride}
                onChange={(e) => setSubtitleOverride(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border/60 p-4">
          <div className="mb-3 flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-600" />
            <h3 className="font-semibold text-foreground">Premium obuna</h3>
          </div>
          <p className="mb-3 text-xs text-muted-foreground">
            Bitta Premium obuna 3 ta narsani ochadi: cheksiz Voice AI, cheksiz
            property yaratish, va property TOP'ga chiqarishda chegirma. Reklama
            alohida pul.
          </p>

          <div className="mb-4">
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Bepul limitlar
            </h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <Label className="text-xs">Voice — bepul kunlik limit</Label>
                <Input
                  type="number"
                  min={0}
                  max={1000}
                  value={voiceDailyLimit}
                  onChange={(e) => setVoiceDailyLimit(e.target.value)}
                  placeholder="3"
                />
                <p className="mt-1 text-[10px] text-muted-foreground">
                  Anonim va login user uchun bir xil (IP/User bo'yicha).
                </p>
              </div>
              <div>
                <Label className="text-xs">Bepul property limiti</Label>
                <Input
                  type="number"
                  min={0}
                  max={1000}
                  value={freePropertyLimit}
                  onChange={(e) => setFreePropertyLimit(e.target.value)}
                  placeholder="3"
                />
                <p className="mt-1 text-[10px] text-muted-foreground">
                  Premium bo'lmagan user maks. nechta property yarata oladi.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Premium narxi & afzalliklari
            </h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <Label className="text-xs">Narxi</Label>
                <Input
                  type="number"
                  min={0}
                  value={premiumPrice}
                  onChange={(e) => setPremiumPrice(e.target.value)}
                  placeholder="50000"
                />
                <p className="mt-1 text-[10px] text-muted-foreground">
                  Server valyutasida (UZ: so'm, MY: MYR).
                </p>
              </div>
              <div>
                <Label className="text-xs">Davomiyligi (kun)</Label>
                <Input
                  type="number"
                  min={1}
                  max={365}
                  value={premiumDays}
                  onChange={(e) => setPremiumDays(e.target.value)}
                  placeholder="30"
                />
              </div>
              <div>
                <Label className="text-xs">
                  Property TOP chegirma (%)
                </Label>
                <Input
                  type="number"
                  min={0}
                  max={90}
                  value={premiumPropertyDiscount}
                  onChange={(e) =>
                    setPremiumPropertyDiscount(e.target.value)
                  }
                  placeholder="50"
                />
                <p className="mt-1 text-[10px] text-muted-foreground">
                  Premium user PROPERTY_PREMIUM'ni shu % arzonroq oladi (0–90).
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border/60 p-4">
          <div className="mb-3 flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-600" />
            <h3 className="font-semibold text-foreground">
              Payme fiskal (Cheklar soliq oborotida)
            </h3>
          </div>
          <p className="mb-3 text-xs text-muted-foreground">
            Payme har bir to'lov uchun chek (MXIK kodi + qadoq kodi + QQS%)
            talab qiladi.{" "}
            <a
              href="https://tasnif.soliq.uz/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              tasnif.soliq.uz
            </a>{" "}
            dan to'g'ri MXIK kodini topib kiriting. package_code MXIK ga
            bog'liq ko'rsatiladi.
          </p>

          <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <Label className="text-xs">
                Premium MXIK (Dasturiy ta'minot litsenziya)
              </Label>
              <Input
                value={premiumMxik}
                onChange={(e) => setPremiumMxik(e.target.value)}
                placeholder="10305008003000000"
              />
            </div>
            <div>
              <Label className="text-xs">
                Premium package_code (xizmat so'm)
              </Label>
              <Input
                value={premiumPackageCode}
                onChange={(e) => setPremiumPackageCode(e.target.value)}
                placeholder="1546532"
              />
            </div>
          </div>

          <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <Label className="text-xs">
                Property TOP MXIK (Premium bilan bir xil)
              </Label>
              <Input
                value={propertyPremiumMxik}
                onChange={(e) => setPropertyPremiumMxik(e.target.value)}
                placeholder="10305008003000000"
              />
            </div>
            <div>
              <Label className="text-xs">Property TOP package_code</Label>
              <Input
                value={propertyPremiumPackageCode}
                onChange={(e) =>
                  setPropertyPremiumPackageCode(e.target.value)
                }
                placeholder="1546532"
              />
            </div>
          </div>

          <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <Label className="text-xs">
                Reklama MXIK (Reklama joylashtirish)
              </Label>
              <Input
                value={advertiseMxik}
                onChange={(e) => setAdvertiseMxik(e.target.value)}
                placeholder="10305008004000000"
              />
            </div>
            <div>
              <Label className="text-xs">
                Reklama package_code (xizmat so'm)
              </Label>
              <Input
                value={advertisePackageCode}
                onChange={(e) => setAdvertisePackageCode(e.target.value)}
                placeholder="1546606"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs">QQS foizi (%)</Label>
            <Input
              type="number"
              min={0}
              max={30}
              value={vatPercent}
              onChange={(e) => setVatPercent(e.target.value)}
              placeholder="12"
              className="w-32"
            />
            <p className="mt-1 text-[10px] text-muted-foreground">
              Soliq kodeksi bo'yicha bu MXIK'lar uchun standart 12%
              qo'llaniladi (imtiyoz yo'q). 0 = QQS to'lovchi emas.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border/60 p-4">
          <div className="mb-3 flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">
              Mobile ilova (App Store / Google Play)
            </h3>
          </div>
          <p className="mb-3 text-xs text-muted-foreground">
            Bosh sahifa "Download the app" sektsiyasidagi tugmalar va QR kod.
            URL bo'sh qoldirilsa, mos badge ko'rinmaydi. QR rasm yo'q bo'lsa,
            QR ham yashiriladi.
          </p>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">App Store URL</Label>
              <Input
                type="url"
                value={appStoreUrl}
                onChange={(e) => setAppStoreUrl(e.target.value)}
                placeholder="https://apps.apple.com/app/..."
              />
            </div>
            <div>
              <Label className="text-xs">Google Play URL</Label>
              <Input
                type="url"
                value={playStoreUrl}
                onChange={(e) => setPlayStoreUrl(e.target.value)}
                placeholder="https://play.google.com/store/apps/details?id=..."
              />
            </div>
            <div>
              <Label className="text-xs">QR Code rasmi</Label>
              <div className="mt-1 flex items-center gap-3">
                {(qrCodePreview ?? data?.qr_code_image) && (
                  <img
                    src={qrCodePreview ?? (data?.qr_code_image as string)}
                    alt="QR"
                    className="h-20 w-20 rounded-md border border-border bg-white object-contain p-1"
                  />
                )}
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border bg-white px-3 py-1.5 text-sm hover:bg-accent">
                  <Upload size={14} />
                  {qrCodeFile ? qrCodeFile.name.slice(0, 20) : "QR yuklash"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      setQrCodeFile(e.target.files?.[0] || null)
                    }
                  />
                </label>
              </div>
              <p className="mt-1 text-[10px] text-muted-foreground">
                Tavsiya: kvadrat PNG, 300×300 px, transparent fon.
              </p>
            </div>
          </div>
        </div>

        {/* Telefon raqamlar */}
        <div className="rounded-xl border border-border/60 p-4">
          <div className="mb-3 flex items-center gap-2">
            <Phone className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Aloqa telefon raqamlar</h3>
          </div>
          <p className="mb-3 text-xs text-muted-foreground">
            Header va footer da ko'rinadigan telefon raqamlar. Format: +998 90 123 45 67
          </p>
          <div className="space-y-2">
            {contactPhones.map((phone, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Input
                  value={phone}
                  onChange={(e) =>
                    setContactPhones((prev) => {
                      const next = [...prev];
                      next[idx] = e.target.value;
                      return next;
                    })
                  }
                  placeholder="+998 90 123 45 67"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-600 shrink-0"
                  onClick={() =>
                    setContactPhones((prev) => prev.filter((_, i) => i !== idx))
                  }
                  disabled={contactPhones.length === 1}
                >
                  <X size={16} />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-1"
              onClick={() => setContactPhones((prev) => [...prev, ""])}
            >
              <Plus size={14} className="mr-1" /> Raqam qo'shish
            </Button>
          </div>
        </div>

        {/* Telegram admin bot */}
        <div className="rounded-xl border border-border/60 p-4">
          <div className="mb-3 flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Telegram bot (admin xabarnomalar)</h3>
          </div>
          <p className="mb-3 text-xs text-muted-foreground">
            Yangi e'lonlar (rasmlari va tasdiqlash/rad etish tugmalari bilan)
            va barcha admin xabarnomalari shu botga boradi. Bot yaratish:
            Telegram'da <b>@BotFather</b> → /newbot → token'ni shu yerga
            kiriting. Chat ID olish: botga kirib <b>/start</b> yuboring — bot
            ID'ingizni yozib beradi.
          </p>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Bot token</Label>
              <Input
                type="password"
                value={telegramBotToken}
                onChange={(e) => setTelegramBotToken(e.target.value)}
                placeholder="123456789:AAF..."
                autoComplete="off"
              />
              <p className="mt-1 text-[10px] text-muted-foreground">
                Bo'sh qoldirilsa Telegram xabarnomalar o'chiriladi.
              </p>
            </div>
            <div>
              <Label className="text-xs">Admin chat ID'lari</Label>
              <div className="mt-1 space-y-2">
                {telegramChatIds.map((id, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Input
                      value={id}
                      onChange={(e) =>
                        setTelegramChatIds((prev) => {
                          const next = [...prev];
                          next[idx] = e.target.value;
                          return next;
                        })
                      }
                      placeholder="123456789"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600 shrink-0"
                      onClick={() =>
                        setTelegramChatIds((prev) =>
                          prev.filter((_, i) => i !== idx),
                        )
                      }
                      disabled={telegramChatIds.length === 1}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setTelegramChatIds((prev) => [...prev, ""])}
                >
                  <Plus size={14} className="mr-1" /> ID qo'shish
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Default xarita joylashuvi */}
        <div className="rounded-xl border border-border/60 p-4">
          <div className="mb-3 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Default xarita joylashuvi</h3>
          </div>
          <p className="mb-3 text-xs text-muted-foreground">
            Barcha xarita sahifalari (/map, /projects) uchun boshlang'ich markaz.
            Google Maps'dan koordinatalarni olish: xaritada o'ng tugma → "Bu yerning koordinatalari".
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Kenglik (Latitude)</Label>
              <Input
                type="number"
                step="any"
                value={defaultMapLat}
                onChange={(e) => setDefaultMapLat(e.target.value)}
                placeholder="38.8447459"
              />
            </div>
            <div>
              <Label className="text-xs">Uzunlik (Longitude)</Label>
              <Input
                type="number"
                step="any"
                value={defaultMapLng}
                onChange={(e) => setDefaultMapLng(e.target.value)}
                placeholder="65.780332"
              />
            </div>
          </div>
          <p className="mt-2 text-[10px] text-muted-foreground">
            Hozirgi default: Qarshi shahri (38.8447459, 65.780332)
          </p>
        </div>

        <p className="text-xs text-muted-foreground">
          Tavsiya: 1600×600 px, WebP yoki JPG. 1.5 MB dan kichik.
        </p>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={updateMutation.isPending}
            className="bg-primary hover:bg-primary/90"
          >
            {updateMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Saqlash
          </Button>
        </div>
      </form>
    </div>
  );
}
