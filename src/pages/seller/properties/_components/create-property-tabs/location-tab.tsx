"use client";

import { useState, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useCreatePropertyStore } from "@/stores/create-property.store";
import type { IRegion } from "@/interfaces/region.interface";
import type { IDistrict } from "@/interfaces/district.interface";
import { useQuery } from "@tanstack/react-query";
import { regionService } from "@/services/region.service";
import { districtService } from "@/services/district.service";
import { useLoadScript } from "@react-google-maps/api";

export default function LocationTab() {
  const { data, updateData } = useCreatePropertyStore();

  const [markerPosition, setMarkerPosition] = useState<{
    lat: number;
    lng: number;
  }>({
    lat: data?.location?.coordinates?.[1] || 38.86,
    lng: data?.location?.coordinates?.[0] || 65.79,
  });
  const [selectedRegion, setSelectedRegion] = useState<string | null>(
    data?.region || null
  );
  const mapRef = useRef<google.maps.Map | null>(null);

  // ✅ Region va District’larni yuklash
  const { data: regions, isLoading: regionsLoading } = useQuery<IRegion[]>({
    queryKey: ["regions"],
    queryFn: () => regionService.findAll(),
  });

  const { data: districts, isLoading: districtsLoading } = useQuery<
    IDistrict[]
  >({
    queryKey: ["districts", selectedRegion],
    queryFn: () =>
      selectedRegion
        ? districtService.findAllByRegionId(selectedRegion)
        : Promise.resolve([]),
    enabled: !!selectedRegion,
  });

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS || "",
  });

  // 🔹 Map event handlers
  const handleMapClick = useCallback(
    (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        setMarkerPosition({ lat, lng });
        updateData({
          location: { type: "Point", coordinates: [lng, lat] },
        });
      }
    },
    [updateData]
  );

  const handleMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const handleMapUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  // 🔹 Region tanlanganda district reset bo‘ladi
  const handleRegionChange = useCallback(
    (value: string) => {
      updateData({ region: value, district: "" });
      setSelectedRegion(value);
      const selectedRegionObject = regions?.find((r) => r._id === value);
      if (selectedRegionObject) {
        const [lng, lat] = selectedRegionObject.location.coordinates;
        setMarkerPosition({ lat, lng });
        updateData({
          location: { type: "Point", coordinates: [lng, lat] },
        });
      }
    },
    [regions, updateData]
  );

  const handleDistrictChange = (value: string) => {
    updateData({ district: value });
  };

  const handleAddressChange = (value: string) => {
    updateData({ address: value });
  };

  if (loadError)
    return <div>Xarita yuklanishida xato: {loadError.message}</div>;
  if (!isLoaded) return <div>Xarita yuklanmoqda...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Manzil va Joylashuv
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* To‘liq manzil */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            To‘liq manzil *
          </label>
          <Input
            type="text"
            placeholder="Masalan: Toshkent shahar, Mirzo Ulug‘bek tumani..."
            value={data?.address ?? ""}
            onChange={(e) => handleAddressChange(e.target.value)}
          />
        </div>

        {/* Xaritada joylashuv */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Joylashuvni Xaritada tanlang *
          </label>
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "400px" }}
            center={markerPosition}
            zoom={10}
            onClick={handleMapClick}
            onLoad={handleMapLoad}
            onUnmount={handleMapUnmount}
          >
            <Marker position={markerPosition} />
          </GoogleMap>
        </div>

        {/* Viloyat va Tuman */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Viloyat */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Viloyat *
            </label>
            <Select
              disabled={regionsLoading || !regions}
              value={data?.region ?? ""}
              onValueChange={handleRegionChange}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    regionsLoading ? "Yuklanmoqda..." : "Viloyat tanlang"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {regions?.map((region) => (
                  <SelectItem key={region._id} value={region._id}>
                    {region.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tuman */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tuman *
            </label>
            <Select
              disabled={districtsLoading || !districts || !selectedRegion}
              value={data?.district ?? ""}
              onValueChange={handleDistrictChange}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    districtsLoading ? "Yuklanmoqda..." : "Tuman tanlang"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {districts?.map((district) => (
                  <SelectItem key={district._id} value={district._id}>
                    {district.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
