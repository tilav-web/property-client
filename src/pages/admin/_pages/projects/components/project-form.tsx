import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Plus, X } from "lucide-react";
import type {
  IProject,
  IProjectUnitType,
  IProjectPaymentPlan,
  TProjectStatus,
  TProjectUnitCategory,
} from "@/interfaces/project/project.interface";
import { adminDeveloperService } from "../../../_services/admin-developer.service";
import { adminProjectService } from "../../../_services/admin-project.service";

interface Props {
  project: IProject | null;
  onSaved: () => void;
}

const STATUSES: TProjectStatus[] = [
  "pre_launch",
  "on_sale",
  "sold_out",
  "completed",
];

const UNIT_CATEGORIES: TProjectUnitCategory[] = [
  "apartment",
  "townhouse",
  "villa",
  "penthouse",
  "studio",
  "office",
];

export default function ProjectForm({ project, onSaved }: Props) {
  const developerId =
    typeof project?.developer === "object" ? project.developer._id : "";

  const [developer, setDeveloper] = useState(developerId);
  const [name, setName] = useState(project?.name ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [address, setAddress] = useState(project?.address ?? "");
  const [city, setCity] = useState(project?.city ?? "");
  const [country, setCountry] = useState(project?.country ?? "");
  const [deliveryDate, setDeliveryDate] = useState(
    project?.delivery_date ?? "",
  );
  const [status, setStatus] = useState<TProjectStatus>(
    project?.status ?? "on_sale",
  );
  const [launchPrice, setLaunchPrice] = useState(
    project?.launch_price?.toString() ?? "",
  );
  const [currency, setCurrency] = useState(project?.currency ?? "MYR");
  const [videoUrl, setVideoUrl] = useState(project?.video_url ?? "");
  const [isFeatured, setIsFeatured] = useState(project?.is_featured ?? false);

  const [unitTypes, setUnitTypes] = useState<IProjectUnitType[]>(
    project?.unit_types ?? [],
  );
  const [paymentPlans, setPaymentPlans] = useState<IProjectPaymentPlan[]>(
    project?.payment_plans ?? [],
  );

  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [brochureFile, setBrochureFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { data: developersList } = useQuery({
    queryKey: ["admin-developers-list"],
    queryFn: () => adminDeveloperService.list({ limit: 100 }),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !developer) {
      toast.error("Developer va Nom majburiy");
      return;
    }

    const formData = new FormData();
    formData.append("developer", developer);
    formData.append("name", name);
    if (description) formData.append("description", description);
    if (address) formData.append("address", address);
    if (city) formData.append("city", city);
    if (country) formData.append("country", country);
    if (deliveryDate) formData.append("delivery_date", deliveryDate);
    formData.append("status", status);
    if (launchPrice) formData.append("launch_price", launchPrice);
    if (currency) formData.append("currency", currency);
    if (videoUrl) formData.append("video_url", videoUrl);
    formData.append("is_featured", String(isFeatured));
    formData.append("unit_types", JSON.stringify(unitTypes));
    formData.append("payment_plans", JSON.stringify(paymentPlans));
    photoFiles.forEach((f) => formData.append("photos", f));
    if (brochureFile) formData.append("brochure", brochureFile);

    setSubmitting(true);
    try {
      if (project) {
        await adminProjectService.update(project._id, formData);
        toast.success("Yangilandi");
      } else {
        await adminProjectService.create(formData);
        toast.success("Yaratildi");
      }
      onSaved();
    } finally {
      setSubmitting(false);
    }
  };

  const removePhoto = async (url: string) => {
    if (!project) return;
    if (!window.confirm("Rasmni o'chirasizmi?")) return;
    try {
      await adminProjectService.removePhoto(project._id, url);
      toast.success("Rasm o'chirildi");
      onSaved();
    } catch {
      // toast handled globally
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Developer *</Label>
          <select
            required
            value={developer}
            onChange={(e) => setDeveloper(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">— Tanlang —</option>
            {developersList?.items?.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label>Status</Label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as TProjectStatus)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <Label>Loyiha nomi *</Label>
        <Input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Terra Woods"
        />
      </div>

      <div>
        <Label>Ta'rif</Label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Manzil</Label>
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div>
          <Label>Shahar</Label>
          <Input value={city} onChange={(e) => setCity(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label>Davlat</Label>
          <Input
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Malaysia"
          />
        </div>
        <div>
          <Label>Yetkazib berish</Label>
          <Input
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            placeholder="Q1 2030"
          />
        </div>
        <div>
          <Label>Video URL</Label>
          <Input
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label>Boshlang'ich narx</Label>
          <Input
            type="number"
            value={launchPrice}
            onChange={(e) => setLaunchPrice(e.target.value)}
          />
        </div>
        <div>
          <Label>Valyuta</Label>
          <Input
            value={currency}
            onChange={(e) => setCurrency(e.target.value.toUpperCase())}
            placeholder="MYR"
          />
        </div>
        <label className="flex items-end gap-2 pb-2 text-sm">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="h-4 w-4"
          />
          Featured
        </label>
      </div>

      {/* Unit types */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <Label className="m-0">Unit turlari</Label>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() =>
              setUnitTypes([
                ...unitTypes,
                {
                  category: "apartment",
                  bedrooms_min: undefined,
                  bedrooms_max: undefined,
                  area_min: undefined,
                  area_max: undefined,
                  price_from: undefined,
                  count: undefined,
                },
              ])
            }
          >
            <Plus size={14} /> Qator qo'shish
          </Button>
        </div>
        <div className="space-y-2">
          {unitTypes.map((u, i) => (
            <div
              key={i}
              className="flex flex-wrap items-end gap-2 rounded-lg border border-gray-200 p-2"
            >
              <select
                value={u.category}
                onChange={(e) => {
                  const next = [...unitTypes];
                  next[i] = {
                    ...next[i],
                    category: e.target.value as TProjectUnitCategory,
                  };
                  setUnitTypes(next);
                }}
                className="rounded-md border border-gray-300 px-2 py-1 text-xs"
              >
                {UNIT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {(
                [
                  ["bedrooms_min", "Beds min"],
                  ["bedrooms_max", "Beds max"],
                  ["area_min", "m² min"],
                  ["area_max", "m² max"],
                  ["price_from", "From"],
                  ["count", "Count"],
                ] as const
              ).map(([key, label]) => (
                <Input
                  key={key}
                  type="number"
                  placeholder={label}
                  value={(u[key] as number | undefined) ?? ""}
                  onChange={(e) => {
                    const next = [...unitTypes];
                    const v = e.target.value;
                    next[i] = {
                      ...next[i],
                      [key]: v === "" ? undefined : Number(v),
                    };
                    setUnitTypes(next);
                  }}
                  className="h-8 w-20 text-xs"
                />
              ))}
              <Button
                type="button"
                size="icon"
                variant="outline"
                className="h-8 w-8 text-red-600"
                onClick={() =>
                  setUnitTypes(unitTypes.filter((_, idx) => idx !== i))
                }
              >
                <X size={12} />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Payment plans */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <Label className="m-0">Payment plans</Label>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() =>
              setPaymentPlans([
                ...paymentPlans,
                { name: "", deposit_percent: undefined, description: "" },
              ])
            }
          >
            <Plus size={14} /> Plan qo'shish
          </Button>
        </div>
        <div className="space-y-2">
          {paymentPlans.map((p, i) => (
            <div
              key={i}
              className="flex flex-wrap items-end gap-2 rounded-lg border border-gray-200 p-2"
            >
              <Input
                placeholder="Nom (10/90)"
                value={p.name}
                onChange={(e) => {
                  const next = [...paymentPlans];
                  next[i] = { ...next[i], name: e.target.value };
                  setPaymentPlans(next);
                }}
                className="h-8 w-32 text-xs"
              />
              <Input
                type="number"
                placeholder="Deposit %"
                value={p.deposit_percent ?? ""}
                onChange={(e) => {
                  const next = [...paymentPlans];
                  next[i] = {
                    ...next[i],
                    deposit_percent:
                      e.target.value === "" ? undefined : Number(e.target.value),
                  };
                  setPaymentPlans(next);
                }}
                className="h-8 w-24 text-xs"
              />
              <Input
                placeholder="Tavsif"
                value={p.description ?? ""}
                onChange={(e) => {
                  const next = [...paymentPlans];
                  next[i] = { ...next[i], description: e.target.value };
                  setPaymentPlans(next);
                }}
                className="h-8 flex-1 text-xs"
              />
              <Button
                type="button"
                size="icon"
                variant="outline"
                className="h-8 w-8 text-red-600"
                onClick={() =>
                  setPaymentPlans(paymentPlans.filter((_, idx) => idx !== i))
                }
              >
                <X size={12} />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Photos */}
      <div>
        <Label>Rasmlar</Label>
        <Input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) =>
            setPhotoFiles(e.target.files ? Array.from(e.target.files) : [])
          }
        />
        {project?.photos && project.photos.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {project.photos.map((url) => (
              <div key={url} className="relative">
                <img
                  src={url}
                  alt=""
                  className="h-16 w-24 rounded object-cover"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(url)}
                  className="absolute -right-1 -top-1 rounded-full bg-red-500 p-0.5 text-white"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Brochure */}
      <div>
        <Label>Brochure (PDF)</Label>
        <Input
          type="file"
          accept=".pdf,application/pdf"
          onChange={(e) => setBrochureFile(e.target.files?.[0] || null)}
        />
        {project?.brochure && !brochureFile && (
          <a
            href={project.brochure}
            target="_blank"
            rel="noopener"
            className="text-xs text-blue-600 hover:underline"
          >
            Joriy brochure
          </a>
        )}
      </div>

      <Button
        type="submit"
        disabled={submitting}
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {project ? "Yangilash" : "Yaratish"}
      </Button>
    </form>
  );
}
