import { adminApi, publicApi } from "@/lib/api-instance";
import type { CurrencyCode } from "@/constants/currencies";

export interface IExchangeRate {
  _id?: string;
  base: CurrencyCode;
  rates: Partial<Record<CurrencyCode, number>>;
  notes?: string;
  updated_by?: string | { _id: string; first_name?: string; last_name?: string };
  createdAt?: string;
  updatedAt?: string;
}

interface UpdatePayload {
  rates?: Partial<Record<CurrencyCode, number>>;
  notes?: string;
}

class AdminExchangeRateService {
  async get() {
    const { data } = await publicApi.get<IExchangeRate>("/exchange-rates");
    return data;
  }

  async update(payload: UpdatePayload) {
    const { data } = await adminApi.patch<IExchangeRate>(
      "/exchange-rates",
      payload,
    );
    return data;
  }
}

export const adminExchangeRateService = new AdminExchangeRateService();
