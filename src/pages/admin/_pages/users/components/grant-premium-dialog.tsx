import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Crown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminUserService } from "../../../_services/admin-user.service";
import type { IUser } from "@/interfaces/users/user.interface";

interface Props {
  readonly user: IUser | null;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}

const PRESETS = [30, 90, 365];

function formatDate(iso: string | null | undefined): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString();
}

function daysLeft(iso: string | null | undefined): number {
  if (!iso) return 0;
  const ms = new Date(iso).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / 86_400_000));
}

export function GrantPremiumDialog({ user, open, onOpenChange }: Props) {
  const queryClient = useQueryClient();
  const [days, setDays] = useState<string>("30");

  useEffect(() => {
    if (open) setDays("30");
  }, [open]);

  const activeUntil = user?.premiumUntil ?? null;
  const isActive = activeUntil && new Date(activeUntil).getTime() > Date.now();

  const grant = useMutation({
    mutationFn: (input: { id: string; days: number }) =>
      adminUserService.grantPremium(input.id, input.days),
    onSuccess: (res) => {
      toast.success(
        `Premium berildi — ${formatDate(res.premiumUntil)} gacha`,
      );
      void queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      onOpenChange(false);
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message ?? "Xatolik";
      toast.error(msg);
    },
  });

  const revoke = useMutation({
    mutationFn: (id: string) => adminUserService.revokePremium(id),
    onSuccess: () => {
      toast.success("Premium bekor qilindi");
      void queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      onOpenChange(false);
    },
    onError: () => toast.error("Bekor qilishda xatolik"),
  });

  const handleGrant = () => {
    if (!user) return;
    const n = Number(days);
    if (!Number.isInteger(n) || n < 1 || n > 3650) {
      toast.error("Kunlar soni 1..3650 oralig'ida bo'lishi kerak");
      return;
    }
    grant.mutate({ id: user._id, days: n });
  };

  const handleRevoke = () => {
    if (!user) return;
    if (!window.confirm("Premium'ni darhol bekor qilasizmi?")) return;
    revoke.mutate(user._id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white">
            <Crown size={24} />
          </div>
          <DialogTitle className="text-center">
            {isActive ? "Premium uzaytirish" : "Premium berish"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {user
              ? `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() ||
                user.email.value ||
                user.phone.value
              : ""}
          </DialogDescription>
        </DialogHeader>

        {isActive && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            Faol Premium: {formatDate(activeUntil)} ({daysLeft(activeUntil)} kun
            qoldi). Yangi kunlar shu sanaga qo'shiladi.
          </div>
        )}

        <div className="space-y-3 py-2">
          <Label className="text-xs">Necha kun?</Label>
          <div className="flex gap-2">
            {PRESETS.map((p) => (
              <Button
                key={p}
                type="button"
                variant={days === String(p) ? "default" : "outline"}
                size="sm"
                onClick={() => setDays(String(p))}
              >
                {p} kun
              </Button>
            ))}
          </div>
          <Input
            type="number"
            min={1}
            max={3650}
            value={days}
            onChange={(e) => setDays(e.target.value)}
            placeholder="30"
          />
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button
            onClick={handleGrant}
            disabled={grant.isPending}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
          >
            {grant.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            <Crown className="mr-2 h-4 w-4" />
            {isActive ? "Uzaytirish" : "Premium berish"}
          </Button>
          {isActive && (
            <Button
              variant="outline"
              onClick={handleRevoke}
              disabled={revoke.isPending}
              className="w-full text-red-600 hover:text-red-700"
            >
              {revoke.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Premium'ni bekor qilish
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
