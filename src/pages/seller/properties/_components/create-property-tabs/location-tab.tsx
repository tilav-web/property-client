import { Field, ErrorMessage, type FieldProps } from "formik"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin } from "lucide-react"
import type { IRegion } from "@/interfaces/region.interface"
import type { IDistrict } from "@/interfaces/district.interface"
import { GoogleMap, Marker } from "@react-google-maps/api";

type PropertyValueType = string | number | string[] | number[] | { type: string; coordinates: number[] }

type SetFieldValueType = (field: string, value: PropertyValueType) => void

interface LocationTabProps {
  markerPosition: { lat: number; lng: number }
  setMarkerPosition: (position: { lat: number; lng: number }) => void
  handleMapClick: (event: google.maps.MapMouseEvent) => void
  handleMapLoad: (map: google.maps.Map) => void
  handleMapUnmount: () => void
  regions: IRegion[] | undefined
  districts: IDistrict[] | undefined
  regionsLoading: boolean
  districtsLoading: boolean
  selectedRegion: string | null
  setSelectedRegion: (id: string | null) => void
  setFieldValue: SetFieldValueType
  isGeocoding: boolean
}

export default function LocationTab({
  markerPosition,
  handleMapClick,
  handleMapLoad,
  handleMapUnmount,
  regions,
  districts,
  regionsLoading,
  districtsLoading,
  selectedRegion,
  setSelectedRegion,
  isGeocoding,
  setMarkerPosition,
}: LocationTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Manzil va Joylashuv
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Toʻliq Manzil * (Xaritada joy tanlang yoki qoʻlda kiriting)
          </label>
          <Field
            as={Input}
            id="address"
            name="address"
            placeholder="Masalan: Toshkent shahar, Mirzo Ulugʻbek tumani, ..."
            disabled={isGeocoding}
          />
          <ErrorMessage name="address" component="div" className="text-red-500 text-sm mt-1" />
          {isGeocoding && <p className="text-sm text-gray-500 mt-1">Manzil yuklanmoqda...</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Joylashuvni Xaritada Tanlang *</label>
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "400px" }}
            center={markerPosition}
            zoom={10}
            onClick={(e) => handleMapClick(e)}
            onLoad={handleMapLoad}
            onUnmount={handleMapUnmount}
          >
            {markerPosition && <Marker position={markerPosition} />}
          </GoogleMap>
          <ErrorMessage name="location.coordinates" component="div" className="text-red-500 text-sm mt-1" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
              Viloyat *
            </label>
            <Field name="region">
              {({ field, form }: FieldProps) => (
                <Select
                  onValueChange={(value) => {
                    form.setFieldValue(field.name, value)
                    setSelectedRegion(value)
                    form.setFieldValue("district", "")

                    const selectedRegionObject = regions?.find((r: IRegion) => r.code === value)
                    if (selectedRegionObject) {
                      const [lng, lat] = selectedRegionObject.location.coordinates
                      setMarkerPosition({ lat, lng })
                    }
                  }}
                  value={field.value}
                  disabled={regionsLoading || !regions}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={regionsLoading ? "Yuklanmoqda..." : "Viloyat tanlang"} />
                  </SelectTrigger>
                  <SelectContent>
                    {regions?.map((region: IRegion) => (
                      <SelectItem key={region._id} value={region._id}>
                        {region.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </Field>
            <ErrorMessage name="region" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <div>
            <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
              Tuman *
            </label>
            <Field name="district">
              {({ field, form }: FieldProps) => (
                <Select
                  onValueChange={(value) => form.setFieldValue(field.name, value)}
                  value={field.value}
                  disabled={districtsLoading || !districts || !selectedRegion}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={districtsLoading ? "Yuklanmoqda..." : "Tuman tanlang"} />
                  </SelectTrigger>
                  <SelectContent>
                    {districts?.map((district: IDistrict) => (
                      <SelectItem key={district._id} value={district._id}>
                        {district.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </Field>
            <ErrorMessage name="district" component="div" className="text-red-500 text-sm mt-1" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
