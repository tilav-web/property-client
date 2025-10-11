"use client";
import { useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { MapPin } from "lucide-react";
import type { IRegion } from "@/interfaces/region.interface";
import type { IDistrict } from "@/interfaces/district.interface";
import FormField from "../form-field";

interface LocationTabProps {
  markerPosition: { lat: number; lng: number };
  setMarkerPosition: (position: { lat: number; lng: number }) => void;
  handleMapClick: (event: google.maps.MapMouseEvent) => void;
  handleMapLoad: (map: google.maps.Map) => void;
  handleMapUnmount: () => void;
  regions: IRegion[] | undefined;
  districts: IDistrict[] | undefined;
  regionsLoading: boolean;
  districtsLoading: boolean;
  selectedRegion: string | null;
  setSelectedRegion: (id: string | null) => void;
  setFieldValue: (field: string, value: any) => void;
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
  setFieldValue,
}: LocationTabProps) {
  const handleRegionChange = useCallback(
    (value: string) => {
      setFieldValue("region", value);
      setSelectedRegion(value);
      setFieldValue("district", "");
      const selectedRegionObject = regions?.find(
        (r: IRegion) => r._id === value
      );
      if (selectedRegionObject) {
        const [lng, lat] = selectedRegionObject.location.coordinates;
        setFieldValue("location.coordinates", [lng, lat]);
      }
    },
    [regions, setFieldValue, setSelectedRegion]
  );

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
          <FormField
            name="address"
            label="Toʻliq Manzil"
            type="text"
            required
            placeholder="Masalan: Toshkent shahar, Mirzo Ulugʻbek tumani, ..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Joylashuvni Xaritada Tanlang *
          </label>
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "400px" }}
            center={markerPosition}
            zoom={10}
            onClick={handleMapClick}
            onLoad={handleMapLoad}
            onUnmount={handleMapUnmount}
          >
            {markerPosition && <Marker position={markerPosition} />}
          </GoogleMap>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            name="region"
            label="Viloyat"
            type="select"
            required
            disabled={regionsLoading || !regions}
            options={regions?.map((region: IRegion) => ({
              value: region._id,
              label: region.name,
            }))}
            placeholder={regionsLoading ? "Yuklanmoqda..." : "Viloyat tanlang"}
            onChange={handleRegionChange}
          />
          <FormField
            name="district"
            label="Tuman"
            type="select"
            required
            disabled={districtsLoading || !districts || !selectedRegion}
            options={districts?.map((district: IDistrict) => ({
              value: district._id,
              label: district.name,
            }))}
            placeholder={districtsLoading ? "Yuklanmoqda..." : "Tuman tanlang"}
          />
        </div>
      </CardContent>
    </Card>
  );
}
