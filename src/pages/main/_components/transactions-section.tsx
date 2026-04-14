import { Button } from "@/components/ui/button";
import { propertyService } from "@/services/property.service";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart3,
  Building2,
  TrendingUp,
  ArrowUpRight,
  Search,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

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

function formatPrice(price: number): string {
  return price.toLocaleString();
}

export default function TransactionsSection() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"rented" | "sold">("rented");

  const { data: stats, isLoading } = useQuery<TransactionStats>({
    queryKey: ["transaction-stats"],
    queryFn: propertyService.getTransactionStats,
    staleTime: 10 * 60 * 1000,
  });

  const rentAvg = stats?.newRentals.avgPrice ?? 0;
  const saleAvg = stats?.sales.avgPrice ?? 0;
  const totalTx = stats?.totalTransactions ?? 0;
  const growth = stats?.growthPercent ?? 0;

  return (
    <section className="py-10 [content-visibility:auto] [contain-intrinsic-size:1px_400px]">
      <div className="rounded-2xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white p-6 shadow-sm md:p-10">
        <div className="grid items-center gap-8 md:grid-cols-2">
          {/* Left side */}
          <div>
            {/* Icon */}
            <div className="mb-6 flex h-20 w-20 items-center justify-center">
              <div className="relative">
                <div className="flex h-16 w-14 items-end gap-1">
                  <div className="h-8 w-3 rounded-t bg-purple-400" />
                  <div className="h-12 w-3 rounded-t bg-green-400" />
                  <div className="h-6 w-3 rounded-t bg-yellow-400" />
                  <div className="h-10 w-3 rounded-t bg-blue-400" />
                </div>
                <BarChart3
                  size={24}
                  className="absolute -right-2 -top-1 text-green-600"
                />
              </div>
            </div>

            <h2 className="mb-2 text-2xl font-bold text-gray-900 md:text-3xl">
              {t("pages.main_page.transactions.title")}
            </h2>
            <p className="mb-6 max-w-md text-sm text-gray-500">
              {t("pages.main_page.transactions.subtitle")}
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to="/search">
                <Button
                  variant="outline"
                  className="rounded-full px-6 font-medium"
                >
                  <Search size={16} className="mr-2" />
                  {t("pages.main_page.search_filters.find")}
                </Button>
              </Link>
              <Link to="/search">
                <Button
                  variant="link"
                  className="font-medium text-green-700 hover:text-green-800"
                >
                  {t("pages.main_page.featured_properties.view_all")}
                </Button>
              </Link>
            </div>
          </div>

          {/* Right side — stats cards */}
          <div>
            {/* Tabs */}
            <div className="mb-4 flex items-center gap-4">
              <div className="inline-flex rounded-full border bg-white p-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("rented")}
                  className={`rounded-full px-5 py-1.5 text-sm font-medium transition-colors ${
                    activeTab === "rented"
                      ? "bg-gray-900 text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {t("pages.main_page.search_tabs.rent")}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("sold")}
                  className={`rounded-full px-5 py-1.5 text-sm font-medium transition-colors ${
                    activeTab === "sold"
                      ? "bg-gray-900 text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {t("pages.main_page.search_tabs.buy")}
                </button>
              </div>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-3 gap-3">
              {/* New rentals / New sales */}
              <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 text-center">
                <div className="mb-1 flex items-center justify-center gap-1.5">
                  <Building2 size={14} className="text-gray-500" />
                  <p className="text-xs font-medium text-gray-600">
                    {activeTab === "rented"
                      ? t("pages.main_page.transactions.new_rentals")
                      : t("pages.main_page.transactions.new_sales")}
                  </p>
                </div>
                {isLoading ? (
                  <div className="mx-auto mt-2 h-6 w-20 animate-pulse rounded bg-blue-200" />
                ) : (
                  <p className="text-lg font-bold text-gray-900">
                    {formatPrice(activeTab === "rented" ? rentAvg : saleAvg)}
                  </p>
                )}
              </div>

              {/* Count */}
              <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 text-center">
                <div className="mb-1 flex items-center justify-center gap-1.5">
                  <Search size={14} className="text-gray-500" />
                  <p className="text-xs font-medium text-gray-600">
                    {t("pages.main_page.transactions.listings")}
                  </p>
                </div>
                {isLoading ? (
                  <div className="mx-auto mt-2 h-6 w-16 animate-pulse rounded bg-blue-200" />
                ) : (
                  <p className="text-lg font-bold text-gray-900">
                    {activeTab === "rented"
                      ? stats?.newRentals.count ?? 0
                      : stats?.sales.count ?? 0}
                  </p>
                )}
              </div>

              {/* Total transactions */}
              <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-4 text-center">
                <div className="mb-1 flex items-center justify-center gap-1.5">
                  <TrendingUp size={14} className="text-gray-500" />
                  <p className="text-xs font-medium text-gray-600">
                    {t("pages.main_page.transactions.total")}
                  </p>
                </div>
                {isLoading ? (
                  <div className="mx-auto mt-2 h-6 w-16 animate-pulse rounded bg-cyan-200" />
                ) : (
                  <>
                    <p className="text-lg font-bold text-gray-900">
                      {formatNumber(totalTx)}
                    </p>
                    {growth !== 0 && (
                      <p
                        className={`mt-0.5 flex items-center justify-center text-xs font-semibold ${
                          growth > 0 ? "text-green-600" : "text-red-500"
                        }`}
                      >
                        {growth > 0 ? "+" : ""}
                        {growth}%
                        <ArrowUpRight
                          size={12}
                          className={growth < 0 ? "rotate-90" : ""}
                        />
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
