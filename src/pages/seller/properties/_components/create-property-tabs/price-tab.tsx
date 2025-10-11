"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import FormField from "../form-field";

export default function PriceTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-600" />
          Narx va Maydon
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            name="price"
            label="Narx"
            type="number"
            required
            placeholder="0"
          />
          <FormField
            name="price_type"
            label="Narx Turi"
            type="select"
            required
            options={[
              { value: "sale", label: "Sotuv" },
              { value: "rent", label: "Ijaraga" },
              { value: "total_price", label: "Umumiy narx" },
            ]}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            name="area"
            label="Maydon (m²)"
            type="number"
            required
            placeholder="0"
          />
          <FormField
            name="payment_plans"
            label="Toʻlov Rejalari"
            type="number"
            placeholder="0"
          />
        </div>
      </CardContent>
    </Card>
  );
}
