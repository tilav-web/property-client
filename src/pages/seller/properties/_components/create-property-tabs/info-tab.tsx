"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useCreatePropertyStore } from "@/stores/create-property.store";
import {
  propertyCategory,
  propertyConstructionStatus,
} from "@/interfaces/property.interface";

export default function InfoTab() {
  const { data, updateData } = useCreatePropertyStore();

  // umumiy handler
  const handleChange = (key: string, value: string) => {
    updateData({ [key]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="h-5 w-5" />
          Asosiy Maʼlumotlar
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Sarlavha */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sarlavha *
          </label>
          <Input
            type="text"
            placeholder="Masalan: Yangi qurilayotgan loyiha markazda..."
            value={data?.title ?? ""}
            onChange={(e) => handleChange("title", e.target.value)}
          />
        </div>

        {/* Tavsif */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tavsif *
          </label>
          <Textarea
            placeholder="Mulkning batafsil tavsifini yozing..."
            value={data?.description ?? ""}
            onChange={(e) => handleChange("description", e.target.value)}
            maxLength={140}
          />
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>{data?.description?.length ?? 0}/140</span>
          </div>
        </div>

        {/* Select maydonlar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Kategoriya */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kategoriya *
            </label>
            <Select
              value={data?.category ?? ""}
              onValueChange={(value) => handleChange("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tanlang" />
              </SelectTrigger>
              <SelectContent>
                {propertyCategory.map((item) => {
                  return (
                    <SelectItem key={item} className="capitalize" value={item}>
                      {item}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Qurilish holati */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Qurilish Holati
            </label>
            <Select
              value={data?.construction_status ?? ""}
              onValueChange={(value) =>
                handleChange("construction_status", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Tanlang" />
              </SelectTrigger>
              <SelectContent>
                {propertyConstructionStatus.map((item) => {
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
      </CardContent>
    </Card>
  );
}
