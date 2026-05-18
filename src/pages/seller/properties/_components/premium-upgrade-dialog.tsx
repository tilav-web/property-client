import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Sparkles, ExternalLink } from "lucide-react";
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
import { propertyPremiumService } from "@/services/property-premium.service";
import { formatPrice } from "@/utils/format-price";
import type { IStartPremiumUpgradeResult } from "@/interfaces/payment/payment.interface";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyId: string;
  propertyTitle: string;
}

export function PremiumUpgradeDialog({
  open,
  onOpenChange,
  propertyId,
  propertyTitle,
}: Props) {
  const [result, setResult] = useState<IStartPremiumUpgradeResult | null>(null);

  const startMutation = useMutation({
    mutationFn: () => propertyPremiumService.startUpgrade(propertyId),
    onSuccess: (data) => {
      setResult(data);
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Xato yuz berdi";
      toast.error(msg);
    },
  });

  const close = () => {
    onOpenChange(false);
    setTimeout(() => {
      setResult(null);
      startMutation.reset();
    }, 200);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? onOpenChange(o) : close())}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            E'lonni premium qilish
          </DialogTitle>
          <DialogDescription className="line-clamp-2">
            {propertyTitle}
          </DialogDescription>
        </DialogHeader>

        {!result ? (
          <>
            <div className="text-sm space-y-2">
              <p>
                Premium e'lon qidiruv natijalarida yuqorida ko'rsatiladi va
                "Premium" badge bilan ajralib turadi.
              </p>
              <p className="text-muted-foreground">
                Tasdiqlasangiz, to'lov sahifasi (Payme) ochiladi. To'lov
                muvaffaqiyatli bo'lgach, admin tasdig'idan keyin premium
                yoqiladi.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={close}>
                Bekor qilish
              </Button>
              <Button
                onClick={() => startMutation.mutate()}
                disabled={startMutation.isPending}
              >
                {startMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}
                To'lovni boshlash
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <div className="text-sm space-y-3">
              <div className="rounded-lg border p-3 bg-amber-50/50">
                <div className="flex items-baseline justify-between">
                  <span className="text-muted-foreground">Summa:</span>
                  <span className="text-xl font-bold">
                    {formatPrice(result.amount, { code: result.currency })}
                  </span>
                </div>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-muted-foreground">Muddat:</span>
                  <span className="font-medium">
                    {result.durationDays} kun
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                "To'lovga o'tish" tugmasini bosib Payme sahifasiga o'ting. To'lov
                muvaffaqiyatli bo'lgach, admin tasdiqlashidan so'ng e'loningiz
                premium bo'ladi.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={close}>
                Yopish
              </Button>
              <Button asChild>
                <a
                  href={result.checkoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  To'lovga o'tish
                </a>
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
