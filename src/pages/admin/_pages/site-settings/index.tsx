import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Settings, Trash2, Upload } from "lucide-react";
import { adminSiteSettingsService } from "../../_services/admin-site-settings.service";

export default function AdminSiteSettingsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-site-settings"],
    queryFn: () => adminSiteSettingsService.getPublic(),
  });

  const [titleOverride, setTitleOverride] = useState("");
  const [subtitleOverride, setSubtitleOverride] = useState("");
  const [srcset, setSrcset] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      setTitleOverride(data.hero_title_override ?? "");
      setSubtitleOverride(data.hero_subtitle_override ?? "");
      setSrcset(data.hero_image_srcset ?? "");
    }
  }, [data]);

  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setImagePreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setImagePreview(null);
  }, [imageFile]);

  const updateMutation = useMutation({
    mutationFn: (formData: FormData) =>
      adminSiteSettingsService.update(formData),
    onSuccess: () => {
      toast.success("Sozlamalar saqlandi");
      setImageFile(null);
      queryClient.invalidateQueries({ queryKey: ["admin-site-settings"] });
    },
  });

  const clearMutation = useMutation({
    mutationFn: () => adminSiteSettingsService.clearHero(),
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
    formData.append("hero_image_srcset", srcset);
    if (imageFile) formData.append("hero_image", imageFile);
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
            Bosh sahifadagi hero qismi
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl space-y-5 rounded-2xl border border-gray-200 bg-white p-6"
      >
        <div>
          <Label className="mb-2 block">Hero rasmi</Label>
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
            {imagePreview || data?.hero_image ? (
              <img
                src={imagePreview || (data?.hero_image as string)}
                alt="Hero"
                className="aspect-[16/6] w-full object-cover"
              />
            ) : (
              <div className="flex aspect-[16/6] items-center justify-center text-gray-400">
                Rasm yo'q (default ishlatiladi)
              </div>
            )}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-50">
              <Upload size={14} />
              Rasm tanlash
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
            </label>
            {data?.hero_image && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-red-600"
                disabled={clearMutation.isPending}
                onClick={() => {
                  if (window.confirm("Hero rasmini tozalaysizmi?")) {
                    clearMutation.mutate();
                  }
                }}
              >
                <Trash2 size={14} className="mr-1" /> Tozalash
              </Button>
            )}
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Tavsiya: 1600×600 px, WebP yoki JPG. 1.5 MB dan kichik.
          </p>
        </div>

        <div>
          <Label>Sarlavha (override)</Label>
          <Input
            value={titleOverride}
            onChange={(e) => setTitleOverride(e.target.value)}
            placeholder="Bo'sh qoldirilsa default i18n sarlavha ko'rinadi"
          />
        </div>

        <div>
          <Label>Pastki matn (override)</Label>
          <Input
            value={subtitleOverride}
            onChange={(e) => setSubtitleOverride(e.target.value)}
          />
        </div>

        <div>
          <Label>SrcSet (responsive variant'lar, ixtiyoriy)</Label>
          <textarea
            rows={2}
            value={srcset}
            onChange={(e) => setSrcset(e.target.value)}
            placeholder="https://.../hero-800.webp 800w, https://.../hero-1600.webp 1600w"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-mono"
          />
          <p className="mt-1 text-xs text-gray-500">
            Bo'sh qoldirilsa CDN faqat yuklangan rasmni qaytaradi.
          </p>
        </div>

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
