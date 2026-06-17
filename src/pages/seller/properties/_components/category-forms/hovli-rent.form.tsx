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
import {
  BedDouble,
  Maximize,
  Building2,
  Hammer,
  Thermometer,
  Sofa,
  Check,
} from "lucide-react";
import type { RepairType } from "@/interfaces/types/repair.type";
import type { HeatingType } from "@/interfaces/types/heating.type";
import {
  amenitiesOptions,
  type AmenitiesType,
} from "@/interfaces/types/amenities.type";
import { cn } from "@/lib/utils";

export interface HovliRentFormData {
  rooms: number | string;
  area: number | string;
  land_area: number | string;
  floors: number | string;
  furnished: boolean;
  repair_type: RepairType | "";
  heating: HeatingType | "";
  amenities: AmenitiesType[];
  contract_duration_months: number | string;
}

interface Props {
  data: HovliRentFormData;
  setData: (data: HovliRentFormData) => void;
  isSubmitting?: boolean;
}

const defaultFormData: HovliRentFormData = {
  rooms: "",
  area: "",
  land_area: "",
  floors: "",
  furnished: false,
  repair_type: "",
  heating: "",
  amenities: [],
  contract_duration_months: 12,
};

const AMENITY_ICONS: Record<AmenitiesType, string> = {
  pool: "🏊", balcony: "🌇", security: "🛡️",
  air_conditioning: "❄️", parking: "🚗", elevator: "🛗",
};

export default function HovliRentForm({ data, setData, isSubmitting = false }: Props) {
  const { t } = useTranslation();
  const formData = { ...defaultFormData, ...data };

  const repairTypes = [
    { value: "NEW" as RepairType, label: t("property_form.repair.new", { defaultValue: "Yangi" }) },
    { value: "RENOVATED" as RepairType, label: t("property_form.repair.renovated", { defaultValue: "Ta'mirlangan" }) },
    { value: "OLD" as RepairType, label: t("property_form.repair.old", { defaultValue: "Eski" }) },
  ];

  const heatingTypes = [
    { value: "CENTRAL" as HeatingType, label: t("property_form.heating.central", { defaultValue: "Markaziy" }) },
    { value: "INDIVIDUAL" as HeatingType, label: t("property_form.heating.individual", { defaultValue: "Individual" }) },
    { value: "NONE" as HeatingType, label: t("property_form.heating.none", { defaultValue: "Yo'q" }) },
  ];

  const handleNumber = (key: keyof HovliRentFormData, v: string) =>
    setData({ ...formData, [key]: v === "" ? "" : Number(v) });

  const toggleAmenity = (a: AmenitiesType) => {
    const next = formData.amenities.includes(a)
      ? formData.amenities.filter((x) => x !== a)
      : [...formData.amenities, a];
    setData({ ...formData, amenities: next });
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>
          {t("property_form.hovli_rent.title", { defaultValue: "Hovli ijarasi — tafsilotlar" })}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { id: "rooms", label: t("property_form.rooms", { defaultValue: "Xonalar" }), icon: <BedDouble size={14} />, placeholder: "4" },
            { id: "area", label: t("property_form.area", { defaultValue: "Uy maydoni (m²)" }), icon: <Maximize size={14} />, placeholder: "120" },
            { id: "land_area", label: t("property_form.land_area", { defaultValue: "Yer maydoni (m²)" }), icon: <Maximize size={14} />, placeholder: "400" },
            { id: "floors", label: t("property_form.floors", { defaultValue: "Qavatlar" }), icon: <Building2 size={14} />, placeholder: "2" },
          ].map(({ id, label, icon, placeholder }) => (
            <div key={id} className="space-y-1.5">
              <Label htmlFor={`hr_${id}`} className="flex items-center gap-1.5 text-xs">
                {icon}{label}
              </Label>
              <Input
                id={`hr_${id}`}
                type="number"
                min="0"
                value={formData[id as keyof HovliRentFormData] as string | number}
                onChange={(e) => handleNumber(id as keyof HovliRentFormData, e.target.value)}
                placeholder={placeholder}
                disabled={isSubmitting}
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5 text-xs">
              <Hammer size={14} />
              {t("property_form.repair_type", { defaultValue: "Ta'mir turi" })}
            </Label>
            <Select value={formData.repair_type} onValueChange={(v) => setData({ ...formData, repair_type: v as RepairType })} disabled={isSubmitting}>
              <SelectTrigger><SelectValue placeholder={t("property_form.select", { defaultValue: "Tanlang" })} /></SelectTrigger>
              <SelectContent>{repairTypes.map((r) => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5 text-xs">
              <Thermometer size={14} />
              {t("property_form.heating_label", { defaultValue: "Isitish" })}
            </Label>
            <Select value={formData.heating} onValueChange={(v) => setData({ ...formData, heating: v as HeatingType })} disabled={isSubmitting}>
              <SelectTrigger><SelectValue placeholder={t("property_form.select", { defaultValue: "Tanlang" })} /></SelectTrigger>
              <SelectContent>{heatingTypes.map((h) => <SelectItem key={h.value} value={h.value}>{h.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">
              {t("property_form.contract_months", { defaultValue: "Shartnoma muddati (oy)" })}
            </Label>
            <Input
              type="number"
              min="1"
              value={formData.contract_duration_months}
              onChange={(e) => handleNumber("contract_duration_months", e.target.value)}
              placeholder="12"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="rounded-xl border bg-gradient-to-br from-indigo-50 to-purple-50 p-5">
          <Label className="mb-3 block text-base font-semibold">
            {t("property_form.amenities_title", { defaultValue: "Qulayliklar" })}
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
            {amenitiesOptions.map((amenity) => {
              const active = formData.amenities.includes(amenity);
              return (
                <button key={amenity} type="button" onClick={() => toggleAmenity(amenity)} disabled={isSubmitting}
                  className={cn("flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all",
                    active ? "border-indigo-500 bg-indigo-500 text-white shadow-sm" : "border-border/60 bg-white text-gray-700 hover:border-indigo-300")}>
                  <span className="text-base">{AMENITY_ICONS[amenity]}</span>
                  <span className="flex-1 text-left">{t(`property_form.amenity.${amenity}`, { defaultValue: amenity.replace("_", " ") })}</span>
                  {active && <Check size={14} />}
                </button>
              );
            })}
          </div>
        </div>

        <label htmlFor="hovli_rent_furnished" className={cn("flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors", formData.furnished ? "border-indigo-500 bg-indigo-50" : "border-border/60 bg-white hover:bg-gray-50")}>
          <Checkbox id="hovli_rent_furnished" checked={formData.furnished} onCheckedChange={(v) => setData({ ...formData, furnished: v as boolean })} disabled={isSubmitting} />
          <Sofa size={16} />
          <span className="text-sm font-medium">{t("property_form.furnished", { defaultValue: "Jihozlangan" })}</span>
        </label>
      </CardContent>
    </Card>
  );
}
