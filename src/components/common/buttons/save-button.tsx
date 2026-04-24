import { useTranslation } from "react-i18next";
import { Bookmark } from "lucide-react";
import { toast } from "sonner";
import type { IProperty } from "@/interfaces/property/property.interface";
import { useSaveStore } from "@/stores/save.store";
import { useUserStore } from "@/stores/user.store";
import { useUiStore } from "@/stores/ui.store";
import { cn } from "@/lib/utils";

interface Props {
  property: IProperty;
  compact?: boolean;
}

export default function SaveButton({ property, compact = false }: Props) {
  const { t } = useTranslation();
  const { user } = useUserStore();
  const { openLoginDialog } = useUiStore();
  const { toggleSaveProperty, savedProperties } = useSaveStore();

  const isSaved = savedProperties.some(
    (item) => item?.property?._id === property?._id,
  );

  const handleClick = () => {
    if (!user?._id) {
      openLoginDialog();
      toast.message(
        t("common.buttons.property_actions.save_login_required", {
          defaultValue: "Log in to save",
        }),
      );
      return;
    }
    if (property?._id) toggleSaveProperty(property._id);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "bg-white flex items-center gap-2 px-3 py-2 rounded border border-black text-sm min-w-0 hover:bg-gray-50 transition-colors",
        isSaved && "bg-yellow-50",
      )}
      title={
        isSaved
          ? t("common.buttons.property_actions.unsave_hint", {
              defaultValue: "Remove from saved",
            })
          : t("common.buttons.property_actions.save_hint", {
              defaultValue: "Save",
            })
      }
    >
      <Bookmark
        className={cn(
          "w-4 h-4",
          isSaved && "fill-yellow-500 text-yellow-500",
        )}
      />
      {!compact && (
        <span className="hidden sm:inline">
          {isSaved
            ? t("common.buttons.property_actions.saved", {
                defaultValue: "Saved",
              })
            : t("common.buttons.property_actions.save", {
                defaultValue: "Save",
              })}
        </span>
      )}
    </button>
  );
}
