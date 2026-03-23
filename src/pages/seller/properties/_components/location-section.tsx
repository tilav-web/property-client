import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Search, X } from "lucide-react";
import { useEffect, useRef, useCallback, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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

interface Suggestion {
  displayName: string;
  coords: [number, number];
}

const roundCoord = (num: number) => parseFloat(num.toFixed(6));

export default function LocationSection({ location, setLocation, isSubmitting = false }: Props) {
  const mapRef = useRef<ymaps.Map | null>(null);
  const placemarkRef = useRef<ymaps.Placemark | null>(null);
  const ymapsReadyPromise = useRef<Promise<void> | null>(null);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const suggestRequestRef = useRef<any>(null);

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

  const handleSearch = useCallback(
    async (query: string) => {
      if (!window.ymaps || !query.trim()) {
        setSuggestions([]);
        return;
      }

      if (suggestRequestRef.current) {
        suggestRequestRef.current.abort();
      }

      setIsSearching(true);

      try {
        const ymaps = window.ymaps;
        const results = await ymaps.geocode(query, {
          results: 5,
        });

        const foundSuggestions: Suggestion[] = [];
        results.geoObjects.each((geoObject: any) => {
          foundSuggestions.push({
            displayName: geoObject.getName(),
            coords: geoObject.geometry.getCoordinates() as [number, number],
          });
        });

        setSuggestions(foundSuggestions);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    },
    []
  );

  const handleSelectSuggestion = useCallback(
    (suggestion: Suggestion) => {
      setLocation({
        lat: roundCoord(suggestion.coords[0]),
        lng: roundCoord(suggestion.coords[1]),
      });
      setSearchQuery(suggestion.displayName);
      setSuggestions([]);
      setShowSuggestions(false);
    },
    [setLocation]
  );

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
  }, []);

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

  // Handle clicks outside the search dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        handleSearch(searchQuery);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, handleSearch]);

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
          Xaritada aniq joyni bosing, belgini suring yoki shahar/qishloq
          nomini qidiring.
        </p>

        <div ref={searchRef} className="relative mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Shahar, tuman yoki ko'cha nomi..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              disabled={isSubmitting}
              className="pl-10 pr-10 h-12 text-base"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={isSubmitting}
              >
                <X className="w-5 h-5" />
              </button>
            )}
            {isSearching && (
              <div className="absolute right-10 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-auto">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSelectSuggestion(suggestion)}
                  className={cn(
                    "w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors",
                    "flex items-start gap-3 border-b border-gray-100 last:border-b-0"
                  )}
                >
                  <MapPin className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {suggestion.displayName}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {suggestion.coords[0].toFixed(4)}, {suggestion.coords[1].toFixed(4)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {showSuggestions && searchQuery && suggestions.length === 0 && !isSearching && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-gray-500 text-sm">
              Hech narsa topilmadi
            </div>
          )}
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