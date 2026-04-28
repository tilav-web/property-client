import { useQuery } from "@tanstack/react-query";
import {
  exchangeRateService,
  type IExchangeRate,
} from "@/services/exchange-rate.service";

export function useExchangeRates() {
  return useQuery<IExchangeRate>({
    queryKey: ["exchange-rates"],
    queryFn: () => exchangeRateService.get(),
    staleTime: 1000 * 60 * 60, // 1 soat
    gcTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false,
  });
}
