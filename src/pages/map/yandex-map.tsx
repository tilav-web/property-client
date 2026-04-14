/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { propertyService } from "@/services/property.service";
import type { PropertyType } from "@/interfaces/property/property.interface";
import { useMapStore } from "@/stores/map.store";
import { googleMapKey } from "@/utils/shared";
import { MarkerClusterer } from "@googlemaps/markerclusterer";

declare global {
  interface Window {
    google: any;
    __googleMapsCallback?: () => void;
  }
}
const GOOGLE_MAP_SCRIPT_ID = "google-maps-script";

const DEFAULT_CENTER: [number, number] = [3.139, 101.6869];
const DEFAULT_ZOOM = 12;
const MIN_ZOOM = 10;
const DEBOUNCE_DELAY = 500;

const getAreaKey = (lat: number, lng: number): string => {
  const AREA_SIZE = 0.2;
  const latKey = (Math.floor(lat / AREA_SIZE) * AREA_SIZE).toFixed(1);
  const lngKey = (Math.floor(lng / AREA_SIZE) * AREA_SIZE).toFixed(1);
  return `${latKey}:${lngKey}`;
};

export default function YandexMap() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState<PropertyType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showZoomMessage, setShowZoomMessage] = useState(false);

  const mapRef = useRef<google.maps.Map | null>(null);
  const clustererRef = useRef<MarkerClusterer | null>(null);
  const propertyMarkersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const searchMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const searchCoordsRef = useRef<[number, number] | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const loadTimeoutRef = useRef<any>(null);
  const isQueryLocationRef = useRef(false);
  const lastAreaKeyRef = useRef<string | null>(null);

  const mergedProperties = useMapStore((s) => s.mergedProperties);

  useEffect(() => {
    setProperties(mergedProperties);
  }, [mergedProperties]);

  // 1. Load Google Maps script
  const waitForGoogleMaps = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.google?.maps) {
        resolve();
        return;
      }

      const existingScript = document.getElementById(
        GOOGLE_MAP_SCRIPT_ID,
      ) as HTMLScriptElement | null;

      if (existingScript) {
        const handleLoad = () => {
          if (window.google?.maps) resolve();
          else reject(new Error("Google Maps failed to initialize"));
        };
        existingScript.addEventListener("load", handleLoad, { once: true });
        existingScript.addEventListener(
          "error",
          () => reject(new Error("Failed to load Google Maps script")),
          { once: true },
        );
        return;
      }

      window.__googleMapsCallback = () => {
        delete window.__googleMapsCallback;
        resolve();
      };

      const script = document.createElement("script");
      script.id = GOOGLE_MAP_SCRIPT_ID;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapKey}&callback=__googleMapsCallback&libraries=marker,places`;
      script.async = true;
      script.defer = true;
      script.addEventListener(
        "error",
        () => reject(new Error("Failed to load Google Maps script")),
        { once: true },
      );
      document.head.appendChild(script);
    });
  };

  // 2. Load properties with cache check
  const loadProperties = useCallback(
    async (sw_lat: number, sw_lng: number, ne_lat: number, ne_lng: number) => {
      const centerLat = (sw_lat + ne_lat) / 2;
      const centerLng = (sw_lng + ne_lng) / 2;
      const areaKey = getAreaKey(centerLat, centerLng);

      const existingProperties = useMapStore.getState().areaMap[areaKey];
      if (existingProperties && existingProperties.length > 0) {
        console.log(`Cache hit for areaKey: ${areaKey}`);
        lastAreaKeyRef.current = areaKey;
        return;
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

        useMapStore.getState().addProperties(responseAreaKey, newProperties);

        lastAreaKeyRef.current = responseAreaKey;
      } catch (error) {
        console.error("Properties load error:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  // 3. Debounced load - only when area changes and not cached
  const loadPropertiesDebounced = useCallback(
    (sw_lat: number, sw_lng: number, ne_lat: number, ne_lng: number) => {
      const centerLat = (sw_lat + ne_lat) / 2;
      const centerLng = (sw_lng + ne_lng) / 2;
      const areaKey = getAreaKey(centerLat, centerLng);

      const cached = useMapStore.getState().areaMap[areaKey];
      if (cached && cached.length > 0) {
        lastAreaKeyRef.current = areaKey;
        return;
      }

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
    [loadProperties],
  );

  // 4. Search marker (green)
  const addSearchMarker = useCallback((lat: number, lng: number) => {
    if (!mapRef.current) return;

    if (searchMarkerRef.current) {
      searchMarkerRef.current.map = null;
    }

    const pinEl = document.createElement("div");
    pinEl.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#22c55e" stroke="#15803d" stroke-width="1.5"/>
        <circle cx="12" cy="9" r="3" fill="white"/>
      </svg>
    `;

    const marker = new google.maps.marker.AdvancedMarkerElement({
      position: { lat, lng },
      map: mapRef.current,
      content: pinEl,
      zIndex: 1000,
    });

    const infoContent = `
      <div style="padding: 8px;">
        <div style="font-weight: 600; color: #22c55e; margin-bottom: 4px;">
          ${t("pages.map_page.search_location", "Search location")}
        </div>
        <div style="font-size: 12px; color: #666;">
          ${lat.toFixed(5)}, ${lng.toFixed(5)}
        </div>
      </div>
    `;

    marker.addListener("click", () => {
      if (!infoWindowRef.current) {
        infoWindowRef.current = new google.maps.InfoWindow();
      }
      infoWindowRef.current.setContent(infoContent);
      infoWindowRef.current.open(mapRef.current, marker);
    });

    searchMarkerRef.current = marker;
    searchCoordsRef.current = [lat, lng];
  }, [t]);

  // 5. Property markers (blue) with clusterer
  const createInfoWindowContent = useCallback((p: PropertyType) => {
    const fallbackImage =
      "https://via.placeholder.com/300x200.png?text=No+Image";
    const imageUrl =
      p.photos && p.photos.length > 0 ? p.photos[0] : fallbackImage;
    const detailUrl = `/property/${p._id}`;

    return `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; width: 280px; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <img src="${imageUrl}" alt="${p.title}" style="width: 100%; height: 160px; object-fit: cover; border-bottom: 1px solid #eee;">
        <div style="padding: 12px;">
          <h3 style="font-size: 16px; font-weight: 600; margin: 0 0 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            ${p.title}
          </h3>
          <p style="font-size: 18px; font-weight: 700; color: #10B981; margin: 0 0 10px;">
            ${p.price?.toLocaleString()} ${p.currency?.toUpperCase()}
          </p>
          <div style="font-size: 13px; color: #6B7280; margin: 0 0 12px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis;">
            ${p.address}
          </div>
          <a href="${detailUrl}" target="_blank" style="display: block; width: 100%; padding: 10px 0; background-color: #3B82F6; color: white; text-align: center; text-decoration: none; border-radius: 8px; font-weight: 500; transition: background-color 0.2s;">
            ${t("pages.map_page.view_details", "View Details")}
          </a>
        </div>
      </div>
    `;
  }, [t]);

  const updatePropertyMarkers = useCallback(() => {
    if (!mapRef.current) return;

    // Remove old markers
    propertyMarkersRef.current.forEach((m) => {
      m.map = null;
    });
    propertyMarkersRef.current = [];

    if (clustererRef.current) {
      clustererRef.current.clearMarkers();
    }

    const markers: google.maps.marker.AdvancedMarkerElement[] = [];

    properties.forEach((property) => {
      const [lng, lat] = property.location.coordinates;

      if (isQueryLocationRef.current && searchCoordsRef.current) {
        const [sLat, sLng] = searchCoordsRef.current;
        if (Math.abs(sLat - lat) < 1e-6 && Math.abs(sLng - lng) < 1e-6) {
          return;
        }
      }

      const pinEl = document.createElement("div");
      pinEl.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#3B82F6" stroke="#1E40AF" stroke-width="1.5"/>
          <circle cx="12" cy="9" r="3" fill="white"/>
        </svg>
      `;

      const marker = new google.maps.marker.AdvancedMarkerElement({
        position: { lat, lng },
        content: pinEl,
      });

      marker.addListener("click", () => {
        if (!infoWindowRef.current) {
          infoWindowRef.current = new google.maps.InfoWindow();
        }
        infoWindowRef.current.setContent(createInfoWindowContent(property));
        infoWindowRef.current.open(mapRef.current, marker);
      });

      markers.push(marker);
    });

    propertyMarkersRef.current = markers;

    if (!clustererRef.current) {
      clustererRef.current = new MarkerClusterer({
        map: mapRef.current,
        markers,
      });
    } else {
      clustererRef.current.addMarkers(markers);
    }
  }, [properties, createInfoWindowContent]);

  // 6. Map initialization
  useEffect(() => {
    let destroyed = false;

    const initMap = async () => {
      await waitForGoogleMaps();
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
      } else if ("geolocation" in navigator) {
        isQueryLocationRef.current = false;
        try {
          const position = await new Promise<GeolocationPosition>(
            (resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, {
                timeout: 5000,
              });
            },
          );
          centerLat = position.coords.latitude;
          centerLng = position.coords.longitude;
          zoom = 14;
        } catch (error) {
          console.error(error);
        }
      } else {
        isQueryLocationRef.current = false;
      }

      const mapEl = document.getElementById("google-map");
      if (!mapEl || destroyed) return;

      const map = new google.maps.Map(mapEl, {
        center: { lat: centerLat, lng: centerLng },
        zoom,
        mapId: "property-map",
        zoomControl: true,
        fullscreenControl: true,
        streetViewControl: false,
        mapTypeControl: false,
      });
      mapRef.current = map;

      if (hasQueryLocation) {
        addSearchMarker(centerLat, centerLng);
      }

      const handleBoundsChanged = () => {
        const currentZoom = map.getZoom();
        if (currentZoom == null) return;

        if (currentZoom < MIN_ZOOM) {
          setShowZoomMessage(true);
        } else {
          setShowZoomMessage(false);
          const bounds = map.getBounds();
          if (bounds) {
            const sw = bounds.getSouthWest();
            const ne = bounds.getNorthEast();
            loadPropertiesDebounced(sw.lat(), sw.lng(), ne.lat(), ne.lng());
          }
        }
      };

      // Initial load
      google.maps.event.addListenerOnce(map, "idle", () => {
        if (destroyed) return;
        const currentZoom = map.getZoom();
        if (currentZoom != null && currentZoom >= MIN_ZOOM) {
          const bounds = map.getBounds();
          if (bounds) {
            const sw = bounds.getSouthWest();
            const ne = bounds.getNorthEast();
            loadProperties(sw.lat(), sw.lng(), ne.lat(), ne.lng());
          }
        } else {
          setShowZoomMessage(true);
        }
      });

      map.addListener("idle", handleBoundsChanged);
    };

    initMap();

    return () => {
      destroyed = true;
      if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);

      // Clean up markers
      propertyMarkersRef.current.forEach((m) => {
        m.map = null;
      });
      propertyMarkersRef.current = [];

      if (searchMarkerRef.current) {
        searchMarkerRef.current.map = null;
        searchMarkerRef.current = null;
      }

      if (clustererRef.current) {
        clustererRef.current.clearMarkers();
        clustererRef.current = null;
      }

      if (infoWindowRef.current) {
        infoWindowRef.current.close();
        infoWindowRef.current = null;
      }

      mapRef.current = null;
    };
  }, [searchParams, loadProperties, loadPropertiesDebounced, addSearchMarker]);

  // 7. Update markers when properties change
  useEffect(() => {
    updatePropertyMarkers();
  }, [updatePropertyMarkers]);

  return (
    <div className="relative w-full h-screen">
      <div id="google-map" className="w-full h-full" />

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
          <span className="font-medium text-gray-700">
            {t("pages.map_page.loading", "Loading...")}
          </span>
        </div>
      )}

      {showZoomMessage && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-lg z-10 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 text-blue-600"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="11" y1="8" x2="11" y2="14" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
          <div className="text-sm">
            <p className="font-semibold text-gray-800">
              {t("pages.map_page.zoom_in_prompt_title")}
            </p>
            <p className="text-gray-500">
              {t("pages.map_page.zoom_in_prompt_subtitle")}
            </p>
          </div>
        </div>
      )}

      <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm px-4 py-2.5 rounded-xl shadow-lg z-10 border border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold text-gray-700">
            {properties.length} {t("pages.map_page.properties_count", "properties")}
          </span>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-lg z-10 border border-gray-200">
        <div className="space-y-2 text-xs">
          {isQueryLocationRef.current && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-700 font-medium">
                {t("pages.map_page.search_location", "Search location")}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-700 font-medium">
              {t("pages.map_page.property_marker", "Property")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
