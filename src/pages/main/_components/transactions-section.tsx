import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { propertyService } from "@/services/property.service";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, BarChart3, Search, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface TransactionStats {
  newRentals: { avgPrice: number; count: number };
  sales: { avgPrice: number; count: number };
  totalTransactions: number;
  growthPercent: number;
}

function formatNumber(num: number): string {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toLocaleString();
}

export default function TransactionsSection() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"rented" | "sold">("rented");
  const [search, setSearch] = useState("");

  const { data: stats, isLoading } = useQuery<TransactionStats>({
    queryKey: ["transaction-stats"],
    queryFn: propertyService.getTransactionStats,
    staleTime: 10 * 60 * 1000,
  });

  const rentAvg = stats?.newRentals.avgPrice ?? 0;
  const saleAvg = stats?.sales.avgPrice ?? 0;
  const totalTx = stats?.totalTransactions ?? 0;
  const growth = stats?.growthPercent ?? 0;

  const showAvg = activeTab === "rented" ? rentAvg : saleAvg;

  return (
    <section className="py-12">
      <div className="rounded-3xl bg-accent/40 p-4 sm:p-6">
        <div className="grid grid-cols-1 gap-8 rounded-2xl border border-border/50 bg-card p-6 sm:p-10 lg:grid-cols-2">
          {/* Left side */}
          <div className="flex flex-col">
            {/* Stylized chart icon */}
            <div className="mb-6 flex size-20 items-end gap-1">
              <div className="h-10 w-3.5 rounded-t-md bg-violet-300" />
              <div className="h-16 w-3.5 rounded-t-md bg-emerald-300" />
              <div className="h-7 w-3.5 rounded-t-md bg-primary" />
              <div className="relative h-12 w-3.5 rounded-t-md bg-rose-300">
                <span className="absolute -right-1.5 -top-3 text-xs font-bold text-rose-500">
                  %
                </span>
              </div>
            </div>

            <h2 className="font-display text-3xl text-foreground sm:text-4xl">
              {t(
                "pages.main_page.transactions.title",
                "Browse property transactions",
              )}
            </h2>
            <p className="mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
              {t(
                "pages.main_page.transactions.subtitle",
                "Powered by Qashqadaryo property transaction data for your area.",
              )}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link to="/search">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full border-foreground/15 bg-card font-semibold"
                >
                  {t("pages.main_page.transactions.start_searching", "Start searching")}
                </Button>
              </Link>
              <Link
                to="/search"
                className="inline-flex items-center gap-1 text-sm font-semibold text-primary underline-offset-2 hover:underline"
              >
                {t("pages.main_page.transactions.view_all", "View all transactions")}
                <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </div>

          {/* Right side — tabs + search + stats */}
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="inline-flex flex-shrink-0 rounded-full border border-border bg-background p-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("rented")}
                  className={cn(
                    "rounded-full px-5 py-1.5 text-sm font-semibold transition-colors",
                    activeTab === "rented"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t("pages.main_page.transactions.rented", "Rented")}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("sold")}
                  className={cn(
                    "rounded-full px-5 py-1.5 text-sm font-semibold transition-colors",
                    activeTab === "sold"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t("pages.main_page.transactions.sold", "Sold")}
                </button>
              </div>

              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t(
                    "pages.main_page.transactions.search_placeholder",
                    "Search any location in Qashqadaryo",
                  )}
                  className="rounded-full pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <StatCard
                label={
                  activeTab === "rented"
                    ? t("pages.main_page.transactions.new_rentals", "New rentals")
                    : t("pages.main_page.transactions.new_sales", "New sales")
                }
                value={
                  isLoading
                    ? null
                    : `${showAvg.toLocaleString()} ${stats?.newRentals?.avgPrice ? "so'm" : ""}`
                }
              />
              <StatCard
                label={t(
                  "pages.main_page.transactions.renewed",
                  "Renewed rentals",
                )}
                value={isLoading ? null : `${rentAvg.toLocaleString()} so'm`}
              />
              <StatCard
                label={t("pages.main_page.transactions.total", "Transactions")}
                value={isLoading ? null : formatNumber(totalTx)}
                badge={
                  growth !== 0 ? (
                    <span
                      className={cn(
                        "inline-flex items-center gap-0.5 rounded-full bg-card px-1.5 py-0.5 text-[11px] font-semibold",
                        growth > 0 ? "text-emerald-600" : "text-rose-500",
                      )}
                    >
                      {growth > 0 ? "+" : ""}
                      {growth}%
                      <TrendingUp
                        className={cn(
                          "size-3",
                          growth < 0 && "rotate-180",
                        )}
                      />
                    </span>
                  ) : null
                }
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  badge,
}: Readonly<{
  label: string;
  value: string | null;
  badge?: React.ReactNode;
}>) {
  return (
    <div className="rounded-2xl bg-accent/50 p-4 text-center">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      {value === null ? (
        <div className="mx-auto mt-2 h-6 w-24 animate-pulse rounded bg-muted/60" />
      ) : (
        <p className="mt-1 font-display text-xl font-semibold text-foreground sm:text-2xl">
          {value}
        </p>
      )}
      {badge && <div className="mt-1 flex justify-center">{badge}</div>}

      {/* Tiny bar chart hint icon */}
      <BarChart3 className="mx-auto mt-2 size-4 text-foreground/20" />
    </div>
  );
}
