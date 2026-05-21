import apiInstance, { publicApi } from "@/lib/api-instance";

const BASE = "/voice-premium";

export interface VoiceQuotaState {
  isPremium: boolean;
  premiumUntil: string | null;
  dailyFreeLimit: number;
  usedToday: number;
  /** number.POSITIVE_INFINITY uchun null kelishi mumkin server tomonida */
  remainingToday: number;
  canSend: boolean;
}

export interface VoiceUpgradeResult {
  transactionId: string;
  amount: number;
  currency: string;
  durationDays: number;
  checkoutUrl: string;
  provider: string;
}

class VoicePremiumService {
  /**
   * Anonim user uchun ham, auth uchun ham ishlatiladi.
   * Server cookie/Authorization orqali user'ni aniqlaydi.
   */
  async getStatus(): Promise<VoiceQuotaState> {
    const res = await publicApi.get<VoiceQuotaState>(`${BASE}/status`);
    return res.data;
  }

  /** Faqat auth user — Payme checkout URL qaytaradi. */
  async startUpgrade(): Promise<VoiceUpgradeResult> {
    const res = await apiInstance.post<VoiceUpgradeResult>(`${BASE}/upgrade`);
    return res.data;
  }
}

export const voicePremiumService = new VoicePremiumService();

/**
 * 402 javobi quyidagi struktura bilan keladi:
 *   { statusCode: 402, error: 'voice_quota_exceeded', message, dailyLimit, usedToday }
 */
export interface VoiceQuotaError {
  statusCode: number;
  error: string;
  message: string;
  dailyLimit: number;
  usedToday: number;
}

export function isVoiceQuotaError(data: unknown): data is VoiceQuotaError {
  return (
    typeof data === "object" &&
    data !== null &&
    (data as VoiceQuotaError).error === "voice_quota_exceeded"
  );
}
