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
import { propertyPriceType } from "@/interfaces/property.interface";

export default function PriceTab() {
  const { data, updateData } = useCreatePropertyStore();

  // umumiy qiymatni yangilash funksiyasi
  const handleChange = (key: string, value: string) => {
    // raqamli qiymatlarni son ko‘rinishiga o‘tkazamiz
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
          Narx va Maydon
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 1-qator: Narx va Narx turi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Narx */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Narx *
            </label>
            <Input
              type="number"
              placeholder="0"
              value={data?.price ?? ""}
              onChange={(e) => handleChange("price", e.target.value)}
            />
          </div>

          {/* Narx turi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Narx turi *
            </label>
            <Select
              value={data?.price_type ?? ""}
              onValueChange={(value) => handleChange("price_type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tanlang" />
              </SelectTrigger>
              <SelectContent>
                {propertyPriceType.map((item) => {
                  return (
                    <SelectItem className="capitalize" key={item} value={item}>
                      {item}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 2-qator: Maydon va To‘lov rejalari */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Maydon */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maydon (m²) *
            </label>
            <Input
              type="number"
              placeholder="0"
              value={data?.area ?? ""}
              onChange={(e) => handleChange("area", e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
