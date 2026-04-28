import { publicApi } from "@/lib/api-instance";
import type { CurrencyCode } from "@/constants/currencies";

export interface IExchangeRate {
  base: CurrencyCode;
  rates: Partial<Record<CurrencyCode, number>>;
  notes?: string;
  updated_by?: string;
  createdAt?: string;
  updatedAt?: string;
}

class ExchangeRateService {
  async get() {
    const res = await publicApi.get<IExchangeRate>("/exchange-rates");
    return res.data;
  }
}

export const exchangeRateService = new ExchangeRateService();
