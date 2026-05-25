import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Building2, Crown, Mic, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { premiumService } from "@/services/premium.service";
import PremiumModal from "./premium-modal";

function formatUntil(iso: string, locale: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function daysLeft(iso: string): number {
  const ms = new Date(iso).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / 86_400_000));
}

export default function PremiumStatusCard() {
  const { t, i18n } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);

  const { data: status } = useQuery({
    queryKey: ["premium-status"],
    queryFn: () => premiumService.getStatus(),
    staleTime: 60_000,
  });

  const { data: config } = useQuery({
    queryKey: ["premium-config"],
    queryFn: () => premiumService.getConfig(),
    staleTime: 5 * 60_000,
  });

  const isPremium = status?.isPremium === true;

  if (isPremium && status?.until) {
    return (
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-5 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-sm">
            <Crown size={22} />
          </div>
          <div>
            <h3 className="font-semibold text-amber-900">
              {t("premium.card.active_title", {
                defaultValue: "Premium faol",
              })}
            </h3>
            <p className="mt-0.5 text-sm text-amber-800">
              {t("premium.card.active_until", {
                defaultValue: "{{count}} kun qoldi — {{date}} gacha amal qiladi",
                count: daysLeft(status.until),
                date: formatUntil(status.until, i18n.language),
              })}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-sm">
            <Crown size={22} />
          </div>
          <div>
            <h3 className="font-semibold text-amber-900">
              {t("premium.card.title", {
                defaultValue: "Premium obuna",
              })}
            </h3>
            <p className="mt-0.5 text-sm text-amber-800">
              {config
                ? t("premium.card.subtitle_with_price", {
                    defaultValue:
                      "{{price}} {{currency}} / {{days}} kun — cheksiz Voice AI, cheksiz property, TOP chegirma",
                    price: config.premiumPrice.toLocaleString(i18n.language),
                    currency: config.currency,
                    days: config.premiumDurationDays,
                  })
                : t("premium.card.subtitle", {
                    defaultValue:
                      "Cheksiz Voice AI, cheksiz property yaratish va TOP chegirma",
                  })}
            </p>
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-amber-900/80">
              <span className="inline-flex items-center gap-1">
                <Mic size={12} /> Voice
              </span>
              <span className="inline-flex items-center gap-1">
                <Building2 size={12} /> Properties
              </span>
              <span className="inline-flex items-center gap-1">
                <Sparkles size={12} /> TOP discount
              </span>
            </div>
          </div>
        </div>
        <Button
          onClick={() => setModalOpen(true)}
          className="self-stretch bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 md:self-auto"
        >
          <Crown size={16} className="mr-2" />
          {t("premium.card.buy", { defaultValue: "Premium ol" })}
        </Button>
      </div>

      <PremiumModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        kind="info"
      />
    </>
  );
}
