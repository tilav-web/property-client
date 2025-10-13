"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bed } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCreatePropertyStore } from "@/stores/create-property.store";

export default function DetailsTab() {
  const { data, updateData } = useCreatePropertyStore();

  const handleChange = (key: string, value: string) => {
    const parsedValue = value === "" ? undefined : Number(value);
    updateData({ [key]: parsedValue });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bed className="h-5 w-5" />
          Xonalar va Qulayliklar
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Yotoq xonalari *
            </label>
            <Input
              type="number"
              placeholder="0"
              value={data?.bedrooms ?? ""}
              onChange={(e) => handleChange("bedrooms", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hammomlar *
            </label>
            <Input
              type="number"
              placeholder="0"
              value={data?.bathrooms ?? ""}
              onChange={(e) => handleChange("bathrooms", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Qavat *
            </label>
            <Input
              type="number"
              placeholder="0"
              value={data?.floor_level ?? ""}
              onChange={(e) => handleChange("floor_level", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Avtoturargoh *
            </label>
            <Input
              type="number"
              placeholder="0"
              value={data?.parking_spaces ?? ""}
              onChange={(e) => handleChange("parking_spaces", e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
