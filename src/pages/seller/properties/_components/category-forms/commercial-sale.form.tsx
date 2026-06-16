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
  Building2,
  Check,
  Hammer,
  Landmark,
  Maximize,
  Sofa,
  Thermometer,
} from "lucide-react";
import type { RepairType } from "@/interfaces/types/repair.type";
import type { HeatingType } from "@/interfaces/types/heating.type";
import {
  amenitiesOptions,
  type AmenitiesType,
} from "@/interfaces/types/amenities.type";
import { cn } from "@/lib/utils";

interface CommercialSaleFormData {
  floor_level: number | string;
  total_floors: number | string;
  area: number | string;
  furnished: boolean;
  repair_type: RepairType | "";
  heating: HeatingType | "";
  amenities: AmenitiesType[];
  mortgage_available: boolean;
}

interface Props {
  data: CommercialSaleFormData;
  setData: (data: CommercialSaleFormData) => void;
  isSubmitting?: boolean;
}

const AMENITY_ICONS: Record<AmenitiesType, string> = {
  pool: "🏊",
  balcony: "🌇",
  security: "🛡️",
  air_conditioning: "❄️",
  parking: "🚗",
  elevator: "🛗",
};

const defaultFormData: CommercialSaleFormData = {
  floor_level: "",
  total_floors: "",
  area: "",
  furnished: false,
  repair_type: "",
  heating: "",
  amenities: [],
  mortgage_available: false,
};

export default function CommercialSaleForm({
  data,
  setData,
  isSubmitting = false,
}: Props) {
  const { t } = useTranslation();
  const formData = { ...defaultFormData, ...data };

  const repairTypes = [
    { value: "NEW" as RepairType, label: t("property_form.repair.new", { defaultValue: "New" }) },
    { value: "RENOVATED" as RepairType, label: t("property_form.repair.renovated", { defaultValue: "Renovated" }) },
    { value: "OLD" as RepairType, label: t("property_form.repair.old", { defaultValue: "Old" }) },
  ];

  const heatingTypes = [
    { value: "CENTRAL" as HeatingType, label: t("property_form.heating.central", { defaultValue: "Central" }) },
    { value: "INDIVIDUAL" as HeatingType, label: t("property_form.heating.individual", { defaultValue: "Individual" }) },
    { value: "NONE" as HeatingType, label: t("property_form.heating.none", { defaultValue: "None" }) },
  ];

  const handleNumberChange = (key: keyof CommercialSaleFormData, value: string) => {
    setData({ ...formData, [key]: value === "" ? "" : Number(value) });
  };

  const handleSelectChange = (key: keyof CommercialSaleFormData, value: string) =>
    setData({ ...formData, [key]: value });

  const handleAmenityToggle = (amenity: AmenitiesType) => {
    const current = formData.amenities || [];
    const next = current.includes(amenity)
      ? current.filter((a) => a !== amenity)
      : [...current, amenity];
    setData({ ...formData, amenities: next });
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>
          {t("property_form.commercial_sale.title", {
            defaultValue: "Commercial property for sale — details",
          })}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <NumberField
            id="floor_level"
            label={t("property_form.floor_level", { defaultValue: "Floor" })}
            icon={<Building2 size={14} />}
            value={formData.floor_level}
            onChange={(v) => handleNumberChange("floor_level", v)}
            disabled={isSubmitting}
            placeholder="1"
          />
          <NumberField
            id="total_floors"
            label={t("property_form.total_floors", { defaultValue: "Total floors" })}
            icon={<Building2 size={14} />}
            value={formData.total_floors}
            onChange={(v) => handleNumberChange("total_floors", v)}
            disabled={isSubmitting}
            placeholder="5"
          />
          <NumberField
            id="area"
            label={t("property_form.area", { defaultValue: "Area (m²)" })}
            icon={<Maximize size={14} />}
            value={formData.area}
            onChange={(v) => handleNumberChange("area", v)}
            disabled={isSubmitting}
            placeholder="60"
            step="0.1"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="repair_type" className="flex items-center gap-1.5">
              <Hammer size={14} />
              {t("property_form.repair_type", { defaultValue: "Renovation" })}
            </Label>
            <Select
              value={formData.repair_type}
              onValueChange={(v) => handleSelectChange("repair_type", v)}
              disabled={isSubmitting}
            >
              <SelectTrigger id="repair_type">
                <SelectValue placeholder={t("property_form.select", { defaultValue: "Select" })} />
              </SelectTrigger>
              <SelectContent>
                {repairTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="heating" className="flex items-center gap-1.5">
              <Thermometer size={14} />
              {t("property_form.heating_label", { defaultValue: "Heating" })}
            </Label>
            <Select
              value={formData.heating}
              onValueChange={(v) => handleSelectChange("heating", v)}
              disabled={isSubmitting}
            >
              <SelectTrigger id="heating">
                <SelectValue placeholder={t("property_form.select", { defaultValue: "Select" })} />
              </SelectTrigger>
              <SelectContent>
                {heatingTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-xl border bg-gradient-to-br from-indigo-50 to-purple-50 p-5">
          <Label className="mb-3 block text-base font-semibold">
            {t("property_form.amenities_title", { defaultValue: "Amenities" })}
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
            {amenitiesOptions.map((amenity) => {
              const active = (formData.amenities || []).includes(amenity);
              return (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => handleAmenityToggle(amenity)}
                  disabled={isSubmitting}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all",
                    active
                      ? "border-indigo-500 bg-indigo-500 text-white shadow-sm"
                      : "border-border/60 bg-white text-gray-700 hover:border-indigo-300",
                  )}
                >
                  <span className="text-base">{AMENITY_ICONS[amenity]}</span>
                  <span className="flex-1 text-left">
                    {t(`property_form.amenity.${amenity}`, {
                      defaultValue: amenity.replace("_", " "),
                    })}
                  </span>
                  {active && <Check size={14} />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label
            htmlFor="furnished"
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors",
              formData.furnished
                ? "border-indigo-500 bg-indigo-50"
                : "border-border/60 bg-white hover:bg-gray-50",
            )}
          >
            <Checkbox
              id="furnished"
              checked={formData.furnished}
              onCheckedChange={(v) => setData({ ...formData, furnished: v as boolean })}
              disabled={isSubmitting}
            />
            <Sofa size={16} />
            <span className="text-sm font-medium">
              {t("property_form.furnished", { defaultValue: "Furnished" })}
            </span>
          </label>

          <label
            htmlFor="mortgage_available"
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors",
              formData.mortgage_available
                ? "border-indigo-500 bg-indigo-50"
                : "border-border/60 bg-white hover:bg-gray-50",
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
              {t("property_form.mortgage_available", { defaultValue: "Mortgage available" })}
            </span>
          </label>
        </div>
      </CardContent>
    </Card>
  );
}

function NumberField({
  id, label, icon, value, onChange, disabled, placeholder, step,
}: {
  id: string;
  label: string;
  icon?: React.ReactNode;
  value: number | string;
  onChange: (v: string) => void;
  disabled?: boolean;
  placeholder?: string;
  step?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="flex items-center gap-1.5 text-xs">
        {icon}
        {label}
      </Label>
      <Input
        id={id}
        type="number"
        min="0"
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
}

export type { CommercialSaleFormData };
