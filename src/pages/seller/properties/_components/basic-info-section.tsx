// components/property/sections/BasicInfoSection.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Home, DollarSign, MapPin } from "lucide-react";
import type { CategoryType } from "@/interfaces/types/category.type";

interface Props {
  data: {
    title: string;
    description: string;
    address: string;
    price: number | string;
  };
  setData: (data: {
    title: string;
    description: string;
    address: string;
    price: number | string;
  }) => void;
  category: CategoryType | "";
  setCategory: (cat: CategoryType | "") => void;
}

const categories = [
  { value: "APARTMENT_SALE" as const, label: "Kvartira sotish" },
  { value: "APARTMENT_RENT" as const, label: "Kvartira ijarasi" },
];

export default function BasicInfoSection({
  data,
  setData,
  category,
  setCategory,
}: Props) {
  return (
    <Card className="border-2 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg">
            <Home className="w-5 h-5 text-white" />
          </div>
          Asosiy ma'lumotlar
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Title Input */}
        <div className="space-y-3">
          <Label className="font-medium">Sarlavha *</Label>
          <Input
            placeholder="Masalan: 3 xonali yangi ta'mirli kvartira"
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            className="border-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
          />
        </div>

        {/* Description Input */}
        <div className="space-y-3">
          <Label className="font-medium">To'liq ta'rif *</Label>
          <Textarea
            rows={3}
            placeholder="Qo'shimcha ma'lumotlar, afzalliklar..."
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            className="border-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 min-h-[100px] resize-y"
          />
        </div>

        {/* Address Input */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <Label className="font-medium">To'liq manzil *</Label>
          </div>
          <Textarea
            rows={2}
            placeholder="Tuman, ko'cha, uy raqami..."
            value={data.address}
            onChange={(e) => setData({ ...data, address: e.target.value })}
            className="border-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 min-h-[80px] resize-y"
          />
        </div>

        {/* Price and Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Price Input */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label className="font-medium">Narx *</Label>
            </div>
            <Input
              type="number"
              placeholder="Masalan: 85000000"
              value={data.price}
              onChange={(e) => setData({ ...data, price: e.target.value })}
              className="border-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
            />
          </div>

          {/* Category Select */}
          <div className="space-y-3">
            <Label className="font-medium">Kategoriya *</Label>
            <Select
              value={category}
              onValueChange={(v) => setCategory(v as CategoryType)}
            >
              <SelectTrigger className="border-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-200">
                <SelectValue placeholder="Kategoriyani tanlang" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem
                    key={cat.value}
                    value={cat.value}
                    className="hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          cat.value.includes("SALE")
                            ? "bg-green-500"
                            : "bg-blue-500"
                        }`}
                      />
                      {cat.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Summary */}
        <div className="pt-4 border-t">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <div
                className={`w-2 h-2 rounded-full ${
                  data.title ? "bg-green-500" : "bg-gray-300"
                }`}
              />
              Sarlavha
            </div>
            <div className="flex items-center gap-1">
              <div
                className={`w-2 h-2 rounded-full ${
                  data.description ? "bg-green-500" : "bg-gray-300"
                }`}
              />
              Ta'rif
            </div>
            <div className="flex items-center gap-1">
              <div
                className={`w-2 h-2 rounded-full ${
                  data.address ? "bg-green-500" : "bg-gray-300"
                }`}
              />
              Manzil
            </div>
            <div className="flex items-center gap-1">
              <div
                className={`w-2 h-2 rounded-full ${
                  data.price ? "bg-green-500" : "bg-gray-300"
                }`}
              />
              Narx
            </div>
            <div className="flex items-center gap-1">
              <div
                className={`w-2 h-2 rounded-full ${
                  category ? "bg-green-500" : "bg-gray-300"
                }`}
              />
              Kategoriya
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
