import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Bath,
  Bed,
  Building2,
  Check,
  Hammer,
  Home,
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

interface ApartmentSaleFormData {
  bedrooms: number | string;
  bathrooms: number | string;
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
  data: ApartmentSaleFormData;
  setData: (data: ApartmentSaleFormData) => void;
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

const defaultFormData: ApartmentSaleFormData = {
  bedrooms: "",
  bathrooms: "",
  floor_level: "",
  total_floors: "",
  area: "",
  furnished: false,
  repair_type: "",
  heating: "",
  amenities: [],
  mortgage_available: false,
};

export default function ApartmentSaleForm({
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

  const handleNumberChange = (key: keyof ApartmentSaleFormData, value: string) => {
    const numValue = value === "" ? "" : Number(value);
    setData({ ...formData, [key]: numValue });
  };

  const handleBooleanChange = (
    key: keyof ApartmentSaleFormData,
    value: boolean,
  ) => setData({ ...formData, [key]: value });

  const handleSelectChange = (key: keyof ApartmentSaleFormData, value: string) =>
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
          {t("property_form.sale.title", {
            defaultValue: "Apartment for sale — details",
          })}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <NumberField
            id="bedrooms"
            label={t("property_form.bedrooms", { defaultValue: "Bedrooms" })}
            icon={<Bed size={14} />}
            value={formData.bedrooms}
            onChange={(v) => handleNumberChange("bedrooms", v)}
            disabled={isSubmitting}
            placeholder="3"
          />
          <NumberField
            id="bathrooms"
            label={t("property_form.bathrooms", { defaultValue: "Bathrooms" })}
            icon={<Bath size={14} />}
            value={formData.bathrooms}
            onChange={(v) => handleNumberChange("bathrooms", v)}
            disabled={isSubmitting}
            placeholder="2"
          />
          <NumberField
            id="floor_level"
            label={t("property_form.floor_level", { defaultValue: "Floor" })}
            icon={<Building2 size={14} />}
            value={formData.floor_level}
            onChange={(v) => handleNumberChange("floor_level", v)}
            disabled={isSubmitting}
            placeholder="5"
          />
          <NumberField
            id="total_floors"
            label={t("property_form.total_floors", {
              defaultValue: "Total floors",
            })}
            icon={<Building2 size={14} />}
            value={formData.total_floors}
            onChange={(v) => handleNumberChange("total_floors", v)}
            disabled={isSubmitting}
            placeholder="9"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <NumberField
            id="area"
            label={t("property_form.area", { defaultValue: "Area (m²)" })}
            icon={<Maximize size={14} />}
            value={formData.area}
            onChange={(v) => handleNumberChange("area", v)}
            disabled={isSubmitting}
            placeholder="85"
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
              onValueChange={(v: string) => handleSelectChange("repair_type", v)}
              disabled={isSubmitting}
            >
              <SelectTrigger id="repair_type">
                <SelectValue
                  placeholder={t("property_form.select", {
                    defaultValue: "Select",
                  })}
                />
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
              onValueChange={(v: string) => handleSelectChange("heating", v)}
              disabled={isSubmitting}
            >
              <SelectTrigger id="heating">
                <SelectValue
                  placeholder={t("property_form.select", {
                    defaultValue: "Select",
                  })}
                />
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
                      : "border-gray-200 bg-white text-gray-700 hover:border-indigo-300",
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
          <ToggleRow
            id="furnished"
            label={t("property_form.furnished", { defaultValue: "Furnished" })}
            icon={<Sofa size={16} />}
            checked={formData.furnished}
            onChange={(v) => handleBooleanChange("furnished", v)}
            disabled={isSubmitting}
          />
          <ToggleRow
            id="mortgage_available"
            label={t("property_form.mortgage_available", {
              defaultValue: "Mortgage available",
            })}
            icon={<Landmark size={16} />}
            checked={formData.mortgage_available}
            onChange={(v) => handleBooleanChange("mortgage_available", v)}
            disabled={isSubmitting}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function NumberField({
  id,
  label,
  icon,
  value,
  onChange,
  disabled,
  placeholder,
  step,
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

function ToggleRow({
  id,
  label,
  icon,
  checked,
  onChange,
  disabled,
}: {
  id: string;
  label: string;
  icon?: React.ReactNode;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors",
        checked
          ? "border-indigo-500 bg-indigo-50"
          : "border-gray-200 bg-white hover:bg-gray-50",
      )}
    >
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(v) => onChange(v as boolean)}
        disabled={disabled}
      />
      <Home size={0} className="hidden" />
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </label>
  );
}

export type { ApartmentSaleFormData };
