/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { propertyService } from "@/services/property.service";
import type { PropertyType } from "@/interfaces/property/property.interface";
import { toast } from "sonner";
import { useMapStore } from "@/stores/map.store";

declare global {
  interface Window {
    ymaps: any;
  }
}

const DEFAULT_CENTER: [number, number] = [41.2995, 69.2401]; // Toshkent
const DEFAULT_ZOOM = 12;
const DEBOUNCE_DELAY = 500; // 0.5 sekundga tushirdik

// AREA KEY helper outside component so callbacks can be stable
const getAreaKey = (lat: number, lng: number): string => {
  const AREA_SIZE = 0.2;
  const latKey = (Math.floor(lat / AREA_SIZE) * AREA_SIZE).toFixed(1);
  const lngKey = (Math.floor(lng / AREA_SIZE) * AREA_SIZE).toFixed(1);
  return `${latKey}:${lngKey}`;
};

export default function YandexMap() {
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState<PropertyType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const mapRef = useRef<any>(null);
  const clustererRef = useRef<any>(null);
  const searchMarkerRef = useRef<any>(null);
  const searchCoordsRef = useRef<[number, number] | null>(null);
  const loadTimeoutRef = useRef<any>(null);
  const isQueryLocationRef = useRef(false);
  const lastAreaKeyRef = useRef<string | null>(null);

  const mergedProperties = useMapStore((s) => s.mergedProperties);

  useEffect(() => {
    // Sync local state with store's merged properties
    setProperties(mergedProperties);
  }, [mergedProperties]);

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

  // 2. PROPERTY LARNI YUKLASH (CACHE TEKSHIRISH BILAN)
  const loadProperties = useCallback(
    async (sw_lat: number, sw_lng: number, ne_lat: number, ne_lng: number) => {
      const centerLat = (sw_lat + ne_lat) / 2;
      const centerLng = (sw_lng + ne_lng) / 2;
      const areaKey = getAreaKey(centerLat, centerLng);

      // 🔥 CACHE TEKSHIRISH: Agar storeda bu areaKey uchun data bo'lsa — so'rov yubormaymiz
      const existingProperties = useMapStore.getState().areaMap[areaKey];
      if (existingProperties && existingProperties.length > 0) {
        console.log(`Cache hit for areaKey: ${areaKey}`);
        lastAreaKeyRef.current = areaKey;
        return; // So'rov yubormaymiz!
      }

      setIsLoading(true);
      try {
        const response = await propertyService.findAll({
          sw_lat,
          sw_lng,
          ne_lat,
          ne_lng,
          limit: 100,
        });

        const newProperties = response.properties || [];
        const responseAreaKey = response.areaKey || areaKey;

        // Store ga qo'shamiz
        useMapStore.getState().addProperties(responseAreaKey, newProperties);

        lastAreaKeyRef.current = responseAreaKey;
      } catch (error) {
        console.error("Properties load error:", error);
        toast.error("Ma'lumotlar yuklanmadi");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // 3. DEBOUNCED LOAD - FAQAT AREA ALMASHGANDA VA CACHE YO'Q BO'LGANDA
  const loadPropertiesDebounced = useCallback(
    (sw_lat: number, sw_lng: number, ne_lat: number, ne_lng: number) => {
      const centerLat = (sw_lat + ne_lat) / 2;
      const centerLng = (sw_lng + ne_lng) / 2;
      const areaKey = getAreaKey(centerLat, centerLng);

      // Agar cache da bo'lsa — hech nima qilmaymiz
      const cached = useMapStore.getState().areaMap[areaKey];
      if (cached && cached.length > 0) {
        lastAreaKeyRef.current = areaKey;
        return;
      }

      // Agar last area bilan bir xil bo'lsa — hech nima qilmaymiz
      if (lastAreaKeyRef.current === areaKey) {
        return;
      }

      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }

      loadTimeoutRef.current = setTimeout(() => {
        loadProperties(sw_lat, sw_lng, ne_lat, ne_lng);
      }, DEBOUNCE_DELAY);
    },
    [loadProperties]
  );

  // 4. SEARCH MARKER (YASHIL)
  const addSearchMarker = useCallback((lat: number, lng: number) => {
    if (!mapRef.current) return;

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
    searchCoordsRef.current = [lat, lng];
  }, []);

  // 5. PROPERTY MARKER LAR (KO'K) - CLUSTERER BILAN
  const createBalloon = useCallback((p: PropertyType) => `
    <div style="padding: 12px; min-width: 200px;">
      <div style="font-weight: 600; margin-bottom: 8px; font-size: 14px;">
        ${p.title}
      </div>
      <div style="color: #16a34a; font-weight: 600; font-size: 16px; margin-bottom: 8px;">
        ${p.price?.toLocaleString()} ${p.currency?.toUpperCase()}
      </div>
      <div style="font-size: 12px; color: #666; margin-bottom: 4px;">
        📍 ${p.address}
      </div>
      <div style="font-size: 12px; color: #666;">
        🏠 ${p.bedrooms || 0} xona • ${p.area || 0} m²
      </div>
    </div>
  `, []);

  const updatePropertyMarkers = useCallback(() => {
    if (!mapRef.current) return;

    if (!clustererRef.current) {
      clustererRef.current = new window.ymaps.Clusterer({
        preset: 'islands#invertedBlueClusterIcons',
        groupByCoordinates: false,
        clusterDisableClickZoom: true,
        clusterHideIconOnBalloonOpen: false,
      });
      mapRef.current.geoObjects.add(clustererRef.current);
    }

    const markers: any[] = [];

    properties.forEach((property) => {
      const [lng, lat] = property.location.coordinates;

      if (isQueryLocationRef.current && searchCoordsRef.current) {
        const [sLat, sLng] = searchCoordsRef.current;
        if (Math.abs(sLat - lat) < 1e-6 && Math.abs(sLng - lng) < 1e-6) {
          return;
        }
      }

      const marker = new window.ymaps.Placemark(
        [lat, lng],
        { balloonContent: createBalloon(property) },
        { preset: "islands#blueDotIcon" }
      );

      markers.push(marker);
    });

    clustererRef.current.removeAll();
    clustererRef.current.add(markers);
  }, [properties, createBalloon]);

  // 6. MAP INITIALIZATION
  useEffect(() => {
    let destroyed = false;

    const initMap = async () => {
      await waitForYmaps();
      if (destroyed) return;

      const urlLat = searchParams.get("lat");
      const urlLng = searchParams.get("lng");

      let centerLat = DEFAULT_CENTER[0];
      let centerLng = DEFAULT_CENTER[1];
      let zoom = DEFAULT_ZOOM;
      let hasQueryLocation = false;

      if (urlLat && urlLng && !isNaN(+urlLat) && !isNaN(+urlLng)) {
        centerLat = +urlLat;
        centerLng = +urlLng;
        zoom = 16;
        hasQueryLocation = true;
        isQueryLocationRef.current = true;
        toast.success("Qidiruv manzili topildi");
      } else if ("geolocation" in navigator) {
        isQueryLocationRef.current = false;
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
          });
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

      const map = new window.ymaps.Map("yandex-map", {
        center: [centerLat, centerLng],
        zoom: zoom,
        controls: ["zoomControl", "fullscreenControl"],
      });

      mapRef.current = map;

      if (hasQueryLocation) {
        addSearchMarker(centerLat, centerLng);
      }

      const bounds = map.getBounds();
      if (bounds) {
        const sw = bounds[0];
        const ne = bounds[1];
        loadProperties(sw[0], sw[1], ne[0], ne[1]);
      }

      map.events.add("boundschange", () => {
        const bounds = map.getBounds();
        if (bounds) {
          const sw = bounds[0];
          const ne = bounds[1];
          loadPropertiesDebounced(sw[0], sw[1], ne[0], ne[1]);
        }
      });
    };

    initMap();

    return () => {
      destroyed = true;
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
      if (mapRef.current) {
        mapRef.current.destroy();
        mapRef.current = null;
      }
      if (clustererRef.current) {
        clustererRef.current = null;
      }
    };
  }, [searchParams, loadProperties, loadPropertiesDebounced, addSearchMarker]);

  // 7. MARKER LARNI YANGILASH
  useEffect(() => {
    updatePropertyMarkers();
  }, [updatePropertyMarkers]);

  return (
    <div className="relative w-full h-screen">
      <div id="yandex-map" className="w-full h-full" />

      {isLoading && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-lg z-10 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <svg className="animate-spin h-5 w-5 text-blue-600" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="font-medium text-gray-700">Yuklanmoqda...</span>
        </div>
      )}

      <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm px-4 py-2.5 rounded-xl shadow-lg z-10 border border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold text-gray-700">
            {properties.length} ta e'lon
          </span>
        </div>
      </div>

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