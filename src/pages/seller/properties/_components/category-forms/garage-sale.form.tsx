import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Maximize, Landmark } from "lucide-react";
import { cn } from "@/lib/utils";

export interface GarageSaleFormData {
  area: number | string;
  has_pit: boolean;
  has_electricity: boolean;
  is_heated: boolean;
  mortgage_available: boolean;
}

interface Props {
  data: GarageSaleFormData;
  setData: (data: GarageSaleFormData) => void;
  isSubmitting?: boolean;
}

const defaultFormData: GarageSaleFormData = {
  area: "",
  has_pit: false,
  has_electricity: false,
  is_heated: false,
  mortgage_available: false,
};

const FEATURE_OPTIONS = [
  { key: "has_pit" as const, label: "🔧 Ko'rikxona (smotrovaya)" },
  { key: "has_electricity" as const, label: "⚡ Elektr" },
  { key: "is_heated" as const, label: "🌡️ Isitish" },
];

export default function GarageSaleForm({ data, setData, isSubmitting = false }: Props) {
  const { t } = useTranslation();
  const formData = { ...defaultFormData, ...data };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>
          {t("property_form.garage_sale.title", { defaultValue: "Garaj sotish — tafsilotlar" })}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="max-w-xs">
          <Label htmlFor="garage_area" className="flex items-center gap-1.5 text-xs mb-1.5">
            <Maximize size={14} />
            {t("property_form.area", { defaultValue: "Maydon (m²)" })}
          </Label>
          <Input
            id="garage_area"
            type="number"
            min="0"
            step="0.1"
            value={formData.area}
            onChange={(e) => setData({ ...formData, area: e.target.value === "" ? "" : Number(e.target.value) })}
            placeholder="25"
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold">
            {t("property_form.features", { defaultValue: "Xususiyatlar" })}
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {FEATURE_OPTIONS.map(({ key, label }) => (
              <label
                key={key}
                htmlFor={`sale_${key}`}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-lg border p-3 transition-colors",
                  formData[key] ? "border-indigo-500 bg-indigo-50" : "border-border/60 bg-white hover:bg-gray-50",
                )}
              >
                <Checkbox
                  id={`sale_${key}`}
                  checked={formData[key]}
                  onCheckedChange={(v) => setData({ ...formData, [key]: v as boolean })}
                  disabled={isSubmitting}
                />
                <span className="text-sm font-medium">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <label
          htmlFor="garage_mortgage"
          className={cn(
            "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors",
            formData.mortgage_available ? "border-indigo-500 bg-indigo-50" : "border-border/60 bg-white hover:bg-gray-50",
          )}
        >
          <Checkbox
            id="garage_mortgage"
            checked={formData.mortgage_available}
            onCheckedChange={(v) => setData({ ...formData, mortgage_available: v as boolean })}
            disabled={isSubmitting}
          />
          <Landmark size={16} />
          <span className="text-sm font-medium">
            {t("property_form.mortgage_available", { defaultValue: "Ipoteka mavjud" })}
          </span>
        </label>
      </CardContent>
    </Card>
  );
}
