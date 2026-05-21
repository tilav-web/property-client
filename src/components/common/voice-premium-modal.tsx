import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Crown, Loader2, Mic } from "lucide-react";
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
import { voicePremiumService } from "@/services/voice-premium.service";
import { useUserStore } from "@/stores/user.store";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Server'dan kelgan limit (402 javobida bor) */
  dailyLimit?: number;
  usedToday?: number;
}

export default function VoicePremiumModal({
  open,
  onOpenChange,
  dailyLimit,
  usedToday,
}: Props) {
  const { t } = useTranslation();
  const user = useUserStore((s) => s.user);
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    if (!user?._id) {
      toast.error(
        t("voice.upgrade_requires_login", {
          defaultValue: "Premium uchun avval tizimga kiring",
        }),
      );
      return;
    }
    setLoading(true);
    try {
      const res = await voicePremiumService.startUpgrade();
      // Payme yangi tab'da
      window.open(res.checkoutUrl, "_blank", "noopener,noreferrer");
      onOpenChange(false);
    } catch (err) {
      console.error("voice upgrade failed", err);
      toast.error(
        t("voice.upgrade_error", {
          defaultValue: "Premium so'rovi yuborilmadi, qayta urining",
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white">
            <Crown size={24} />
          </div>
          <DialogTitle className="text-center">
            {t("voice.limit_title", {
              defaultValue: "Voice limit tugadi",
            })}
          </DialogTitle>
          <DialogDescription className="text-center">
            {dailyLimit !== undefined
              ? t("voice.limit_desc_with_count", {
                  defaultValue:
                    "Bugun {{used}}/{{limit}} ovozli xabar ishlatildi. Cheksiz foydalanish uchun Voice Premium oling.",
                  used: usedToday ?? dailyLimit,
                  limit: dailyLimit,
                })
              : t("voice.limit_desc", {
                  defaultValue:
                    "Bepul kunlik limit tugadi. Cheksiz foydalanish uchun Voice Premium oling.",
                })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <div className="flex items-start gap-3 rounded-lg bg-amber-50 p-3 text-sm">
            <Mic size={16} className="mt-0.5 flex-shrink-0 text-amber-600" />
            <p className="text-amber-900">
              {t("voice.benefit_1", {
                defaultValue: "Cheksiz ovozli AI qidiruv",
              })}
            </p>
          </div>
          <div className="flex items-start gap-3 rounded-lg bg-amber-50 p-3 text-sm">
            <Crown size={16} className="mt-0.5 flex-shrink-0 text-amber-600" />
            <p className="text-amber-900">
              {t("voice.benefit_2", {
                defaultValue: "Tezroq javob va prioritet",
              })}
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
          >
            {loading ? (
              <Loader2 size={16} className="mr-2 animate-spin" />
            ) : (
              <Crown size={16} className="mr-2" />
            )}
            {user?._id
              ? t("voice.upgrade_button", {
                  defaultValue: "Premium olish",
                })
              : t("voice.login_first", {
                  defaultValue: "Tizimga kirish",
                })}
          </Button>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="w-full"
          >
            {t("common.close", { defaultValue: "Yopish" })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

