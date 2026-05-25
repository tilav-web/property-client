/**
 * @deprecated premium.service.ts'ga ko'chirilgan. Eski importlar ishlashi
 * uchun re-export qoldirilgan. Yangi kodda premiumService ishlatish kerak.
 */
import { premiumService } from "./premium.service";

export type {
  VoiceQuotaState,
  VoiceQuotaError,
  PremiumUpgradeResult as VoiceUpgradeResult,
} from "./premium.service";
export { isVoiceQuotaError } from "./premium.service";

/** Backwards compat: eski VoicePremiumService API. */
export const voicePremiumService = {
  getStatus: () => premiumService.getVoiceStatus(),
  startUpgrade: () => premiumService.startUpgrade(),
};
