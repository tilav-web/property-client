import { useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { ChevronDown, Home } from "lucide-react";

interface AreaPrice {
  area: string;
  rent: number; // RM / month
  buy: number; // RM
}

const AREAS: AreaPrice[] = [
  { area: "Mont Kiara", rent: 5800, buy: 1_650_000 },
  { area: "KLCC", rent: 7400, buy: 2_350_000 },
  { area: "Bangsar", rent: 5200, buy: 1_400_000 },
  { area: "Bukit Jalil", rent: 3100, buy: 850_000 },
  { area: "Cheras", rent: 2500, buy: 650_000 },
  { area: "Damansara", rent: 4200, buy: 1_180_000 },
  { area: "Subang Jaya", rent: 2900, buy: 720_000 },
  { area: "Putrajaya", rent: 2300, buy: 580_000 },
  { area: "Setapak", rent: 2100, buy: 520_000 },
];

const TYPES = ["Apartment", "Studio", "Condo", "Villa"] as const;
const BEDS = ["Studio", "1 Bed", "2 Beds", "3 Beds", "4+ Beds"] as const;

function formatCurrency(value: number) {
  if (value >= 1_000_000) return `RM ${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `RM ${(value / 1_000).toFixed(0)}k`;
  return `RM ${value.toLocaleString()}`;
}

export default function ComparePricesSection() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<"rent" | "buy">("rent");
  const [type, setType] = useState<(typeof TYPES)[number]>("Apartment");
  const [beds, setBeds] = useState<(typeof BEDS)[number]>("1 Bed");

  const sorted = [...AREAS].sort((a, b) =>
    mode === "rent" ? b.rent - a.rent : b.buy - a.buy,
  );
  const max = sorted[0]?.[mode] ?? 1;

  // 3 representative price tiers for the legend
  const top = sorted[0]?.[mode] ?? 0;
  const mid = sorted[Math.floor(sorted.length / 2)]?.[mode] ?? 0;
  const low = sorted[sorted.length - 1]?.[mode] ?? 0;

  return (
    <section className="py-12">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex size-12 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary">
          <Home className="size-6" />
        </div>
        <div>
          <h2 className="font-display text-3xl text-foreground sm:text-4xl">
            {t("pages.compare_prices.title", "Compare prices by area")}
          </h2>
          <p className="mt-1 text-muted-foreground">
            {t(
              "pages.compare_prices.subtitle",
              "Understand what your budget unlocks across different areas.",
            )}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-border/50 bg-accent/30">
        {/* Top bar — Rent/Buy toggle + filters */}
        <div className="flex flex-wrap items-center gap-3 border-b border-border/40 bg-card/60 p-4 sm:p-5">
          <div className="inline-flex flex-shrink-0 rounded-full border border-border bg-background p-1">
            <button
              type="button"
              onClick={() => setMode("rent")}
              className={cn(
                "rounded-full px-5 py-1.5 text-sm font-semibold transition-colors",
                mode === "rent"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t("common.rent", "Rent")}
            </button>
            <button
              type="button"
              onClick={() => setMode("buy")}
              className={cn(
                "rounded-full px-5 py-1.5 text-sm font-semibold transition-colors",
                mode === "buy"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t("common.buy", "Buy")}
            </button>
          </div>

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <FilterSelect value={type} onChange={(v) => setType(v as typeof type)} options={TYPES as readonly string[]} />
            <FilterSelect value={beds} onChange={(v) => setBeds(v as typeof beds)} options={BEDS as readonly string[]} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 p-5 sm:p-8 lg:grid-cols-[260px_1fr]">
          {/* Left — legend */}
          <div className="rounded-2xl border border-border/60 bg-card p-5">
            <p className="text-sm font-semibold text-foreground">
              {t("pages.compare_prices.legend_title", "Malaysia prices")}
            </p>
            <div className="mt-4 flex gap-3">
              <div className="flex h-32 w-2 flex-col overflow-hidden rounded-full">
                <div className="flex-1 bg-primary" />
                <div className="flex-1 bg-primary/70" />
                <div className="flex-1 bg-primary/40" />
                <div className="flex-1 bg-primary/20" />
              </div>
              <div className="flex flex-col justify-between text-xs text-foreground">
                <span className="font-semibold">
                  {formatCurrency(top)}
                  {mode === "rent" && (
                    <span className="text-muted-foreground">/mo</span>
                  )}
                </span>
                <span>
                  {formatCurrency(mid)}
                  {mode === "rent" && (
                    <span className="text-muted-foreground">/mo</span>
                  )}
                </span>
                <span className="text-muted-foreground">
                  {formatCurrency(low)}
                  {mode === "rent" && <span>/mo</span>}
                </span>
              </div>
            </div>
            <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
              {t(
                "pages.compare_prices.legend_note",
                "Average asking prices across Malaysia's most active neighborhoods.",
              )}
            </p>
          </div>

          {/* Right — bar chart of areas */}
          <div className="rounded-2xl border border-border/60 bg-card p-5">
            <ul className="space-y-3">
              {sorted.map((a) => {
                const value = a[mode];
                const widthPct = Math.max(8, (value / max) * 100);
                return (
                  <li
                    key={a.area}
                    className="flex items-center gap-3 text-sm"
                  >
                    <span className="w-28 flex-shrink-0 truncate font-medium text-foreground sm:w-32">
                      {a.area}
                    </span>
                    <div className="relative h-7 flex-1 overflow-hidden rounded-full bg-muted/60">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary/30 via-primary/60 to-primary"
                        style={{ width: `${widthPct}%` }}
                      />
                    </div>
                    <span className="w-24 flex-shrink-0 text-right text-xs font-semibold text-foreground sm:w-28 sm:text-sm">
                      {formatCurrency(value)}
                      {mode === "rent" && (
                        <span className="text-muted-foreground">/mo</span>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function FilterSelect({
  value,
  onChange,
  options,
}: Readonly<{
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
}>) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 cursor-pointer appearance-none rounded-full border border-border bg-card pl-4 pr-9 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}
