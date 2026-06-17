import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Maximize, Landmark } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LandSaleFormData {
  area: number | string;
  land_type: "RESIDENTIAL" | "COMMERCIAL" | "AGRICULTURAL" | "";
  is_electricity: boolean;
  is_water: boolean;
  is_gas: boolean;
  road_access: boolean;
  mortgage_available: boolean;
}

interface Props {
  data: LandSaleFormData;
  setData: (data: LandSaleFormData) => void;
  isSubmitting?: boolean;
}

const defaultFormData: LandSaleFormData = {
  area: "",
  land_type: "",
  is_electricity: false,
  is_water: false,
  is_gas: false,
  road_access: false,
  mortgage_available: false,
};

const UTILITY_OPTIONS = [
  { key: "is_electricity" as const, label: "⚡ Elektr" },
  { key: "is_water" as const, label: "💧 Suv" },
  { key: "is_gas" as const, label: "🔥 Gaz" },
  { key: "road_access" as const, label: "🛣️ Yo'l" },
];

export default function LandSaleForm({ data, setData, isSubmitting = false }: Props) {
  const { t } = useTranslation();
  const formData = { ...defaultFormData, ...data };

  const landTypes = [
    { value: "RESIDENTIAL" as const, label: t("property_form.land_type.residential", { defaultValue: "Turar-joy uchun" }) },
    { value: "COMMERCIAL" as const, label: t("property_form.land_type.commercial", { defaultValue: "Tijorat uchun" }) },
    { value: "AGRICULTURAL" as const, label: t("property_form.land_type.agricultural", { defaultValue: "Qishloq xo'jaligi" }) },
  ];

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>
          {t("property_form.land_sale.title", { defaultValue: "Yer sotish — tafsilotlar" })}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="area" className="flex items-center gap-1.5 text-xs">
              <Maximize size={14} />
              {t("property_form.area", { defaultValue: "Maydon (m²)" })}
            </Label>
            <Input
              id="area"
              type="number"
              min="0"
              step="0.1"
              value={formData.area}
              onChange={(e) => setData({ ...formData, area: e.target.value === "" ? "" : Number(e.target.value) })}
              placeholder="500"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">
              {t("property_form.land_type.label", { defaultValue: "Yer turi" })}
            </Label>
            <Select
              value={formData.land_type}
              onValueChange={(v) => setData({ ...formData, land_type: v as LandSaleFormData["land_type"] })}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("property_form.select", { defaultValue: "Tanlang" })} />
              </SelectTrigger>
              <SelectContent>
                {landTypes.map((lt) => (
                  <SelectItem key={lt.value} value={lt.value}>{lt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold">
            {t("property_form.utilities", { defaultValue: "Kommunikatsiyalar" })}
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {UTILITY_OPTIONS.map(({ key, label }) => (
              <label
                key={key}
                htmlFor={key}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-lg border p-3 transition-colors",
                  formData[key] ? "border-indigo-500 bg-indigo-50" : "border-border/60 bg-white hover:bg-gray-50",
                )}
              >
                <Checkbox
                  id={key}
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
          htmlFor="mortgage_available"
          className={cn(
            "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors",
            formData.mortgage_available ? "border-indigo-500 bg-indigo-50" : "border-border/60 bg-white hover:bg-gray-50",
          )}
        >
          <Checkbox
            id="mortgage_available"
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
