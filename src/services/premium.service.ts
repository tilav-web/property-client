import apiInstance, { publicApi } from "@/lib/api-instance";

const BASE = "/premium";

export interface VoiceQuotaState {
  isPremium: boolean;
  premiumUntil: string | null;
  dailyFreeLimit: number;
  usedToday: number;
  remainingToday: number;
  canSend: boolean;
}

export interface PropertyLimitState {
  isPremium: boolean;
  premiumUntil: string | null;
  freeLimit: number;
  currentCount: number;
  canCreate: boolean;
}

export interface PremiumStatus {
  isPremium: boolean;
  until: string | null;
}

export interface PremiumConfig {
  voiceDailyFreeLimit: number;
  freePropertyLimit: number;
  premiumPrice: number;
  premiumDurationDays: number;
  propertyPremiumDiscountPercent: number;
  currency: string;
}

export interface PremiumUpgradeResult {
  transactionId: string;
  amount: number;
  currency: string;
  durationDays: number;
  checkoutUrl: string;
  provider: string;
}

class PremiumService {
  async getVoiceStatus(): Promise<VoiceQuotaState> {
    const res = await publicApi.get<VoiceQuotaState>(`${BASE}/voice/status`);
    return res.data;
  }

  async getPropertyStatus(): Promise<PropertyLimitState> {
    const res = await apiInstance.get<PropertyLimitState>(
      `${BASE}/property/status`,
    );
    return res.data;
  }

  async getStatus(): Promise<PremiumStatus> {
    const res = await apiInstance.get<PremiumStatus>(`${BASE}/status`);
    return res.data;
  }

  async getConfig(): Promise<PremiumConfig> {
    const res = await publicApi.get<PremiumConfig>(`${BASE}/config`);
    return res.data;
  }

  async startUpgrade(): Promise<PremiumUpgradeResult> {
    const res = await apiInstance.post<PremiumUpgradeResult>(
      `${BASE}/upgrade`,
    );
    return res.data;
  }
}

export const premiumService = new PremiumService();

/** 402 javobi (voice quota tugadi). */
export interface VoiceQuotaError {
  statusCode: number;
  error: "voice_quota_exceeded";
  message: string;
  dailyLimit: number;
  usedToday: number;
}

/** 402 javobi (property limit tugadi). */
export interface PropertyLimitError {
  statusCode: number;
  error: "property_limit_exceeded";
  message: string;
  freeLimit: number;
  currentCount: number;
}

export function isVoiceQuotaError(data: unknown): data is VoiceQuotaError {
  return (
    typeof data === "object" &&
    data !== null &&
    (data as VoiceQuotaError).error === "voice_quota_exceeded"
  );
}

export function isPropertyLimitError(
  data: unknown,
): data is PropertyLimitError {
  return (
    typeof data === "object" &&
    data !== null &&
    (data as PropertyLimitError).error === "property_limit_exceeded"
  );
}
