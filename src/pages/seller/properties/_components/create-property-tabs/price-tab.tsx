import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useCreatePropertyStore } from "@/stores/create-property.store";
import {
  propertyPriceType,
  propertyPurpose,
} from "@/interfaces/property.interface";

export default function PriceTab() {
  const { t } = useTranslation();
  const { data, updateData } = useCreatePropertyStore();

  // umumiy qiymatni yangilash funksiyasi
  const handleChange = (key: string, value: string) => {
    // raqamli qiymatlarni son ko'rinishiga o'tkazamiz
    const parsed =
      key === "price" || key === "area" || key === "payment_plans"
        ? value === ""
          ? undefined
          : Number(value)
        : value;

    updateData({ [key]: parsed });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-600" />
          {t("pages.create_property.price_tab.price_and_area")}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex items-center gap-4">
        {/* 1-qator: Mulk turi va Narx turi */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("pages.create_property.price_tab.price_type_label")} *
          </label>
          <Select
            value={data?.price_type ?? ""}
            onValueChange={(value) => handleChange("price_type", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("common.choose")} />
            </SelectTrigger>
            <SelectContent>
              {propertyPriceType.map((item) => {
                return (
                  <SelectItem className="capitalize" key={item} value={item}>
                    {t(`enums.property_price_type.${item}`)}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("pages.create_property.price_tab.purpose_label")} *
          </label>
          <Select
            value={data?.purpose ?? ""}
            onValueChange={(value) => handleChange("purpose", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("common.choose")} />
            </SelectTrigger>
            <SelectContent>
              {propertyPurpose.map((item) => {
                return (
                  <SelectItem className="capitalize" key={item} value={item}>
                    {t(`enums.property_purpose.${item}`)}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* 2-qator: Narx va Maydon */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("pages.create_property.price_tab.price_label")} * (uzs)
          </label>
          <Input
            type="number"
            placeholder="0"
            value={data?.price ?? ""}
            onChange={(e) => handleChange("price", e.target.value)}
            min="0"
          />
        </div>

        {/* Maydon */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("pages.create_property.price_tab.area_label")} *
          </label>
          <Input
            type="number"
            placeholder="0"
            value={data?.area ?? ""}
            onChange={(e) => handleChange("area", e.target.value)}
            min="0"
          />
        </div>
      </CardContent>
    </Card>
  );
}
