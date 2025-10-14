import { useTranslation } from "react-i18next";
import { useState, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { MapPin, Languages } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LocationTab() {
  const { t } = useTranslation();
  const { data, updateData, updateAddress } = useCreatePropertyStore();

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

  // ✅ Region va District'larni yuklash
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

  // 🔹 Region tanlanganda district reset bo'ladi
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

  // Til kodlari
  const languages = [
    { code: 'uz' as const, label: "O'zbekcha" },
    { code: 'ru' as const, label: "Русский" },
    { code: 'en' as const, label: "English" }
  ];

  if (loadError)
    return <div>{t("common.error")}: {loadError.message}</div>;
  if (!isLoaded) return <div>{t("common.loading")}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          {t("pages.create_property.location_tab.address_and_location")}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* To'liq manzil - 3 til uchun */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("pages.create_property.location_tab.full_address_label")} *
          </label>
          <Tabs defaultValue="uz" className="w-full">
            <div className="flex items-center gap-2 mb-3">
              <Languages className="h-4 w-4 text-gray-500" />
              <TabsList>
                {languages.map((lang) => (
                  <TabsTrigger key={lang.code} value={lang.code}>
                    {lang.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {languages.map((lang) => (
              <TabsContent key={lang.code} value={lang.code}>
                <Input
                  type="text"
                  placeholder={
                    lang.code === 'uz'
                      ? "Masalan: Toshkent shahar, Mirzo Ulug'bek tumani..."
                      : lang.code === 'ru'
                      ? "Например: Город Ташкент, Мирзо Улугбекский район..."
                      : "For example: Tashkent city, Mirzo Ulugbek district..."
                  }
                  value={data?.address?.[lang.code] ?? ""}
                  onChange={(e) => updateAddress(lang.code, e.target.value)}
                />
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Xaritada joylashuv */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("pages.create_property.location_tab.pick_location_label")} *
          </label>
          <div className="border rounded-lg overflow-hidden">
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
          <div className="text-sm text-gray-500 mt-1">
            {t("pages.create_property.location_tab.latitude")}: {markerPosition.lat.toFixed(6)}, {t("pages.create_property.location_tab.longitude")}: {markerPosition.lng.toFixed(6)}
          </div>
        </div>

        {/* Viloyat va Tuman */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
          {/* Viloyat */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("pages.create_property.location_tab.region_label")} *
            </label>
            <Select
              disabled={regionsLoading || !regions}
              value={data?.region ?? ""}
              onValueChange={handleRegionChange}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    regionsLoading ? t("common.loading") : t("common.choose")
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
              {t("pages.create_property.location_tab.district_label")} *
            </label>
            <Select
              disabled={districtsLoading || !districts || !selectedRegion}
              value={data?.district ?? ""}
              onValueChange={handleDistrictChange}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    districtsLoading ? t("common.loading") : t("common.choose")
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

        {/* Koordinatalarni ko'rsatish */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-gray-600">{t("pages.create_property.location_tab.latitude")}</div>
            <div className="font-medium">{markerPosition.lat.toFixed(6)}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-gray-600">{t("pages.create_property.location_tab.longitude")}</div>
            <div className="font-medium">{markerPosition.lng.toFixed(6)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}