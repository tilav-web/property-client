import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Save, Smartphone, Apple } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  adminAppVersionService,
  type AppPlatform,
  type AppVersionRecord,
} from "../../_services/admin-app-version.service";

// ─── Platform form state ────────────────────────────────────────────────────

interface FormState {
  version: string;
  store_url: string;
  is_force_update: boolean;
  release_notes: string;
}

const empty = (): FormState => ({
  version: "",
  store_url: "",
  is_force_update: false,
  release_notes: "",
});

function fromRecord(r: AppVersionRecord): FormState {
  return {
    version: r.version,
    store_url: r.store_url,
    is_force_update: r.is_force_update,
    release_notes: r.release_notes ?? "",
  };
}

// ─── Platform card ───────────────────────────────────────────────────────────

function PlatformCard({
  platform,
  record,
}: {
  platform: AppPlatform;
  record?: AppVersionRecord;
}) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormState>(record ? fromRecord(record) : empty());

  useEffect(() => {
    setForm(record ? fromRecord(record) : empty());
  }, [record]);

  const mutation = useMutation({
    mutationFn: () =>
      adminAppVersionService.upsert({
        platform,
        version: form.version.trim(),
        store_url: form.store_url.trim(),
        is_force_update: form.is_force_update,
        release_notes: form.release_notes.trim() || null,
      }),
    onSuccess: () => {
      toast.success(`${platform === "ios" ? "iOS" : "Android"} versiyasi saqlandi`);
      queryClient.invalidateQueries({ queryKey: ["admin-app-version"] });
    },
    onError: () => {
      toast.error("Xatolik yuz berdi");
    },
  });

  const handleSave = () => {
    if (!form.version.trim()) {
      toast.error("Versiya raqamini kiriting");
      return;
    }
    if (!/^\d+\.\d+\.\d+$/.test(form.version.trim())) {
      toast.error('Versiya formati noto\'g\'ri. Masalan: "1.2.0"');
      return;
    }
    if (!form.store_url.trim()) {
      toast.error("Do'kon URL'ini kiriting");
      return;
    }
    mutation.mutate();
  };

  const isAndroid = platform === "android";

  return (
    <div className="border border-border rounded-xl p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
          {isAndroid ? (
            <Smartphone className="h-5 w-5 text-muted-foreground" />
          ) : (
            <Apple className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
        <div>
          <h3 className="font-semibold">{isAndroid ? "Android" : "iOS"}</h3>
          <p className="text-xs text-muted-foreground">
            {isAndroid ? "Google Play" : "App Store"}
          </p>
        </div>
        {record?.updatedAt && (
          <p className="ml-auto text-xs text-muted-foreground">
            Yangilangan:{" "}
            {new Date(record.updatedAt).toLocaleDateString("uz-Latn-UZ")}
          </p>
        )}
      </div>

      <Separator />

      {/* Version */}
      <div className="space-y-1.5">
        <Label>Versiya raqami</Label>
        <Input
          placeholder="1.0.0"
          value={form.version}
          onChange={(e) => setForm((f) => ({ ...f, version: e.target.value }))}
        />
        <p className="text-xs text-muted-foreground">
          Semantic versioning formatida: X.Y.Z
        </p>
      </div>

      {/* Store URL */}
      <div className="space-y-1.5">
        <Label>{isAndroid ? "Google Play URL" : "App Store URL"}</Label>
        <Input
          placeholder={
            isAndroid
              ? "https://play.google.com/store/apps/details?id=..."
              : "https://apps.apple.com/app/..."
          }
          value={form.store_url}
          onChange={(e) => setForm((f) => ({ ...f, store_url: e.target.value }))}
        />
      </div>

      {/* Force update */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Majburiy yangilash</Label>
          <p className="text-xs text-muted-foreground">
            Yoqilsa foydalanuvchi yangilamasdan ilovadan foydalana olmaydi
          </p>
        </div>
        <Switch
          checked={form.is_force_update}
          onCheckedChange={(v) => setForm((f) => ({ ...f, is_force_update: v }))}
        />
      </div>

      {/* Release notes */}
      <div className="space-y-1.5">
        <Label>Yangiliklar (ixtiyoriy)</Label>
        <Textarea
          placeholder="Bu versiyada nima yangilandi..."
          value={form.release_notes}
          onChange={(e) =>
            setForm((f) => ({ ...f, release_notes: e.target.value }))
          }
          rows={3}
        />
      </div>

      {/* Save button */}
      <Button
        onClick={handleSave}
        disabled={mutation.isPending}
        className="w-full"
      >
        {mutation.isPending ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Save className="h-4 w-4 mr-2" />
        )}
        Saqlash
      </Button>
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function AdminAppVersionPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-app-version"],
    queryFn: () => adminAppVersionService.getAll(),
  });

  const androidRecord = data?.find((r) => r.platform === "android");
  const iosRecord = data?.find((r) => r.platform === "ios");

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold">Ilova versiyasi</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          iOS va Android uchun yangi versiya ma'lumotlarini kiriting. Foydalanuvchilar
          ilovani ochganda avtomatik yangilash dialogi ko'rsatiladi.
        </p>
      </div>

      <Separator />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <PlatformCard platform="android" record={androidRecord} />
          <PlatformCard platform="ios" record={iosRecord} />
        </div>
      )}
    </div>
  );
}
