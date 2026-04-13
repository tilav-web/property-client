import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { useEffect, useRef, useCallback, useState } from "react";
import { googleMapKey } from "@/utils/shared";

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

const MALAYSIA_BOUNDS = {
  south: 0.85,
  west: 99.64,
  north: 7.36,
  east: 119.27,
};

let googleMapsLoadPromise: Promise<void> | null = null;

function loadGoogleMapsScript(): Promise<void> {
  if (googleMapsLoadPromise) return googleMapsLoadPromise;

  if (window.google?.maps) {
    googleMapsLoadPromise = Promise.resolve();
    return googleMapsLoadPromise;
  }

  googleMapsLoadPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Maps API"));
    document.head.appendChild(script);
  });

  return googleMapsLoadPromise;
}

export default function LocationSection({
  location,
  setLocation,
  isSubmitting = false,
}: Props) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const isSubmittingRef = useRef(isSubmitting);

  // Keep isSubmitting ref in sync so callbacks always see the latest value
  useEffect(() => {
    isSubmittingRef.current = isSubmitting;
    if (markerRef.current) {
      markerRef.current.setDraggable(!isSubmitting);
    }
  }, [isSubmitting]);

  const updateLocation = useCallback(
    (lat: number, lng: number) => {
      setLocation({ lat: roundCoord(lat), lng: roundCoord(lng) });
    },
    [setLocation],
  );

  // Get user's location on initial load - ONLY if location is not set
  useEffect(() => {
    if (
      (!location || (location.lat === 0 && location.lng === 0)) &&
      navigator.geolocation
    ) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: roundCoord(position.coords.latitude),
            lng: roundCoord(position.coords.longitude),
          });
        },
        (err) => {
          console.error("Geolocation error: ", err);
        },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setLocation]);

  // Initialize map on mount
  useEffect(() => {
    let isComponentMounted = true;

    loadGoogleMapsScript()
      .then(() => {
        if (!isComponentMounted || mapRef.current) return;

        const mapContainer = document.getElementById("location-map-container");
        if (!mapContainer) return;

        const map = new google.maps.Map(mapContainer, {
          center: { lat: location.lat, lng: location.lng },
          zoom: 14,
          fullscreenControl: true,
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
        });

        const marker = new google.maps.Marker({
          position: { lat: location.lat, lng: location.lng },
          map,
          draggable: !isSubmittingRef.current,
          icon: {
            url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
          },
        });

        // Click-to-place marker
        map.addListener("click", (e: google.maps.MapMouseEvent) => {
          if (isSubmittingRef.current || !e.latLng) return;
          const lat = e.latLng.lat();
          const lng = e.latLng.lng();
          marker.setPosition(e.latLng);
          updateLocation(lat, lng);
        });

        // Draggable marker
        marker.addListener("dragend", () => {
          if (isSubmittingRef.current) return;
          const pos = marker.getPosition();
          if (pos) {
            updateLocation(pos.lat(), pos.lng());
          }
        });

        // Google Places Autocomplete
        if (searchInputRef.current) {
          const autocomplete = new google.maps.places.Autocomplete(
            searchInputRef.current,
            {
              bounds: new google.maps.LatLngBounds(
                { lat: MALAYSIA_BOUNDS.south, lng: MALAYSIA_BOUNDS.west },
                { lat: MALAYSIA_BOUNDS.north, lng: MALAYSIA_BOUNDS.east },
              ),
              fields: ["geometry", "formatted_address"],
            },
          );

          autocomplete.addListener("place_changed", () => {
            if (isSubmittingRef.current) return;
            const place = autocomplete.getPlace();
            if (place?.geometry?.location) {
              const lat = place.geometry.location.lat();
              const lng = place.geometry.location.lng();
              const newPos = { lat, lng };

              marker.setPosition(newPos);
              map.setCenter(newPos);
              map.setZoom(16);
              updateLocation(lat, lng);
            }
          });

          autocompleteRef.current = autocomplete;
        }

        mapRef.current = map;
        markerRef.current = marker;
        setIsMapLoading(false);
      })
      .catch((error) => {
        console.error("Google Maps initialization error:", error);
        if (isComponentMounted) {
          setIsMapLoading(false);
        }
      });

    return () => {
      isComponentMounted = false;
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateLocation]);

  // Update marker position when `location` prop changes externally
  useEffect(() => {
    if (!markerRef.current || !mapRef.current) return;

    const newLat = roundCoord(location.lat);
    const newLng = roundCoord(location.lng);

    const currentPos = markerRef.current.getPosition();
    if (
      currentPos &&
      (roundCoord(currentPos.lat()) !== newLat ||
        roundCoord(currentPos.lng()) !== newLng)
    ) {
      const newPos = { lat: location.lat, lng: location.lng };
      markerRef.current.setPosition(newPos);
      mapRef.current.setCenter(newPos);
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
