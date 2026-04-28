import { useCurrencyStore } from "@/stores/currency.store";
import { useExchangeRates } from "@/hooks/use-exchange-rates";
import { convertPrice, formatPrice } from "@/utils/format-price";
import { cn } from "@/lib/utils";

interface PriceProps {
  amount: number | null | undefined;
  currency: string | null | undefined;
  className?: string;
  /** Asl (manba) narxni kichik matnda ko'rsatish (default: true) */
  showOriginal?: boolean;
  /** Bo'sh qiymat uchun fallback */
  fallback?: string;
  originalClassName?: string;
}

export default function Price({
  amount,
  currency,
  className,
  showOriginal = true,
  fallback = "—",
  originalClassName,
}: PriceProps) {
  const { display } = useCurrencyStore();
  const { data: rates } = useExchangeRates();

  if (amount === null || amount === undefined || Number.isNaN(amount)) {
    return <span className={className}>{fallback}</span>;
  }

  const sourceCurrency = currency ?? display;
  const sourceUpper = sourceCurrency.toUpperCase();
  const isSameCurrency = sourceUpper === display;

  const converted = isSameCurrency
    ? amount
    : convertPrice(amount, sourceUpper, display, rates?.rates);

  const ratesAvailable =
    !!rates?.rates && rates.rates[sourceUpper] && rates.rates[display];

  // Konvertatsiya muvaffaqiyatsiz bo'lsa, asl narxni asosiy ko'rsatamiz
  const useConverted = isSameCurrency || ratesAvailable;

  return (
    <span className={cn("inline-flex flex-col", className)}>
      <span className="font-semibold">
        {useConverted ? formatPrice(converted, display) : formatPrice(amount, sourceUpper)}
      </span>
      {showOriginal && !isSameCurrency && useConverted && (
        <span
          className={cn(
            "text-xs text-gray-500 font-normal",
            originalClassName,
          )}
        >
          ~ {formatPrice(amount, sourceUpper)}
        </span>
      )}
    </span>
  );
}
