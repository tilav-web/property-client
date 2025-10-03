import { useSearchParams } from "react-router-dom";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import BackButton from "@/components/common/buttons/back-button";

export default function Map() {
  const [params] = useSearchParams();
  const latParam = params.get("lat");
  const lngParam = params.get("lng");

  // String => number
  const lat = latParam ? parseFloat(latParam) : 38.86;
  const lng = lngParam ? parseFloat(lngParam) : 65.79;

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS || "",
  });

  if (loadError) return <div>Xatolik yuz berdi</div>;
  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div className="w-full h-screen relative">
      <div className="absolute top-3 left-3 z-50">
        <BackButton className="bg-white" />
      </div>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={{ lat, lng }}
        zoom={15}
      >
        <Marker position={{ lat, lng }} />
      </GoogleMap>
    </div>
  );
}
