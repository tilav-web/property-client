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
import { Home } from "lucide-react";
import type { CategoryType } from "@/interfaces/types/category.type";

interface Props {
  data: {
    title: string;
    description: string;
    address: string;
  };
  setData: (data: {
    title:string;
    description: string;
    address: string;
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
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl">
          <Home className="w-7 h-7" />
          Asosiy ma'lumotlar
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label className="text-lg">Sarlavha *</Label>
          <Input
            placeholder="Masalan: 3 xonali yangi ta'mirli kvartira, Chilonzor"
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-lg">To'liq ta'rif *</Label>
          <Textarea
            rows={5}
            placeholder="Qo'shimcha ma'lumotlar, afzalliklar, yaqin atrofdagi obyektlar..."
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-lg">To'liq manzil *</Label>
          <Textarea
            rows={5}
            placeholder="To'liq manzilni yozib qoldiring..."
            value={data.address}
            onChange={(e) => setData({ ...data, address: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-lg">Kategoriya *</Label>
          <Select
            value={category}
            onValueChange={(v) => setCategory(v as CategoryType)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Kategoriyani tanlang" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
