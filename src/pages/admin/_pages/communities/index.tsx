import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Edit2,
  Loader2,
  Plus,
  Star,
  Trash2,
  Trees,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { adminCommunityService } from "../../_services/admin-community.service";
import type {
  ICommunity,
  ICommunityFilter,
} from "@/services/community.service";

type Tab = "communities" | "filters";

function FilterEditor({
  filter,
  onClose,
}: Readonly<{ filter: ICommunityFilter | null; onClose: () => void }>) {
  const qc = useQueryClient();
  const isEdit = Boolean(filter);
  const [form, setForm] = useState({
    key: filter?.key ?? "",
    name: filter?.name ?? "",
    icon: filter?.icon ?? "Sparkles",
    order: filter?.order ?? 0,
    isActive: filter?.isActive ?? true,
  });

  const save = useMutation({
    mutationFn: async () => {
      if (isEdit) {
        return adminCommunityService.updateFilter(filter!._id, form);
      }
      return adminCommunityService.createFilter(form);
    },
    onSuccess: () => {
      toast.success("Filter saqlandi");
      qc.invalidateQueries({ queryKey: ["admin-community-filters"] });
      qc.invalidateQueries({ queryKey: ["community-filters"] });
      onClose();
    },
    onError: () => toast.error("Saqlashda xato"),
  });

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Filterni tahrirlash" : "Yangi filter"}
          </DialogTitle>
          <DialogDescription>
            Bosh sahifa Top Communities filter pill'lari uchun
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Key (URL-safe, masalan "popular")</Label>
            <Input
              value={form.key}
              onChange={(e) => setForm({ ...form, key: e.target.value })}
              disabled={isEdit}
            />
          </div>
          <div>
            <Label>Nomi (ko'rinadigan)</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <Label>Icon (Lucide nomi, masalan "Award")</Label>
            <Input
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
            />
            <p className="mt-1 text-[10px] text-muted-foreground">
              Mumkin: Award, Wallet, Briefcase, Bus, Leaf, Plane, Users,
              TreePine, Sparkles
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Tartib (order)</Label>
              <Input
                type="number"
                value={form.order}
                onChange={(e) =>
                  setForm({ ...form, order: Number(e.target.value) })
                }
              />
            </div>
            <div className="flex items-end">
              <label className="inline-flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm({ ...form, isActive: e.target.checked })
                  }
                />
                <span className="text-sm">Faol</span>
              </label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Bekor qilish
          </Button>
          <Button
            onClick={() => save.mutate()}
            disabled={save.isPending || !form.key || !form.name}
          >
            {save.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Saqlash
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CommunityEditor({
  community,
  filters,
  onClose,
}: Readonly<{
  community: ICommunity | null;
  filters: ICommunityFilter[];
  onClose: () => void;
}>) {
  const qc = useQueryClient();
  const isEdit = Boolean(community);
  const [form, setForm] = useState({
    name: community?.name ?? "",
    region: community?.region ?? "Qashqadaryo",
    rating: community?.rating ?? 4.5,
    description: community?.description ?? "",
    badge: community?.badge ?? "",
    searchHref: community?.searchHref ?? "",
    filters:
      community?.filters?.map((f) => (typeof f === "string" ? f : f._id)) ?? [],
    propertyCount: community?.propertyCount ?? 0,
    order: community?.order ?? 0,
    isActive: community?.isActive ?? true,
  });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(community?.image ?? null);

  const handleImage = (file: File | null) => {
    setImage(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview(community?.image ?? null);
    }
  };

  const save = useMutation({
    mutationFn: async () => {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("region", form.region);
      fd.append("rating", String(form.rating));
      if (form.description) fd.append("description", form.description);
      if (form.badge) fd.append("badge", form.badge);
      if (form.searchHref) fd.append("searchHref", form.searchHref);
      fd.append("filters", form.filters.join(","));
      fd.append("propertyCount", String(form.propertyCount));
      fd.append("order", String(form.order));
      fd.append("isActive", String(form.isActive));
      if (image) fd.append("image", image);
      if (isEdit) return adminCommunityService.update(community!._id, fd);
      return adminCommunityService.create(fd);
    },
    onSuccess: () => {
      toast.success("Saqlandi");
      qc.invalidateQueries({ queryKey: ["admin-communities"] });
      qc.invalidateQueries({ queryKey: ["communities"] });
      onClose();
    },
    onError: () => toast.error("Saqlashda xato"),
  });

  const toggleFilter = (id: string) => {
    setForm((f) => ({
      ...f,
      filters: f.filters.includes(id)
        ? f.filters.filter((x) => x !== id)
        : [...f.filters, id],
    }));
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Tumanni tahrirlash" : "Yangi tuman"}
          </DialogTitle>
          <DialogDescription>
            Top Communities section'ida ko'rsatiladigan tuman / mahalla
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label>Nomi</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <Label>Region (viloyat)</Label>
            <Input
              value={form.region}
              onChange={(e) => setForm({ ...form, region: e.target.value })}
            />
          </div>
          <div>
            <Label>Reyting (0-5)</Label>
            <Input
              type="number"
              min={0}
              max={5}
              step={0.1}
              value={form.rating}
              onChange={(e) =>
                setForm({ ...form, rating: Number(e.target.value) })
              }
            />
          </div>
          <div className="sm:col-span-2">
            <Label>Tavsif (ixtiyoriy)</Label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full rounded-md border border-input px-3 py-2 text-sm"
            />
          </div>
          <div>
            <Label>Badge (NEW/HOT/PREMIUM)</Label>
            <Input
              value={form.badge}
              onChange={(e) => setForm({ ...form, badge: e.target.value })}
              placeholder="NEW"
            />
          </div>
          <div>
            <Label>Mulk soni</Label>
            <Input
              type="number"
              value={form.propertyCount}
              onChange={(e) =>
                setForm({ ...form, propertyCount: Number(e.target.value) })
              }
            />
          </div>
          <div className="sm:col-span-2">
            <Label>Qidiruv link (ixtiyoriy)</Label>
            <Input
              value={form.searchHref}
              onChange={(e) => setForm({ ...form, searchHref: e.target.value })}
              placeholder="/filter-nav?category=APARTMENT_SALE"
            />
          </div>
          <div>
            <Label>Tartib (order)</Label>
            <Input
              type="number"
              value={form.order}
              onChange={(e) =>
                setForm({ ...form, order: Number(e.target.value) })
              }
            />
          </div>
          <div className="flex items-end">
            <label className="inline-flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) =>
                  setForm({ ...form, isActive: e.target.checked })
                }
              />
              <span className="text-sm">Faol (saytda ko'rinadi)</span>
            </label>
          </div>

          <div className="sm:col-span-2">
            <Label>Filterlar (bittadan ko'p mumkin)</Label>
            <div className="mt-1 flex flex-wrap gap-2">
              {filters.map((f) => {
                const checked = form.filters.includes(f._id);
                return (
                  <button
                    key={f._id}
                    type="button"
                    onClick={() => toggleFilter(f._id)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${checked ? "border-primary bg-primary/10 text-primary" : "border-border text-foreground hover:border-primary/40"}`}
                  >
                    {f.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="sm:col-span-2">
            <Label>Rasm</Label>
            <div className="mt-1 flex items-center gap-3">
              {preview && (
                <img
                  src={preview}
                  alt="preview"
                  className="h-20 w-32 rounded-md border object-cover"
                />
              )}
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border bg-white px-3 py-1.5 text-sm hover:bg-accent">
                <Upload size={14} />
                {image ? image.name.slice(0, 25) : "Rasm yuklash"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImage(e.target.files?.[0] || null)}
                />
              </label>
            </div>
            <p className="mt-1 text-[10px] text-muted-foreground">
              16:9 nisbat tavsiya etiladi (masalan 800×450 px)
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Bekor qilish
          </Button>
          <Button
            onClick={() => save.mutate()}
            disabled={save.isPending || !form.name}
          >
            {save.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Saqlash
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminCommunitiesPage() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<Tab>("communities");
  const [editingCommunity, setEditingCommunity] = useState<ICommunity | null>(
    null,
  );
  const [creatingCommunity, setCreatingCommunity] = useState(false);
  const [editingFilter, setEditingFilter] = useState<ICommunityFilter | null>(
    null,
  );
  const [creatingFilter, setCreatingFilter] = useState(false);

  const { data: filters = [] } = useQuery({
    queryKey: ["admin-community-filters"],
    queryFn: () => adminCommunityService.listFilters(),
  });
  const { data: communities = [] } = useQuery({
    queryKey: ["admin-communities"],
    queryFn: () => adminCommunityService.list(),
  });

  const deleteCommunity = useMutation({
    mutationFn: (id: string) => adminCommunityService.delete(id),
    onSuccess: () => {
      toast.success("O'chirildi");
      qc.invalidateQueries({ queryKey: ["admin-communities"] });
      qc.invalidateQueries({ queryKey: ["communities"] });
    },
  });
  const deleteFilter = useMutation({
    mutationFn: (id: string) => adminCommunityService.deleteFilter(id),
    onSuccess: () => {
      toast.success("O'chirildi");
      qc.invalidateQueries({ queryKey: ["admin-community-filters"] });
      qc.invalidateQueries({ queryKey: ["community-filters"] });
    },
  });

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center gap-3">
        <Trees className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Communities boshqaruvi</h1>
          <p className="text-sm text-muted-foreground">
            Bosh sahifa Top Communities section'i uchun tuman va filterlar
          </p>
        </div>
      </div>

      <div className="mb-6 border-b">
        <div className="flex gap-1">
          {(["communities", "filters"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`border-b-2 px-4 py-2 text-sm font-semibold ${tab === t ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              {t === "communities" ? "Tumanlar" : "Filterlar"}
            </button>
          ))}
        </div>
      </div>

      {tab === "communities" ? (
        <>
          <div className="mb-4 flex justify-end">
            <Button onClick={() => setCreatingCommunity(true)}>
              <Plus className="mr-1 h-4 w-4" /> Yangi tuman
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {communities.map((c) => (
              <div
                key={c._id}
                className="overflow-hidden rounded-2xl border bg-card"
              >
                <div className="h-40 overflow-hidden bg-muted">
                  {c.image ? (
                    <img
                      src={c.image}
                      alt={c.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                      Rasm yo'q
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{c.name}</h3>
                    <span className="inline-flex items-center gap-1 text-xs">
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      {c.rating}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{c.region}</p>
                  {!c.isActive && (
                    <span className="mt-1 inline-block rounded bg-gray-200 px-1.5 py-0.5 text-[10px] text-gray-700">
                      Yashirilgan
                    </span>
                  )}
                  <div className="mt-3 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingCommunity(c)}
                    >
                      <Edit2 size={14} className="mr-1" /> Tahrirlash
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => {
                        if (window.confirm(`O'chirilsinmi: ${c.name}?`)) {
                          deleteCommunity.mutate(c._id);
                        }
                      }}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="mb-4 flex justify-end">
            <Button onClick={() => setCreatingFilter(true)}>
              <Plus className="mr-1 h-4 w-4" /> Yangi filter
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filters.map((f) => (
              <div
                key={f._id}
                className="flex items-center justify-between rounded-2xl border bg-card p-3"
              >
                <div>
                  <p className="font-semibold">{f.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {f.key} • {f.icon} • order {f.order}
                    {!f.isActive && " • Yashirilgan"}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingFilter(f)}
                  >
                    <Edit2 size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600"
                    onClick={() => {
                      if (window.confirm(`O'chirilsinmi: ${f.name}?`)) {
                        deleteFilter.mutate(f._id);
                      }
                    }}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {(editingCommunity || creatingCommunity) && (
        <CommunityEditor
          community={editingCommunity}
          filters={filters}
          onClose={() => {
            setEditingCommunity(null);
            setCreatingCommunity(false);
          }}
        />
      )}
      {(editingFilter || creatingFilter) && (
        <FilterEditor
          filter={editingFilter}
          onClose={() => {
            setEditingFilter(null);
            setCreatingFilter(false);
          }}
        />
      )}
    </div>
  );
}
