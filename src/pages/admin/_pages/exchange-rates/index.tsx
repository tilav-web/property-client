import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { AlertTriangle, Coins, Loader2 } from "lucide-react";
import {
  CURRENCIES,
  CurrencyCode,
  SUPPORTED_CURRENCIES,
} from "@/constants/currencies";
import { adminExchangeRateService } from "../../_services/admin-exchange-rate.service";

const STALE_DAYS = 3;

function daysSince(dateStr?: string): number | null {
  if (!dateStr) return null;
  const ts = new Date(dateStr).getTime();
  if (Number.isNaN(ts)) return null;
  return Math.floor((Date.now() - ts) / (24 * 60 * 60 * 1000));
}

export default function AdminExchangeRatesPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-exchange-rates"],
    queryFn: () => adminExchangeRateService.get(),
  });

  const [rates, setRates] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (data?.rates) {
      const next: Record<string, string> = {};
      for (const code of SUPPORTED_CURRENCIES) {
        const v = data.rates[code as CurrencyCode];
        next[code] = v !== undefined ? String(v) : "";
      }
      setRates(next);
      setNotes(data.notes ?? "");
    }
  }, [data]);

  const ageDays = useMemo(() => daysSince(data?.updatedAt), [data?.updatedAt]);
  const isStale = ageDays !== null && ageDays >= STALE_DAYS;
  const base = data?.base ?? CurrencyCode.USD;

  const updateMutation = useMutation({
    mutationFn: (payload: {
      rates: Partial<Record<CurrencyCode, number>>;
      notes?: string;
    }) => adminExchangeRateService.update(payload),
    onSuccess: () => {
      toast.success("Kurslar saqlandi");
      queryClient.invalidateQueries({ queryKey: ["admin-exchange-rates"] });
      queryClient.invalidateQueries({ queryKey: ["exchange-rates"] });
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Saqlashda xatolik";
      toast.error(msg);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsed: Partial<Record<CurrencyCode, number>> = {};
    for (const code of SUPPORTED_CURRENCIES) {
      const raw = rates[code]?.trim();
      if (!raw) continue;
      const n = Number(raw);
      if (!isFinite(n) || n <= 0) {
        toast.error(`${code}: musbat raqam kiriting`);
        return;
      }
      parsed[code as CurrencyCode] = n;
    }

    updateMutation.mutate({ rates: parsed, notes });
  };

  if (isLoading) {
    return <div className="p-6 text-gray-500">Yuklanmoqda...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center gap-3">
        <Coins className="h-6 w-6 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Valyuta kurslari
          </h1>
          <p className="text-sm text-gray-500">
            Bazaviy valyuta: <span className="font-semibold">{base}</span>.
            Kurslar 1 {base} = X {`{valyuta}`} ko'rinishida saqlanadi.
          </p>
        </div>
      </div>

      {data?.updatedAt && (
        <div
          className={`mb-4 flex items-center gap-3 rounded-xl border p-4 ${
            isStale
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {isStale ? (
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          ) : (
            <Coins className="h-5 w-5 flex-shrink-0" />
          )}
          <div className="text-sm">
            <p className="font-medium">
              Oxirgi yangilanish:{" "}
              {new Date(data.updatedAt).toLocaleString("uz-UZ")}
            </p>
            <p>
              {ageDays === 0
                ? "Bugun yangilangan"
                : `${ageDays} kun oldin`}
              {isStale && " — yangilashni tavsiya qilamiz"}
            </p>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl space-y-5 rounded-2xl border border-gray-200 bg-white p-6"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {SUPPORTED_CURRENCIES.map((code) => {
            const meta = CURRENCIES[code as CurrencyCode];
            const isBase = code === base;
            return (
              <div key={code}>
                <Label className="mb-1 flex items-center gap-2">
                  <span className="font-bold">{meta.code}</span>
                  <span className="text-xs text-gray-500">{meta.name}</span>
                  {isBase && (
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                      base
                    </span>
                  )}
                </Label>
                <div className="flex items-center gap-2">
                  <span className="whitespace-nowrap text-sm text-gray-500">
                    1 {base} =
                  </span>
                  <Input
                    type="number"
                    step="any"
                    min="0"
                    value={rates[code] ?? ""}
                    disabled={isBase}
                    onChange={(e) =>
                      setRates((s) => ({ ...s, [code]: e.target.value }))
                    }
                    placeholder="0"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {meta.symbol}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div>
          <Label>Izoh (ixtiyoriy)</Label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={500}
            placeholder="Masalan: bank kursi + 1% markup"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={updateMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {updateMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Saqlash
          </Button>
        </div>
      </form>
    </div>
  );
}
