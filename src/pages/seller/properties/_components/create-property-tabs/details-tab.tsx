import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bed } from "lucide-react";
import FormField from "../form-field";

export default function DetailsTab() {
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
          <FormField
            name="bedrooms"
            label="Yotoq xonalari"
            type="number"
            placeholder="0"
            required
          />
          <FormField
            name="bathrooms"
            label="Hammomlar"
            type="number"
            placeholder="0"
            required
          />
          <FormField
            name="floor_level"
            label="Qavat"
            type="number"
            placeholder="0"
            required
          />
          <FormField
            name="parking_spaces"
            label="Avtoturargoh"
            type="number"
            placeholder="0"
            required
          />
        </div>
      </CardContent>
    </Card>
  );
}