import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Building2, Crown, Loader2, Mic, Sparkles } from "lucide-react";
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
import { premiumService } from "@/services/premium.service";
import { useUserStore } from "@/stores/user.store";

export type PremiumModalKind = "voice" | "property" | "info";

interface Props {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  /** Qaysi limit tugagani — modal sarlavhasi va tafsiloti uchun */
  readonly kind: PremiumModalKind;
  /** 402 javobida kelgan limit (voice yoki property) */
  readonly limit?: number;
  /** 402 javobida kelgan ishlatilgan/joriy soni */
  readonly current?: number;
}

export default function PremiumModal({
  open,
  onOpenChange,
  kind,
  limit,
  current,
}: Props) {
  const { t } = useTranslation();
  const user = useUserStore((s) => s.user);
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    if (!user?._id) {
      toast.error(
        t("premium.upgrade_requires_login", {
          defaultValue: "Premium uchun avval tizimga kiring",
        }),
      );
      return;
    }
    setLoading(true);
    try {
      const res = await premiumService.startUpgrade();
      window.open(res.checkoutUrl, "_blank", "noopener,noreferrer");
      onOpenChange(false);
    } catch (err) {
      console.error("premium upgrade failed", err);
      toast.error(
        t("premium.upgrade_error", {
          defaultValue: "Premium so'rovi yuborilmadi, qayta urining",
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  let title: string;
  let description: string;
  if (kind === "voice") {
    title = t("premium.voice_limit_title", {
      defaultValue: "Voice limit tugadi",
    });
    description =
      limit !== undefined
        ? t("premium.voice_limit_desc_with_count", {
            defaultValue:
              "Bugun {{used}}/{{limit}} ovozli xabar ishlatildi. Cheksiz foydalanish uchun Premium oling.",
            used: current ?? limit,
            limit,
          })
        : t("premium.voice_limit_desc", {
            defaultValue:
              "Bepul kunlik limit tugadi. Cheksiz foydalanish uchun Premium oling.",
          });
  } else if (kind === "property") {
    title = t("premium.property_limit_title", {
      defaultValue: "Property limit tugadi",
    });
    description =
      limit !== undefined
        ? t("premium.property_limit_desc_with_count", {
            defaultValue:
              "Bepul tarifda {{limit}} ta property yaratish mumkin ({{current}} ta band). Ko'proq yaratish uchun Premium oling.",
            limit,
            current: current ?? limit,
          })
        : t("premium.property_limit_desc", {
            defaultValue:
              "Bepul property yaratish limiti tugadi. Cheksiz yaratish uchun Premium oling.",
          });
  } else {
    title = t("premium.info_title", { defaultValue: "Premium obuna" });
    description = t("premium.info_desc", {
      defaultValue:
        "Premium bilan cheksiz Voice AI, cheksiz property yaratish va TOP'ga chiqarishda chegirma olasiz.",
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white">
            <Crown size={24} />
          </div>
          <DialogTitle className="text-center">{title}</DialogTitle>
          <DialogDescription className="text-center">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2">
          <div className="flex items-start gap-3 rounded-lg bg-amber-50 p-3 text-sm">
            <Mic size={16} className="mt-0.5 flex-shrink-0 text-amber-600" />
            <p className="text-amber-900">
              {t("premium.benefit_voice", {
                defaultValue: "Cheksiz ovozli AI qidiruv",
              })}
            </p>
          </div>
          <div className="flex items-start gap-3 rounded-lg bg-amber-50 p-3 text-sm">
            <Building2
              size={16}
              className="mt-0.5 flex-shrink-0 text-amber-600"
            />
            <p className="text-amber-900">
              {t("premium.benefit_property", {
                defaultValue: "Cheksiz property yaratish",
              })}
            </p>
          </div>
          <div className="flex items-start gap-3 rounded-lg bg-amber-50 p-3 text-sm">
            <Sparkles
              size={16}
              className="mt-0.5 flex-shrink-0 text-amber-600"
            />
            <p className="text-amber-900">
              {t("premium.benefit_top_discount", {
                defaultValue: "Property TOP'ga chiqarishda chegirma",
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
              ? t("premium.upgrade_button", {
                  defaultValue: "Premium olish",
                })
              : t("premium.login_first", {
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
