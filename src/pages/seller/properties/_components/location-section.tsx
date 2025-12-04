import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { useEffect, useRef, useCallback, useState } from "react";

const mapContainerStyle = {
  width: "100%",
  height: "450px",
  borderRadius: "12px",
};

interface Props {
  location: { lat: number; lng: number };
  setLocation: (loc: { lat: number; lng: number }) => void;
}

export default function LocationSection({ location, setLocation }: Props) {
  const mapRef = useRef<ymaps.Map | null>(null);
  const placemarkRef = useRef<ymaps.Placemark | null>(null);
  const ymapsReadyPromise = useRef<Promise<void> | null>(null);
  const [isMapLoading, setIsMapLoading] = useState(true);

  const loadYmaps = useCallback(() => {
    if (ymapsReadyPromise.current) return ymapsReadyPromise.current;

    ymapsReadyPromise.current = new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        clearInterval(check);
        reject(new Error("Yandex Maps API failed to load in 10 seconds."));
      }, 10000);

      const check = setInterval(() => {
        if (window.ymaps) {
          clearInterval(check);
          clearTimeout(timeout);
          window.ymaps.ready(resolve);
        }
      }, 100);
    });
    return ymapsReadyPromise.current;
  }, []);

  const handleMapClick = useCallback(
    (e: ymaps.IEvent<ymaps.Map, MouseEvent>) => {
      const coords = e.get("coords");
      if (coords) {
        setLocation({ lat: coords[0], lng: coords[1] });
      }
    },
    [setLocation]
  );

  const handlePlacemarkDrag = useCallback(() => {
    const coords = placemarkRef.current?.geometry?.getCoordinates();
    if (coords) {
      setLocation({ lat: coords[0], lng: coords[1] });
    }
  }, [setLocation]);

  // Initialize map on mount
  useEffect(() => {
    let isComponentMounted = true;

    loadYmaps()
      .then(() => {
        if (!isComponentMounted || mapRef.current) return;

        const ymaps = window.ymaps;
        const initialCoords: [number, number] = [location.lat, location.lng];

        const map = new ymaps.Map("location-map-container", {
          center: initialCoords,
          zoom: 14,
          controls: ["zoomControl", "fullscreenControl"],
        });

        const placemark = new ymaps.Placemark(
          initialCoords,
          {},
          { preset: "islands#redIcon", draggable: true }
        );

        map.geoObjects.add(placemark);
        map.events.add("click", handleMapClick);
        placemark.events.add("dragend", handlePlacemarkDrag);

        mapRef.current = map;
        placemarkRef.current = placemark;
        setIsMapLoading(false);
      })
      .catch((error) => {
        console.error("Yandex map initialization error:", error);
        if (isComponentMounted) {
          setIsMapLoading(false); // Stop loading even on error to show a message
        }
      });

    return () => {
      isComponentMounted = false;
      if (mapRef.current) {
        mapRef.current.destroy();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadYmaps, handleMapClick, handlePlacemarkDrag]); // These callbacks are stable

  // Update placemark position when `location` prop changes
  useEffect(() => {
    if (!placemarkRef.current || !mapRef.current) return;

    const newCoords: [number, number] = [location.lat, location.lng];
    const placemarkCoords = placemarkRef.current.geometry?.getCoordinates();

    // Prevent feedback loop by checking if coordinates are different
    if (
      placemarkCoords &&
      (placemarkCoords[0] !== newCoords[0] ||
        placemarkCoords[1] !== newCoords[1])
    ) {
      placemarkRef.current.geometry?.setCoordinates(newCoords);
      mapRef.current.setCenter(newCoords);
    }
  }, [location]);

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
          Xaritada aniq joyni bosing yoki belgini kerakli joyga suring – bu
          mijozlarga qulay bo‘ladi.
        </p>

        <div
          style={mapContainerStyle}
          className="relative bg-gray-100 rounded-lg"
        >
          {isMapLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-gray-500">Xarita yuklanmoqda...</p>
            </div>
          )}
          <div
            id="location-map-container"
            className="w-full h-full rounded-lg"
          />
        </div>

        <p className="mt-4 text-sm text-gray-600">
          Hozirgi koordinatalar: {location.lat.toFixed(6)},{" "}
          {location.lng.toFixed(6)}
        </p>
      </CardContent>
    </Card>
  );
}
