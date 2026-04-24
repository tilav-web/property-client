import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MessageSquare, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { chatService } from "@/services/chat.service";
import { useUserStore } from "@/stores/user.store";
import { useUiStore } from "@/stores/ui.store";

interface Props {
  sellerId: string;
  propertyId?: string;
  variant?: "default" | "outline" | "secondary" | "ghost";
  className?: string;
  compact?: boolean;
}

export default function MessageSellerButton({
  sellerId,
  propertyId,
  variant = "outline",
  className,
  compact = false,
}: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useUserStore((s) => s.user);
  const { openLoginDialog } = useUiStore();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!user?._id) {
      openLoginDialog();
      return;
    }
    if (user._id === sellerId) {
      toast.error(
        t("common.buttons.message_seller.self_error", {
          defaultValue: "O‘z e’loningizga xabar yoza olmaysiz",
        }),
      );
      return;
    }
    setLoading(true);
    try {
      const conv = await chatService.openConversation({
        peerUserId: sellerId,
        propertyId,
      });
      navigate(`/messages?c=${conv._id}`);
    } catch (err) {
      console.error("open chat failed:", err);
      toast.error(
        t("common.buttons.message_seller.error", {
          defaultValue: "Suhbatni ochib bo‘lmadi",
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      onClick={handleClick}
      disabled={loading}
      className={className}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <MessageSquare size={16} />
      )}
      {!compact && (
        <span className="ml-2">
          {t("common.buttons.message_seller.label", {
            defaultValue: "Sotuvchiga yozish",
          })}
        </span>
      )}
    </Button>
  );
}
