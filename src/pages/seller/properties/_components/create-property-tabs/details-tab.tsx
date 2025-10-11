import { Field } from "formik"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Bed, Bath, Home, Car } from "lucide-react"

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
          <div>
            <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">
              <Bed className="inline h-4 w-4 mr-1" /> Yotoq xonalari
            </label>
            <Field as={Input} id="bedrooms" name="bedrooms" type="number" placeholder="0" />
          </div>

          <div>
            <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-1">
              <Bath className="inline h-4 w-4 mr-1" /> Hammomlar
            </label>
            <Field as={Input} id="bathrooms" name="bathrooms" type="number" placeholder="0" />
          </div>

          <div>
            <label htmlFor="floor_level" className="block text-sm font-medium text-gray-700 mb-1">
              <Home className="inline h-4 w-4 mr-1" /> Qavat
            </label>
            <Field as={Input} id="floor_level" name="floor_level" type="number" placeholder="0" />
          </div>

          <div>
            <label htmlFor="parking_spaces" className="block text-sm font-medium text-gray-700 mb-1">
              <Car className="inline h-4 w-4 mr-1" /> Avtoturargoh
            </label>
            <Field as={Input} id="parking_spaces" name="parking_spaces" type="number" placeholder="0" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
