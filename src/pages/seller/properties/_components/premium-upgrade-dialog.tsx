import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const [result, setResult] = useState<IStartPremiumUpgradeResult | null>(null);

  const startMutation = useMutation({
    mutationFn: () => propertyPremiumService.startUpgrade(propertyId),
    onSuccess: (data) => {
      setResult(data);
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? t("payment.admin_payments.error_generic");
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
            {t("payment.premium.dialog_title")}
          </DialogTitle>
          <DialogDescription className="line-clamp-2">
            {propertyTitle}
          </DialogDescription>
        </DialogHeader>

        {!result ? (
          <>
            <div className="text-sm space-y-2">
              <p>{t("payment.premium.description_intro")}</p>
              <p className="text-muted-foreground">
                {t("payment.premium.description_flow")}
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={close}>
                {t("payment.premium.cancel")}
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
                {t("payment.premium.start_payment")}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <div className="text-sm space-y-3">
              <div className="rounded-lg border p-3 bg-amber-50/50">
                <div className="flex items-baseline justify-between">
                  <span className="text-muted-foreground">
                    {t("payment.premium.amount")}
                  </span>
                  <span className="text-xl font-bold">
                    {formatPrice(result.amount, { code: result.currency })}
                  </span>
                </div>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-muted-foreground">
                    {t("payment.premium.duration")}
                  </span>
                  <span className="font-medium">
                    {t("payment.premium.days", { count: result.durationDays })}
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {t("payment.premium.after_pay_info")}
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={close}>
                {t("payment.premium.close")}
              </Button>
              <Button asChild>
                <a
                  href={result.checkoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  {t("payment.premium.go_to_payment")}
                </a>
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
