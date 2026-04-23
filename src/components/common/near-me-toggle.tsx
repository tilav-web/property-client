import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MapPin, Loader2, X, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useGeolocation } from "@/hooks/use-geolocation";

export const NEAR_ME_RADIUS_PRESETS = [5, 10, 30, 50, 120] as const;
export const DEFAULT_NEAR_ME_RADIUS = 30;

export interface NearMeState {
  enabled: boolean;
  radius: number;
  lat: number | null;
  lng: number | null;
}

interface Props {
  enabled: boolean;
  radius: number;
  onChange: (next: NearMeState) => void;
  className?: string;
}

export default function NearMeToggle({
  enabled,
  radius,
  onChange,
  className,
}: Props) {
  const { t } = useTranslation();
  const geo = useGeolocation();
  const [open, setOpen] = useState(false);

  const denied = geo.permission === "denied";
  const disabled = denied && !enabled;

  const enable = async (targetRadius: number) => {
    let coords: { lat: number; lng: number } | null = null;

    if (geo.lat !== null && geo.lng !== null) {
      coords = { lat: geo.lat, lng: geo.lng };
    } else {
      coords = await geo.request();
    }

    if (!coords) {
      toast.error(
        t("common.near_me.denied_title", {
          defaultValue: "Joylashuv aniqlanmadi",
        }),
        {
          description: t("common.near_me.denied_desc", {
            defaultValue:
              "Brauzer sozlamalarida GPS ruxsatini yoqib, qayta urinib ko'ring.",
          }),
        },
      );
      return;
    }

    onChange({
      enabled: true,
      radius: targetRadius,
      lat: coords.lat,
      lng: coords.lng,
    });
  };

  const disable = () => {
    onChange({
      enabled: false,
      radius,
      lat: geo.lat,
      lng: geo.lng,
    });
    setOpen(false);
  };

  const selectRadius = (r: number) => {
    if (enabled) {
      onChange({ enabled: true, radius: r, lat: geo.lat, lng: geo.lng });
    } else {
      enable(r);
    }
  };

  const chip = (
    <button
      type="button"
      disabled={disabled || geo.loading}
      className={cn(
        "flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm transition-colors",
        enabled
          ? "border-blue-500 bg-blue-50 font-medium text-blue-700"
          : "border-gray-200 bg-white text-gray-700 hover:border-gray-300",
        (disabled || geo.loading) && "cursor-not-allowed opacity-60",
        className,
      )}
    >
      {geo.loading ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        <MapPin size={14} />
      )}
      <span>
        {t("common.near_me.label", { defaultValue: "Near me" })}
        {enabled ? ` · ${radius} km` : ""}
      </span>
      {enabled ? (
        <X
          size={14}
          className="ml-0.5 text-blue-500 hover:text-blue-700"
          onClick={(e) => {
            e.stopPropagation();
            disable();
          }}
        />
      ) : (
        <ChevronDown size={14} className="text-gray-400" />
      )}
    </button>
  );

  const popover = (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{chip}</PopoverTrigger>
      <PopoverContent
        className="w-64 p-3"
        align="start"
        sideOffset={8}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="space-y-3">
          <div>
            <p className="text-sm font-semibold">
              {t("common.near_me.title", {
                defaultValue: "Yaqin atrofdan qidiruv",
              })}
            </p>
            <p className="mt-0.5 text-xs text-gray-500">
              {t("common.near_me.desc", {
                defaultValue:
                  "Joylashuvingiz bo'yicha eng yaqin uylar birinchi ko'rsatiladi.",
              })}
            </p>
          </div>
          <div>
            <p className="mb-2 text-xs font-medium text-gray-600">
              {t("common.near_me.radius", { defaultValue: "Radius" })}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {NEAR_ME_RADIUS_PRESETS.map((r) => {
                const active = enabled && radius === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      selectRadius(r);
                      setOpen(false);
                    }}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                      active
                        ? "border-blue-500 bg-blue-500 text-white"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300",
                    )}
                  >
                    {r} km
                  </button>
                );
              })}
            </div>
          </div>
          {enabled && (
            <button
              type="button"
              onClick={disable}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              {t("common.near_me.turn_off", {
                defaultValue: "O'chirish",
              })}
            </button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );

  if (disabled) {
    return (
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>{chip}</TooltipTrigger>
          <TooltipContent>
            {t("common.near_me.denied_tooltip", {
              defaultValue:
                "GPS ruxsati rad etilgan. Brauzer sozlamalaridan yoqing.",
            })}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return popover;
}
