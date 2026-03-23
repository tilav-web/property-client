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

// Uzbekistan bounds for better search results
const UZBEKISTAN_BOUNDS = [
  [37.17, 55.91], // South-West
  [45.57, 73.15], // North-East
];

export default function LocationSection({ location, setLocation, isSubmitting = false }: Props) {
  const mapRef = useRef<ymaps.Map | null>(null);
  const placemarkRef = useRef<ymaps.Placemark | null>(null);
  const suggestViewRef = useRef<ymaps.SuggestView | null>(null);
  const ymapsReadyPromise = useRef<Promise<void> | null>(null);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const loadYmaps = useCallback(() => {
    if (ymapsReadyPromise.current) return ymapsReadyPromise.current;

    ymapsReadyPromise.current = new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        if (ymapsReadyPromise.current) {
          clearInterval(check);
          reject(new Error("Yandex Maps API failed to load in 10 seconds."));
        }
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

  // Initialize Yandex SuggestView
  useEffect(() => {
    if (!searchInputRef.current) return;

    loadYmaps()
      .then(() => {
        const ymaps = window.ymaps;

        suggestViewRef.current = new ymaps.SuggestView(searchInputRef.current!, {
          results: 5,
          boundedBy: UZBEKISTAN_BOUNDS,
          provider: 'yandex#map', // Better search for cities and regions
        });

        suggestViewRef.current!.events.add("select", async (e: any) => {
          if (isSubmitting) return;

          const selectedSuggestion = e.get("item");
          if (!selectedSuggestion) return;

          try {
            const results = await ymaps.geocode(selectedSuggestion.value, {
              results: 1,
              boundedBy: UZBEKISTAN_BOUNDS,
            });

            const geoObject = results.geoObjects.get(0);
            if (geoObject) {
              const coords = geoObject.geometry.getCoordinates() as [number, number];
              const newLoc = {
                lat: roundCoord(coords[0]),
                lng: roundCoord(coords[1]),
              };
              setLocation(newLoc);
              
              // Move map to selected location
              if (mapRef.current) {
                mapRef.current.setCenter([newLoc.lat, newLoc.lng], 16, {
                  duration: 300,
                });
              }
            }
          } catch (error) {
            console.error("Geocode error:", error);
          }
        });
      })
      .catch((error) => {
        console.error("SuggestView initialization error:", error);
      });
  }, [loadYmaps, setLocation, isSubmitting]);

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
          controls: ["zoomControl", "fullscreenControl", "geolocationControl", "searchControl"],
        });

        // Sync searchControl results with our state
        const searchControl = map.controls.get('searchControl');
        searchControl.events.add('resultselect', (e: any) => {
          const index = e.get('index');
          searchControl.getResult(index).then((res: any) => {
            const coords = res.geometry.getCoordinates();
            setLocation({
              lat: roundCoord(coords[0]),
              lng: roundCoord(coords[1]),
            });
          });
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

    if (
      placemarkCoords &&
      (roundCoord(placemarkCoords[0]) !== newLat ||
       roundCoord(placemarkCoords[1]) !== newLng)
    ) {
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
          Xaritada aniq joyni bosing, belgini suring yoki manzilni qidiring.
        </p>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Manzilni qidirish
          </label>
          <input
            ref={searchInputRef}
            id="location-search"
            type="text"
            placeholder="Shahar, tuman yoki ko'cha nomi..."
            disabled={isSubmitting}
            className="w-full h-12 px-4 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

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
