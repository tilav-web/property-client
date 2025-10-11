"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home } from "lucide-react";
import { ErrorMessage } from "formik";
import FormField from "../form-field";

export default function InfoTab({ values }: { values: { description: string } }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="h-5 w-5" />
          Asosiy Maʼlumotlar
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          name="title"
          label="Sarlavha"
          type="text"
          required
          placeholder="Masalan: Yangi qurilayotgan loyiha markazda..."
        />
        <div>
          <FormField
            name="description"
            label="Tavsif"
            type="textarea"
            required
            placeholder="Mulkning batafsil tavsifini yozing..."
          />
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>{values.description.length}/140</span>
            <ErrorMessage name="description" component="span" className="text-red-500" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            name="category"
            label="Kategoriya"
            type="select"
            required
            options={[
              { value: "apartment", label: "Kvartira" },
              { value: "house", label: "Uy" },
              { value: "commercial", label: "Tijorat" },
              { value: "land", label: "Yer uchastkasi" },
            ]}
          />
          <FormField
            name="construction_status"
            label="Qurilish Holati"
            type="select"
            options={[
              { value: "ready", label: "Tayyor" },
              { value: "under_construction", label: "Qurilmoqda" },
              { value: "planned", label: "Rejalashtirilgan" },
            ]}
          />
        </div>
      </CardContent>
    </Card>
  );
}