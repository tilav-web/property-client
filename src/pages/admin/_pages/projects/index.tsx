import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Edit, Plus, Trash2, Star } from "lucide-react";
import { adminProjectService } from "../../_services/admin-project.service";
import type { IProject } from "@/interfaces/project/project.interface";
import ProjectForm from "./components/project-form";
import { formatPrice } from "@/utils/format-price";

export default function AdminProjectsPage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<IProject | null>(null);
  const [creating, setCreating] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: () => adminProjectService.list({ limit: 50 }),
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => adminProjectService.remove(id),
    onSuccess: () => {
      toast.success("Loyiha o'chirildi");
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
    },
  });

  const items = data?.items ?? [];

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-sm text-gray-500">Off-plan loyihalar</p>
        </div>
        <Button onClick={() => setCreating(true)} className="gap-2">
          <Plus size={16} /> Yangi loyiha
        </Button>
      </div>

      {isLoading ? (
        <div className="py-10 text-center text-gray-500">Yuklanmoqda...</div>
      ) : items.length === 0 ? (
        <div className="py-10 text-center text-gray-500">
          Loyihalar yo'q. Yangi qo'shing.
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
              <tr>
                <th className="p-3">Nom</th>
                <th className="p-3">Developer</th>
                <th className="p-3">Status</th>
                <th className="p-3">Boshlang'ich</th>
                <th className="p-3">Yetkazib berish</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => {
                const dev =
                  typeof p.developer === "object" ? p.developer : null;
                return (
                  <tr key={p._id} className="border-t border-gray-100">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {p.is_featured && (
                          <Star
                            size={14}
                            className="fill-amber-400 text-amber-400"
                          />
                        )}
                        <span className="font-medium">{p.name}</span>
                      </div>
                      {p.city && (
                        <p className="text-xs text-gray-500">{p.city}</p>
                      )}
                    </td>
                    <td className="p-3 text-gray-700">{dev?.name ?? "—"}</td>
                    <td className="p-3">
                      <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs">
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3">
                      {p.launch_price !== undefined
                        ? formatPrice(p.launch_price, p.currency)
                        : "—"}
                    </td>
                    <td className="p-3 text-gray-600">
                      {p.delivery_date ?? "—"}
                    </td>
                    <td className="p-3">
                      <div className="flex justify-end gap-1">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => setEditing(p)}
                          className="h-8 w-8"
                        >
                          <Edit size={14} />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 text-red-600 hover:bg-red-50"
                          onClick={() => {
                            if (window.confirm(`"${p.name}" ni o'chirasizmi?`)) {
                              removeMutation.mutate(p._id);
                            }
                          }}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Loyihani tahrirlash" : "Yangi loyiha"}
            </DialogTitle>
          </DialogHeader>
          <ProjectForm
            project={editing}
            onSaved={() => {
              setCreating(false);
              setEditing(null);
              queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
