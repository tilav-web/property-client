// components/property/sections/LocationSection.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { MapPin } from "lucide-react";

const mapContainerStyle = {
  width: "100%",
  height: "450px",
  borderRadius: "12px",
};

interface Props {
  isLoaded: boolean;
  location: { lat: number; lng: number };
  setLocation: (loc: { lat: number; lng: number }) => void;
}

export default function LocationSection({ isLoaded, location, setLocation }: Props) {
  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setLocation({
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      });
    }
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl">
          <MapPin className="w-7 h-7 text-red-600" />
          Joylashuv
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">
          Xaritada aniq joyni bosing – bu mijozlarga qulay bo‘ladi
        </p>

        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={location}
            zoom={14}
            onClick={handleMapClick}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
            }}
          >
            <Marker position={location} />
          </GoogleMap>
        ) : (
          <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Xarita yuklanmoqda...</p>
          </div>
        )}

        <p className="mt-4 text-sm text-gray-600">
          Hozirgi koordinatalar: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
        </p>
      </CardContent>
    </Card>
  );
}