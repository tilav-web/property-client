import { useCurrencyStore } from "@/stores/currency.store";
import { useExchangeRates } from "@/hooks/use-exchange-rates";
import { convertPrice, formatPrice } from "@/utils/format-price";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import type { CurrencyCode } from "@/constants/currencies";

interface PriceProps {
  amount: number | null | undefined;
  currency: string | null | undefined;
  className?: string;
  /** Asl (manba) narxni "100$ → 1,225,000 so'm" ko'rinishida ko'rsatish (default: true) */
  showOriginal?: boolean;
  /** Bo'sh qiymat uchun fallback */
  fallback?: string;
  originalClassName?: string;
  /** "inline" (default) — asl → konvert. "stacked" — konvert ustida, asl pastida kichik matnda */
  layout?: "inline" | "stacked";
}

export default function Price({
  amount,
  currency,
  className,
  showOriginal = true,
  fallback = "—",
  originalClassName,
  layout = "inline",
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
    !!rates?.rates &&
    !!rates.rates[sourceUpper as CurrencyCode] &&
    !!rates.rates[display];

  const useConverted = isSameCurrency || ratesAvailable;

  const targetText = useConverted
    ? formatPrice(converted, display)
    : formatPrice(amount, sourceUpper);
  const sourceText = formatPrice(amount, sourceUpper);

  // Bir xil valyuta yoki kurs mavjud emas → faqat asl narx
  if (isSameCurrency || !ratesAvailable || !showOriginal) {
    return (
      <span className={cn("font-semibold", className)}>{targetText}</span>
    );
  }

  if (layout === "stacked") {
    return (
      <span className={cn("inline-flex flex-col", className)}>
        <span className="font-semibold">{targetText}</span>
        <span
          className={cn(
            "text-xs text-gray-500 font-normal",
            originalClassName,
          )}
        >
          ~ {sourceText}
        </span>
      </span>
    );
  }

  // inline (default): "100$ → 1,225,000 so'm"
  return (
    <span
      className={cn(
        "inline-flex flex-wrap items-baseline gap-1.5",
        className,
      )}
    >
      <span className={cn("text-gray-500 font-normal", originalClassName)}>
        {sourceText}
      </span>
      <ArrowRight
        size={14}
        className="text-gray-400 self-center"
        aria-hidden
      />
      <span className="font-semibold">{targetText}</span>
    </span>
  );
}
