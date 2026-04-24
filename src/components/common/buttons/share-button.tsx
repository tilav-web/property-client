import { useTranslation } from "react-i18next";
import { Share2 } from "lucide-react";
import { toast } from "sonner";
import type { IProperty } from "@/interfaces/property/property.interface";
import { serverUrl } from "@/utils/shared";

interface Props {
  property: IProperty;
  compact?: boolean;
}

export default function ShareButton({ property, compact = false }: Props) {
  const { t } = useTranslation();

  const handleShare = async () => {
    const url = `${serverUrl}/properties/share/${property?._id}`;
    if (navigator.share) {
      try {
        await navigator.share({ url });
        return;
      } catch {
        // user cancelled or share failed — fall through to copy
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success(
        t("common.buttons.property_actions.link_copied", {
          defaultValue: "Link copied",
        }),
      );
    } catch {
      // ignore
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="bg-white flex items-center gap-2 px-3 py-2 rounded border border-black text-sm min-w-0 hover:bg-gray-50 transition-colors"
      title={t("common.buttons.property_actions.share", {
        defaultValue: "Share",
      })}
    >
      <Share2 className="w-4 h-4" />
      {!compact && (
        <span className="hidden sm:inline">
          {t("common.buttons.property_actions.share", {
            defaultValue: "Share",
          })}
        </span>
      )}
    </button>
  );
}
