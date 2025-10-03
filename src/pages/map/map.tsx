import { useSearchParams } from "react-router-dom";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import BackButton from "@/components/common/buttons/back-button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Marker position={{ lat, lng }} />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Toshkent chilonzor 21 kvartel</AlertDialogTitle>
              <AlertDialogDescription>
                Ko'proq malumot uchun davom etish tugmasini bosing!
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
              <AlertDialogAction>Davom etish</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </GoogleMap>
    </div>
  );
}
