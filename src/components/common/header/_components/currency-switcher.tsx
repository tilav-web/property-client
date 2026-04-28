import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, DollarSign } from "lucide-react";
import {
  CURRENCIES,
  CurrencyCode,
  SUPPORTED_CURRENCIES,
} from "@/constants/currencies";
import { useCurrencyStore } from "@/stores/currency.store";

export default function CurrencySwitcher() {
  const { display, setDisplay } = useCurrencyStore();
  const meta = CURRENCIES[display];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1"
          aria-label="Select currency"
        >
          <DollarSign className="h-4 w-4" />
          <span className="text-sm font-medium hidden sm:inline">
            {meta.code}
          </span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44 select-none">
        {SUPPORTED_CURRENCIES.map((code) => {
          const c = CURRENCIES[code as CurrencyCode];
          return (
            <DropdownMenuItem
              key={code}
              onClick={() => setDisplay(code as CurrencyCode)}
              className="flex items-center justify-between gap-2 select-none"
            >
              <span className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    code === display ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
                <span className="font-medium">{c.code}</span>
                <span className="text-xs text-gray-500">{c.symbol}</span>
              </span>
              <span className="text-xs text-gray-400 truncate max-w-[6rem]">
                {c.name}
              </span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
