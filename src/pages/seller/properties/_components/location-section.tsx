import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Search } from "lucide-react";
import { useEffect, useRef, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const isSubmittingRef = useRef(isSubmitting);

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

  // Get user's location on initial load
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

  // Initialize map
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

        // Google Places Autocomplete — global search
        if (searchInputRef.current) {
          const autocomplete = new google.maps.places.Autocomplete(
            searchInputRef.current,
            {
              fields: ["geometry", "formatted_address", "name"],
              types: ["geocode", "establishment"],
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

  // Update marker when location prop changes externally
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
          <MapPin className="h-7 w-7 text-red-600" />
          {t("pages.location_section.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-gray-600">
          {t("pages.location_section.description")}
        </p>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t("pages.location_section.search_label")}
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              ref={searchInputRef}
              id="location-search"
              type="text"
              placeholder={t("pages.location_section.search_placeholder")}
              disabled={isSubmitting}
              className="h-12 w-full rounded-lg border border-gray-300 pl-10 pr-4 text-base outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 disabled:cursor-not-allowed disabled:bg-gray-100"
            />
          </div>
        </div>

        <div
          style={mapContainerStyle}
          className="relative rounded-lg bg-gray-100"
        >
          {isMapLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-gray-500">{t("pages.map_page.loading_map")}</p>
            </div>
          )}
          <div
            id="location-map-container"
            className="h-full w-full rounded-lg"
          />
          {isSubmitting && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-200 opacity-50">
              <p className="font-semibold text-gray-700">{t("common.loading")}</p>
            </div>
          )}
        </div>

        <p className="mt-4 text-sm text-gray-600">
          {t("pages.location_section.coordinates")}: {location.lat.toFixed(6)},{" "}
          {location.lng.toFixed(6)}
        </p>
      </CardContent>
    </Card>
  );
}
