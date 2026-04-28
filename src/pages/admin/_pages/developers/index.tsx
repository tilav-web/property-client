import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Building2, Edit, Plus, Trash2 } from "lucide-react";
import { adminDeveloperService } from "../../_services/admin-developer.service";
import type { IDeveloper } from "@/interfaces/developer/developer.interface";
import DeveloperForm from "./components/developer-form";

export default function AdminDevelopersPage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<IDeveloper | null>(null);
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-developers", search],
    queryFn: () => adminDeveloperService.list({ limit: 50, search }),
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => adminDeveloperService.remove(id),
    onSuccess: () => {
      toast.success("Developer o'chirildi");
      queryClient.invalidateQueries({ queryKey: ["admin-developers"] });
    },
  });

  const items = data?.items ?? [];

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Developers</h1>
          <p className="text-sm text-gray-500">Loyiha qurish kompaniyalari</p>
        </div>
        <Button onClick={() => setCreating(true)} className="gap-2">
          <Plus size={16} /> Yangi developer
        </Button>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Qidirish..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {isLoading ? (
        <div className="py-10 text-center text-gray-500">Yuklanmoqda...</div>
      ) : items.length === 0 ? (
        <div className="py-10 text-center text-gray-500">
          Developerlar yo'q. Yangi qo'shing.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((d) => (
            <div
              key={d._id}
              className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3"
            >
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg bg-gray-50">
                {d.logo ? (
                  <img
                    src={d.logo}
                    alt={d.name}
                    className="max-h-full max-w-full object-contain p-1"
                  />
                ) : (
                  <Building2 className="h-6 w-6 text-gray-300" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-gray-900">{d.name}</p>
                <p className="text-xs text-gray-500">
                  {d.projects_count} loyiha
                </p>
              </div>
              <div className="flex gap-1">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => setEditing(d)}
                  className="h-8 w-8"
                >
                  <Edit size={14} />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 text-red-600 hover:bg-red-50"
                  onClick={() => {
                    if (window.confirm(`"${d.name}" ni o'chirasizmi?`)) {
                      removeMutation.mutate(d._id);
                    }
                  }}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog
        open={creating || !!editing}
        onOpenChange={(o) => {
          if (!o) {
            setCreating(false);
            setEditing(null);
          }
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Developer'ni tahrirlash" : "Yangi developer"}
            </DialogTitle>
          </DialogHeader>
          <DeveloperForm
            developer={editing}
            onSaved={() => {
              setCreating(false);
              setEditing(null);
              queryClient.invalidateQueries({
                queryKey: ["admin-developers"],
              });
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
