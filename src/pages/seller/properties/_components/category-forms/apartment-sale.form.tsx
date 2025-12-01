// components/property/forms/ApartmentSaleForm.tsx
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
import type { RepairType } from "@/interfaces/types/repair.type";
import type { HeatingType } from "@/interfaces/types/heating.type";
import {
  amenitiesOptions,
  type AmenitiesType,
} from "@/interfaces/types/amenities.type";

// Form ma'lumotlari interfeysi
interface ApartmentSaleFormData {
  price: number | string;
  bedrooms: number | string;
  bathrooms: number | string;
  floor_level: number | string;
  total_floors: number | string;
  area: number | string;
  balcony: boolean;
  furnished: boolean;
  repair_type: RepairType | "";
  heating: HeatingType | "";
  air_conditioning: boolean;
  parking: boolean;
  elevator: boolean;
  amenities: AmenitiesType[];
}

interface Props {
  data: ApartmentSaleFormData;
  setData: (data: ApartmentSaleFormData) => void;
}

// Doimiy ma'lumotlar
const repairTypes = [
  { value: "NEW" as RepairType, label: "Yangi ta'mir" },
  { value: "RENOVATED" as RepairType, label: "Ta'mirlangan" },
  { value: "OLD" as RepairType, label: "Eski" },
];

const heatingTypes = [
  { value: "CENTRAL" as HeatingType, label: "Markaziy" },
  { value: "INDIVIDUAL" as HeatingType, label: "Individual" },
  { value: "NONE" as HeatingType, label: "Yo'q" },
];

// Default values
const defaultFormData: ApartmentSaleFormData = {
  price: "",
  bedrooms: "",
  bathrooms: "",
  floor_level: "",
  total_floors: "",
  area: "",
  balcony: false,
  furnished: false,
  repair_type: "",
  heating: "",
  air_conditioning: false,
  parking: false,
  elevator: false,
  amenities: [],
};

export default function ApartmentSaleForm({ data, setData }: Props) {
  // Ma'lumotlarni default qiymatlar bilan birlashtirish
  const formData = { ...defaultFormData, ...data };

  // Raqamli inputlarni boshqarish
  const handleNumberChange = (
    key: keyof ApartmentSaleFormData,
    value: string
  ) => {
    const numValue = value === "" ? "" : Number(value);
    setData({ ...formData, [key]: numValue });
  };

  // Boolean qiymatlarni boshqarish
  const handleBooleanChange = (
    key: keyof ApartmentSaleFormData,
    value: boolean
  ) => {
    setData({ ...formData, [key]: value });
  };

  // Select qiymatlarini boshqarish
  const handleSelectChange = (
    key: keyof ApartmentSaleFormData,
    value: string
  ) => {
    setData({ ...formData, [key]: value });
  };

  // Qulayliklarni boshqarish
  const handleAmenityChange = (amenity: AmenitiesType, checked: boolean) => {
    const currentAmenities = formData.amenities || [];

    if (checked) {
      setData({
        ...formData,
        amenities: [...currentAmenities, amenity],
      });
    } else {
      setData({
        ...formData,
        amenities: currentAmenities.filter((a) => a !== amenity),
      });
    }
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Kvartira sotish – Tafsilotlar</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Asosiy raqamli maydonlar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bedrooms">Xonalar</Label>
            <Input
              id="bedrooms"
              type="number"
              min="0"
              value={formData.bedrooms}
              onChange={(e) => handleNumberChange("bedrooms", e.target.value)}
              placeholder="3"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bathrooms">Vannalar</Label>
            <Input
              id="bathrooms"
              type="number"
              min="0"
              value={formData.bathrooms}
              onChange={(e) => handleNumberChange("bathrooms", e.target.value)}
              placeholder="2"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="floor_level">Qavat</Label>
            <Input
              id="floor_level"
              type="number"
              min="0"
              value={formData.floor_level}
              onChange={(e) =>
                handleNumberChange("floor_level", e.target.value)
              }
              placeholder="5"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="total_floors">Jami qavatlar</Label>
            <Input
              id="total_floors"
              type="number"
              min="0"
              value={formData.total_floors}
              onChange={(e) =>
                handleNumberChange("total_floors", e.target.value)
              }
              placeholder="9"
            />
          </div>
        </div>

        {/* Maydon */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="area">Maydon (m²)</Label>
            <Input
              id="area"
              type="number"
              min="0"
              step="0.1"
              value={formData.area}
              onChange={(e) => handleNumberChange("area", e.target.value)}
              placeholder="85"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Umumiy narx (so'm)</Label>
          <Input
            id="price"
            type="number"
            min="0"
            value={formData.price}
            onChange={(e) => handleNumberChange("price", e.target.value)}
            placeholder="100000000"
          />
        </div>

        {/* Ta'mir va isitish turlari */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="repair_type">Ta'mir turi</Label>
            <Select
              value={formData.repair_type}
              onValueChange={(value: string) =>
                handleSelectChange("repair_type", value)
              }
            >
              <SelectTrigger id="repair_type">
                <SelectValue placeholder="Tanlang" />
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
            <Label htmlFor="heating">Isitish</Label>
            <Select
              value={formData.heating}
              onValueChange={(value: string) =>
                handleSelectChange("heating", value)
              }
            >
              <SelectTrigger id="heating">
                <SelectValue placeholder="Tanlang" />
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

        {/* Qo'shimcha imkoniyatlar */}
        <div className="bg-blue-50 p-6 rounded-lg space-y-4">
          <Label className="text-lg font-semibold">
            Qo'shimcha imkoniyatlar
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="balcony"
                checked={formData.balcony}
                onCheckedChange={(checked) =>
                  handleBooleanChange("balcony", checked as boolean)
                }
              />
              <Label htmlFor="balcony" className="text-sm cursor-pointer">
                Balkon
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="furnished"
                checked={formData.furnished}
                onCheckedChange={(checked) =>
                  handleBooleanChange("furnished", checked as boolean)
                }
              />
              <Label htmlFor="furnished" className="text-sm cursor-pointer">
                Mebel bilan
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="air_conditioning"
                checked={formData.air_conditioning}
                onCheckedChange={(checked) =>
                  handleBooleanChange("air_conditioning", checked as boolean)
                }
              />
              <Label
                htmlFor="air_conditioning"
                className="text-sm cursor-pointer"
              >
                Konditsioner
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="parking"
                checked={formData.parking}
                onCheckedChange={(checked) =>
                  handleBooleanChange("parking", checked as boolean)
                }
              />
              <Label htmlFor="parking" className="text-sm cursor-pointer">
                Parking
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="elevator"
                checked={formData.elevator}
                onCheckedChange={(checked) =>
                  handleBooleanChange("elevator", checked as boolean)
                }
              />
              <Label htmlFor="elevator" className="text-sm cursor-pointer">
                Lift
              </Label>
            </div>
          </div>
        </div>

        {/* Qulayliklar */}
        <div className="space-y-2">
          <Label className="text-lg font-semibold">
            Qulayliklar (ixtiyoriy)
          </Label>
          <div className="flex flex-wrap gap-4">
            {amenitiesOptions.map((amenity) => (
              <div key={amenity} className="flex items-center space-x-2">
                <Checkbox
                  id={`amenity-${amenity}`}
                  checked={(formData.amenities || []).includes(amenity)}
                  onCheckedChange={(checked) =>
                    handleAmenityChange(amenity, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`amenity-${amenity}`}
                  className="text-sm cursor-pointer"
                >
                  {amenity}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Export qo'shimcha typelar
export type { ApartmentSaleFormData };
