/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { propertyService } from "@/services/property.service";
import type { PropertyType } from "@/interfaces/property/property.interface";
import { toast } from "sonner";

declare global {
  interface Window {
    ymaps: any;
  }
}

const DEFAULT_CENTER: [number, number] = [41.2995, 69.2401]; // Toshkent
const DEFAULT_ZOOM = 12;
const SEARCH_RADIUS = 100000; // 5km
const DEBOUNCE_DELAY = 1000; // 2 sekund

export default function YandexMap() {
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState<PropertyType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const mapRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const searchMarkerRef = useRef<any>(null);
  const loadTimeoutRef = useRef<any>(null);
  const isQueryLocationRef = useRef(false);

  // 1. YMAPS KUTISH
  const waitForYmaps = (): Promise<void> => {
    return new Promise((resolve) => {
      if (window.ymaps) {
        window.ymaps.ready(() => resolve());
      } else {
        const check = setInterval(() => {
          if (window.ymaps) {
            clearInterval(check);
            window.ymaps.ready(() => resolve());
          }
        }, 100);
      }
    });
  };

  // 2. PROPERTY LARNI YUKLASH
  const loadProperties = async (lat: number, lng: number) => {
    setIsLoading(true);
    try {
      const response = await propertyService.findAll({
        lat,
        lng,
        radius: SEARCH_RADIUS,
        limit: 100,
      });

      const newProperties = response.properties || [];

      // Query location bo'lsa faqat yangi property lar
      // Aks holda eski property lar bilan birlashtirish
      setProperties((prev) => {
        if (isQueryLocationRef.current) {
          return newProperties;
        }

        // Unique property larni birlashtirish
        const combined = [...prev, ...newProperties];
        const uniqueMap = new Map(combined.map((p) => [p._id, p]));
        return Array.from(uniqueMap.values());
      });
    } catch (error) {
      console.error("Properties load error:", error);
      toast.error("Ma'lumotlar yuklanmadi");
    } finally {
      setIsLoading(false);
    }
  };

  // 3. DEBOUNCED LOAD - 2 sekund kutish
  const loadPropertiesDebounced = (lat: number, lng: number) => {
    // Eski timeout ni bekor qilish
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }

    // Yangi timeout - 2 sekund kutadi
    loadTimeoutRef.current = setTimeout(() => {
      loadProperties(lat, lng);
    }, DEBOUNCE_DELAY);
  };

  // 4. SEARCH MARKER (YASHIL)
  const addSearchMarker = (lat: number, lng: number) => {
    if (!mapRef.current) return;

    // Eski marker ni o'chirish
    if (searchMarkerRef.current) {
      mapRef.current.geoObjects.remove(searchMarkerRef.current);
    }

    const greenIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#22c55e" stroke="#15803d" stroke-width="1.5"/>
        <circle cx="12" cy="9" r="3" fill="white"/>
      </svg>
    `;

    const marker = new window.ymaps.Placemark(
      [lat, lng],
      {
        balloonContent: `
          <div style="padding: 8px;">
            <div style="font-weight: 600; color: #22c55e; margin-bottom: 4px;">
              📍 Qidiruv manzili
            </div>
            <div style="font-size: 12px; color: #666;">
              ${lat.toFixed(5)}, ${lng.toFixed(5)}
            </div>
          </div>
        `,
      },
      {
        iconLayout: "default#image",
        iconImageHref: `data:image/svg+xml;base64,${btoa(greenIcon)}`,
        iconImageSize: [48, 48],
        iconImageOffset: [-24, -48],
      }
    );

    mapRef.current.geoObjects.add(marker);
    searchMarkerRef.current = marker;
  };

  // 5. PROPERTY MARKER LAR (KO'K)
  const updatePropertyMarkers = () => {
    if (!mapRef.current) return;

    const currentIds = new Set(properties.map((p) => p._id));

    // Eski marker larni o'chirish
    markersRef.current.forEach((marker, id) => {
      if (!currentIds.has(id)) {
        mapRef.current.geoObjects.remove(marker);
        markersRef.current.delete(id);
      }
    });

    // Yangi marker larni qo'shish
    properties.forEach((property) => {
      if (markersRef.current.has(property._id)) return;

      const [lng, lat] = property.location.coordinates;

      const marker = new window.ymaps.Placemark(
        [lat, lng],
        {
          balloonContent: `
            <div style="padding: 12px; min-width: 200px;">
              <div style="font-weight: 600; margin-bottom: 8px; font-size: 14px;">
                ${property.title}
              </div>
              <div style="color: #16a34a; font-weight: 600; font-size: 16px; margin-bottom: 8px;">
                ${property.price?.toLocaleString()} ${property.currency?.toUpperCase()}
              </div>
              <div style="font-size: 12px; color: #666; margin-bottom: 4px;">
                📍 ${property.address}
              </div>
              <div style="font-size: 12px; color: #666;">
                🏠 ${property.bedrooms || 0} xona • ${property.area || 0} m²
              </div>
            </div>
          `,
        },
        {
          preset: "islands#blueDotIcon",
        }
      );

      mapRef.current.geoObjects.add(marker);
      markersRef.current.set(property._id, marker);
    });
  };

  // 6. MAP INITIALIZATION
  useEffect(() => {
    let destroyed = false;

    const initMap = async () => {
      await waitForYmaps();
      if (destroyed) return;

      // URL dan lat/lng olish
      const urlLat = searchParams.get("lat");
      const urlLng = searchParams.get("lng");

      let centerLat = DEFAULT_CENTER[0];
      let centerLng = DEFAULT_CENTER[1];
      let zoom = DEFAULT_ZOOM;
      let hasQueryLocation = false;

      // 1. Query location bor bo'lsa
      if (urlLat && urlLng && !isNaN(+urlLat) && !isNaN(+urlLng)) {
        centerLat = +urlLat;
        centerLng = +urlLng;
        zoom = 16;
        hasQueryLocation = true;
        isQueryLocationRef.current = true;

        toast.success("Qidiruv manzili topildi");
      }
      // 2. Query yo'q bo'lsa user location
      else if ("geolocation" in navigator) {
        isQueryLocationRef.current = false;

        try {
          const position = await new Promise<GeolocationPosition>(
            (resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, {
                timeout: 5000,
              });
            }
          );

          centerLat = position.coords.latitude;
          centerLng = position.coords.longitude;
          zoom = 14;

          toast.success("Sizning joylashuvingiz aniqlandi");
        } catch (error) {
          console.error(error);

          toast.info("Toshkent markazi ko'rsatilmoqda");
        }
      } else {
        isQueryLocationRef.current = false;
      }

      // Map yaratish
      const map = new window.ymaps.Map("yandex-map", {
        center: [centerLat, centerLng],
        zoom: zoom,
        controls: ["zoomControl", "fullscreenControl"],
      });

      mapRef.current = map;

      // Query location bo'lsa yashil marker
      if (hasQueryLocation) {
        addSearchMarker(centerLat, centerLng);
      }

      // Dastlabki property larni yuklash
      loadProperties(centerLat, centerLng);

      // Map harakatlari uchun event listener
      // boundschange - zoom o'zgarganda va map surganda
      map.events.add("boundschange", (e: any) => {
        // Faqat user action bo'lsa (programmatic emas)
        if (
          e.get("newZoom") !== e.get("oldZoom") ||
          e.get("newCenter") !== e.get("oldCenter")
        ) {
          const center = map.getCenter();
          loadPropertiesDebounced(center[0], center[1]);
        }
      });

      // actionend - har qanday harakat tugaganda
      map.events.add("actionend", () => {
        const center = map.getCenter();
        loadPropertiesDebounced(center[0], center[1]);
      });
    };

    initMap();

    return () => {
      destroyed = true;

      // Timeout ni tozalash
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }

      if (mapRef.current) {
        mapRef.current.destroy();
        mapRef.current = null;
      }
    };
  }, [searchParams]);

  // 7. MARKER LARNI YANGILASH
  useEffect(() => {
    updatePropertyMarkers();
  }, [properties]);

  return (
    <div className="relative w-full h-screen">
      <div id="yandex-map" className="w-full h-full" />

      {/* Loading */}
      {isLoading && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-lg z-10 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <svg
            className="animate-spin h-5 w-5 text-blue-600"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="font-medium text-gray-700">Yuklanmoqda...</span>
        </div>
      )}

      {/* Property Counter */}
      <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm px-4 py-2.5 rounded-xl shadow-lg z-10 border border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold text-gray-700">
            {properties.length} ta e'lon
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-lg z-10 border border-gray-200">
        <div className="space-y-2 text-xs">
          {isQueryLocationRef.current && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-700 font-medium">Qidiruv manzili</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-700 font-medium">Ko'chmas mulk</span>
          </div>
        </div>
      </div>
    </div>
  );
}
