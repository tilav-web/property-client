import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Settings, Trash2, Upload } from "lucide-react";
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
    queryFn: () => adminSiteSettingsService.getPublic(),
  });

  const [titleOverride, setTitleOverride] = useState("");
  const [subtitleOverride, setSubtitleOverride] = useState("");
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
    }
  }, [data]);

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
    },
    onError: () => toast.error("Saqlashda xatolik"),
  });

  const clearMutation = useMutation({
    mutationFn: (slot: HeroSlot) => adminSiteSettingsService.clearHero(slot),
    onSuccess: () => {
      toast.success("Hero rasmi tozalandi");
      queryClient.invalidateQueries({ queryKey: ["admin-site-settings"] });
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
    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return <div className="p-6 text-gray-500">Yuklanmoqda...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center gap-3">
        <Settings className="h-6 w-6 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sayt sozlamalari</h1>
          <p className="text-sm text-gray-500">
            Hero rasm va matnlarni har bir sahifa uchun alohida sozlash
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl space-y-5 rounded-2xl border border-gray-200 bg-white p-6"
      >
        {SLOTS.map((cfg) => {
          const currentImg = data?.[cfg.imageField] as string | null;
          const preview = previews[cfg.slot];
          const file = files[cfg.slot];
          return (
            <div
              key={cfg.slot}
              className="rounded-xl border border-gray-200 p-4"
            >
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{cfg.label}</h3>
                  <p className="text-xs text-gray-500">{cfg.description}</p>
                </div>
              </div>

              <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                {preview || currentImg ? (
                  <img
                    src={preview || (currentImg as string)}
                    alt={cfg.label}
                    className="aspect-[16/6] w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-[16/6] items-center justify-center text-sm text-gray-400">
                    Rasm yo'q (default ishlatiladi)
                  </div>
                )}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-50">
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
                <Label className="text-xs text-gray-500">
                  SrcSet (ixtiyoriy)
                </Label>
                <textarea
                  rows={1}
                  value={srcsets[cfg.slot]}
                  onChange={(e) =>
                    setSrcsets((s) => ({ ...s, [cfg.slot]: e.target.value }))
                  }
                  placeholder="https://.../hero-800.webp 800w, https://.../hero-1600.webp 1600w"
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-xs font-mono"
                />
              </div>
            </div>
          );
        })}

        <div className="rounded-xl border border-gray-200 p-4">
          <h3 className="mb-3 font-semibold text-gray-900">
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

        <p className="text-xs text-gray-500">
          Tavsiya: 1600×600 px, WebP yoki JPG. 1.5 MB dan kichik.
        </p>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={updateMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700"
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
