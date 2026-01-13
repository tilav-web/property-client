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
  isSubmitting?: boolean;
}

const roundCoord = (num: number) => parseFloat(num.toFixed(6));

export default function LocationSection({ location, setLocation, isSubmitting = false }: Props) {
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
      if (isSubmitting) return;
      const coords = e.get("coords");
      if (coords) {
        setLocation({
          lat: roundCoord(coords[0]),
          lng: roundCoord(coords[1]),
        });
      }
    },
    [setLocation, isSubmitting]
  );

  const handlePlacemarkDrag = useCallback(() => {
    if (isSubmitting) return;
    const coords = placemarkRef.current?.geometry?.getCoordinates();
    if (coords) {
      setLocation({
        lat: roundCoord(coords[0]),
        lng: roundCoord(coords[1]),
      });
    }
  }, [setLocation, isSubmitting]);

  // Get user's location on initial load - ONLY if location is not set
  useEffect(() => {
    if ((!location || (location.lat === 0 && location.lng === 0)) && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: roundCoord(position.coords.latitude),
            lng: roundCoord(position.coords.longitude),
          });
        },
        (err) => {
          console.error("Geolocation error: ", err);
        }
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setLocation]); // Run only once on mount if location is not available

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
          controls: ["zoomControl", "fullscreenControl", "geolocationControl"],
        });
        
        const placemark = new ymaps.Placemark(
          initialCoords,
          {},
          { preset: "islands#redIcon", draggable: !isSubmitting }
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
          setIsMapLoading(false);
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
  }, [loadYmaps, handleMapClick, handlePlacemarkDrag]);

  // Update placemark position and draggable status when `location` or `isSubmitting` prop changes
  useEffect(() => {
    if (!placemarkRef.current || !mapRef.current) return;

    const newLat = roundCoord(location.lat);
    const newLng = roundCoord(location.lng);
    
    const placemarkCoords = placemarkRef.current.geometry?.getCoordinates();

    // Prevent feedback loop by checking if rounded coordinates are different
    if (
      placemarkCoords &&
      (roundCoord(placemarkCoords[0]) !== newLat ||
       roundCoord(placemarkCoords[1]) !== newLng)
    ) {
      // Use original precise coordinates for setting map to avoid losing precision
      const newCoords: [number, number] = [location.lat, location.lng];
      placemarkRef.current.geometry?.setCoordinates(newCoords);
      mapRef.current.setCenter(newCoords);
    }

    placemarkRef.current.properties.set("draggable", !isSubmitting);
  }, [location, isSubmitting]);

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
           {isSubmitting && (
            <div className="absolute inset-0 bg-gray-200 opacity-50 z-10 flex items-center justify-center">
              <p className="text-gray-700 font-semibold">Yuklanmoqda...</p>
            </div>
          )}
        </div>

        <p className="mt-4 text-sm text-gray-600">
          Hozirgi koordinatalar: {location.lat.toFixed(6)},{" "}
          {location.lng.toFixed(6)}
        </p>
      </CardContent>
    </Card>
  );
}