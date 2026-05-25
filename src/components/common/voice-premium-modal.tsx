/**
 * @deprecated premium-modal.tsx ga ko'chirilgan. Eski importlar uchun shim.
 * Yangi kodda PremiumModal ishlatish kerak.
 */
import PremiumModal from "./premium-modal";

interface Props {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly dailyLimit?: number;
  readonly usedToday?: number;
}

export default function VoicePremiumModal({
  open,
  onOpenChange,
  dailyLimit,
  usedToday,
}: Props) {
  return (
    <PremiumModal
      open={open}
      onOpenChange={onOpenChange}
      kind="voice"
      limit={dailyLimit}
      current={usedToday}
    />
  );
}
