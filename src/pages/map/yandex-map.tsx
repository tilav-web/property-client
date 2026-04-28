/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { propertyService } from "@/services/property.service";
import type { PropertyType } from "@/interfaces/property/property.interface";
import { useMapStore } from "@/stores/map.store";
import { googleMapKey } from "@/utils/shared";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { Locate, Search as SearchIcon, X } from "lucide-react";
import { formatPrice } from "@/utils/format-price";
import MapFilterBar from "./_components/map-filter-bar";
import {
  buildMapFilters,
  escapeHtml,
  filterSignature,
} from "./_components/map-filters";

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
const MAP_LIMIT = 200;

const getAreaKey = (lat: number, lng: number): string => {
  const AREA_SIZE = 0.2;
  const latKey = (Math.floor(lat / AREA_SIZE) * AREA_SIZE).toFixed(1);
  const lngKey = (Math.floor(lng / AREA_SIZE) * AREA_SIZE).toFixed(1);
  return `${latKey}:${lngKey}`;
};

export default function MapPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [showZoomMessage, setShowZoomMessage] = useState(false);
  const [searchBoxText, setSearchBoxText] = useState("");

  const mapRef = useRef<google.maps.Map | null>(null);
  const clustererRef = useRef<MarkerClusterer | null>(null);
  const markerMapRef = useRef<
    Map<string, google.maps.marker.AdvancedMarkerElement>
  >(new Map());
  const searchMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(
    null,
  );
  const searchCoordsRef = useRef<[number, number] | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const loadTimeoutRef = useRef<any>(null);
  const isQueryLocationRef = useRef(false);
  const lastAreaKeyRef = useRef<string | null>(null);
  const placesInputRef = useRef<HTMLInputElement | null>(null);
  const placesAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(
    null,
  );

  const filters = useMemo(() => buildMapFilters(searchParams), [searchParams]);
  const currentFilterSig = useMemo(() => filterSignature(filters), [filters]);

  const mergedProperties = useMapStore((s) => s.mergedProperties);
  const setFilterSig = useMapStore((s) => s.setFilterSig);

  useEffect(() => {
    setFilterSig(currentFilterSig);
    lastAreaKeyRef.current = null;
  }, [currentFilterSig, setFilterSig]);

  const loadScript = (): Promise<void> =>
    new Promise((resolve, reject) => {
      // Skript allaqachon yuklangan
      if (window.google?.maps?.importLibrary) {
        resolve();
        return;
      }

      const existing = document.getElementById(
        GOOGLE_MAP_SCRIPT_ID,
      ) as HTMLScriptElement | null;
      if (existing) {
        existing.addEventListener(
          "load",
          () =>
            window.google?.maps?.importLibrary
              ? resolve()
              : reject(new Error("Google Maps failed to initialize")),
          { once: true },
        );
        existing.addEventListener(
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
      // loading=async — Google'ning rasmiy tavsiyasi (2024+)
      // Library'larni keyin importLibrary() bilan aniq yuklab olamiz
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapKey}&loading=async&callback=__googleMapsCallback`;
      script.async = true;
      script.defer = true;
      script.addEventListener(
        "error",
        () => reject(new Error("Failed to load Google Maps script")),
        { once: true },
      );
      document.head.appendChild(script);
    });

  const waitForGoogleMaps = async (): Promise<void> => {
    await loadScript();
    // Aniq yuklash — `libraries=marker,places` URL'da har doim ishonchli emas
    // (yangi Google Maps API'da race condition).
    await Promise.all([
      google.maps.importLibrary("maps"),
      google.maps.importLibrary("marker"),
      google.maps.importLibrary("places"),
    ]);
  };

  const loadProperties = useCallback(
    async (sw_lat: number, sw_lng: number, ne_lat: number, ne_lng: number) => {
      const centerLat = (sw_lat + ne_lat) / 2;
      const centerLng = (sw_lng + ne_lng) / 2;
      const areaKey = getAreaKey(centerLat, centerLng);

      const fresh = useMapStore.getState().getFresh(areaKey);
      if (fresh) {
        lastAreaKeyRef.current = areaKey;
        return;
      }

      setIsLoading(true);
      try {
        const response = await propertyService.findAll({
          ...filters,
          sw_lat,
          sw_lng,
          ne_lat,
          ne_lng,
          limit: MAP_LIMIT,
        });
        const newProperties = response.properties || [];
        const responseAreaKey = response.areaKey || areaKey;
        useMapStore
          .getState()
          .addProperties(responseAreaKey, newProperties);
        lastAreaKeyRef.current = responseAreaKey;
      } catch (error) {
        console.error("Properties load error:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [filters],
  );

  const loadPropertiesDebounced = useCallback(
    (sw_lat: number, sw_lng: number, ne_lat: number, ne_lng: number) => {
      const centerLat = (sw_lat + ne_lat) / 2;
      const centerLng = (sw_lng + ne_lng) / 2;
      const areaKey = getAreaKey(centerLat, centerLng);

      if (useMapStore.getState().getFresh(areaKey)) {
        lastAreaKeyRef.current = areaKey;
        return;
      }
      if (lastAreaKeyRef.current === areaKey) return;

      if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
      loadTimeoutRef.current = setTimeout(() => {
        loadProperties(sw_lat, sw_lng, ne_lat, ne_lng);
      }, DEBOUNCE_DELAY);
    },
    [loadProperties],
  );

  const addSearchMarker = useCallback(
    (lat: number, lng: number) => {
      if (!mapRef.current) return;
      if (searchMarkerRef.current) searchMarkerRef.current.map = null;

      const pinEl = document.createElement("div");
      pinEl.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#22c55e" stroke="#15803d" stroke-width="1.5"/>
          <circle cx="12" cy="9" r="3" fill="white"/>
        </svg>`;
      const marker = new google.maps.marker.AdvancedMarkerElement({
        position: { lat, lng },
        map: mapRef.current,
        content: pinEl,
        zIndex: 1000,
      });
      marker.addListener("click", () => {
        if (!infoWindowRef.current)
          infoWindowRef.current = new google.maps.InfoWindow();
        infoWindowRef.current.setContent(
          `<div style="padding:8px">
            <div style="font-weight:600;color:#22c55e;margin-bottom:4px">
              ${escapeHtml(t("pages.map_page.search_location", "Search location"))}
            </div>
            <div style="font-size:12px;color:#666">
              ${lat.toFixed(5)}, ${lng.toFixed(5)}
            </div>
          </div>`,
        );
        infoWindowRef.current.open(mapRef.current, marker);
      });
      searchMarkerRef.current = marker;
      searchCoordsRef.current = [lat, lng];
    },
    [t],
  );

  const buildMarkerEl = () => {
    const pinEl = document.createElement("div");
    pinEl.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#3B82F6" stroke="#1E40AF" stroke-width="1.5"/>
        <circle cx="12" cy="9" r="3" fill="white"/>
      </svg>`;
    return pinEl;
  };

  const createInfoWindowContent = useCallback(
    (p: PropertyType) => {
      const fallback =
        "https://via.placeholder.com/300x200.png?text=No+Image";
      const image =
        p.photos && p.photos.length > 0 ? p.photos[0] : fallback;
      const priceStr = p.price
        ? escapeHtml(formatPrice(p.price, p.currency))
        : "";
      return `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;width:280px;border-radius:12px;overflow:hidden">
          <img src="${escapeHtml(image)}" alt="${escapeHtml(p.title)}" style="width:100%;height:160px;object-fit:cover;border-bottom:1px solid #eee"/>
          <div style="padding:12px">
            <h3 style="font-size:16px;font-weight:600;margin:0 0 8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escapeHtml(p.title)}</h3>
            <p style="font-size:18px;font-weight:700;color:#10B981;margin:0 0 10px">${priceStr}</p>
            <div style="font-size:13px;color:#6B7280;margin:0 0 12px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;text-overflow:ellipsis">${escapeHtml(p.address)}</div>
            <a href="/property/${escapeHtml(p._id)}" target="_blank" rel="noopener" style="display:block;width:100%;padding:10px 0;background:#3B82F6;color:#fff;text-align:center;text-decoration:none;border-radius:8px;font-weight:500">
              ${escapeHtml(t("pages.map_page.view_details", "View Details"))}
            </a>
          </div>
        </div>`;
    },
    [t],
  );

  // Diff-based marker updates — add new, remove gone, keep existing
  const updatePropertyMarkers = useCallback(() => {
    if (!mapRef.current) return;

    const next = new Map<string, google.maps.marker.AdvancedMarkerElement>();
    const toAdd: google.maps.marker.AdvancedMarkerElement[] = [];

    mergedProperties.forEach((property) => {
      const [lng, lat] = property.location.coordinates;

      if (isQueryLocationRef.current && searchCoordsRef.current) {
        const [sLat, sLng] = searchCoordsRef.current;
        if (Math.abs(sLat - lat) < 1e-6 && Math.abs(sLng - lng) < 1e-6)
          return;
      }

      const existing = markerMapRef.current.get(property._id);
      if (existing) {
        next.set(property._id, existing);
        return;
      }
      const marker = new google.maps.marker.AdvancedMarkerElement({
        position: { lat, lng },
        content: buildMarkerEl(),
      });
      marker.addListener("click", () => {
        if (!infoWindowRef.current)
          infoWindowRef.current = new google.maps.InfoWindow();
        infoWindowRef.current.setContent(createInfoWindowContent(property));
        infoWindowRef.current.open(mapRef.current, marker);
      });
      next.set(property._id, marker);
      toAdd.push(marker);
    });

    const toRemove: google.maps.marker.AdvancedMarkerElement[] = [];
    markerMapRef.current.forEach((marker, id) => {
      if (!next.has(id)) toRemove.push(marker);
    });

    if (!clustererRef.current) {
      clustererRef.current = new MarkerClusterer({
        map: mapRef.current,
        markers: Array.from(next.values()),
      });
    } else {
      if (toRemove.length) clustererRef.current.removeMarkers(toRemove);
      if (toAdd.length) clustererRef.current.addMarkers(toAdd);
    }
    toRemove.forEach((m) => {
      m.map = null;
    });

    markerMapRef.current = next;
  }, [mergedProperties, createInfoWindowContent]);

  const locateMe = useCallback(() => {
    if (!mapRef.current || !("geolocation" in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        mapRef.current?.setCenter({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        mapRef.current?.setZoom(15);
      },
      (err) => console.error(err),
      { timeout: 5000 },
    );
  }, []);

  // Initial map creation
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

      if (hasQueryLocation) addSearchMarker(centerLat, centerLng);

      // Places autocomplete on search input
      if (placesInputRef.current && window.google?.maps?.places) {
        const ac = new google.maps.places.Autocomplete(
          placesInputRef.current,
          { fields: ["geometry", "name", "formatted_address"] },
        );
        ac.addListener("place_changed", () => {
          const place = ac.getPlace();
          const loc = place.geometry?.location;
          if (!loc) return;
          map.setCenter(loc);
          map.setZoom(15);
          setSearchBoxText(place.formatted_address ?? place.name ?? "");
        });
        placesAutocompleteRef.current = ac;
      }

      const handleBoundsChanged = () => {
        const currentZoom = map.getZoom();
        if (currentZoom == null) return;
        if (currentZoom < MIN_ZOOM) {
          setShowZoomMessage(true);
          return;
        }
        setShowZoomMessage(false);
        const bounds = map.getBounds();
        if (bounds) {
          const sw = bounds.getSouthWest();
          const ne = bounds.getNorthEast();
          loadPropertiesDebounced(sw.lat(), sw.lng(), ne.lat(), ne.lng());
        }
      };

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

      markerMapRef.current.forEach((m) => {
        m.map = null;
      });
      markerMapRef.current = new Map();

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
      if (placesAutocompleteRef.current) {
        google.maps.event.clearInstanceListeners(
          placesAutocompleteRef.current,
        );
        placesAutocompleteRef.current = null;
      }
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refetch current viewport when filters change
  useEffect(() => {
    if (!mapRef.current) return;
    const bounds = mapRef.current.getBounds();
    const zoom = mapRef.current.getZoom();
    if (!bounds || zoom == null || zoom < MIN_ZOOM) return;
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    loadProperties(sw.lat(), sw.lng(), ne.lat(), ne.lng());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFilterSig]);

  // Marker updates when properties change
  useEffect(() => {
    updatePropertyMarkers();
  }, [updatePropertyMarkers]);

  const clearSearch = () => {
    setSearchBoxText("");
    const next = new URLSearchParams(searchParams);
    next.delete("lat");
    next.delete("lng");
    setSearchParams(next);
    if (searchMarkerRef.current) {
      searchMarkerRef.current.map = null;
      searchMarkerRef.current = null;
      searchCoordsRef.current = null;
      isQueryLocationRef.current = false;
    }
  };

  return (
    <div className="relative w-full h-screen">
      <div id="google-map" className="w-full h-full" />

      {/* Top toolbar: search + filters */}
      <div className="pointer-events-none absolute top-3 left-1/2 z-10 w-[calc(100%-24px)] max-w-5xl -translate-x-1/2 space-y-2">
        <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-gray-200 bg-white/95 pl-4 pr-2 py-1.5 shadow-lg backdrop-blur-sm">
          <SearchIcon size={18} className="text-gray-400 shrink-0" />
          <input
            ref={placesInputRef}
            value={searchBoxText}
            onChange={(e) => setSearchBoxText(e.target.value)}
            placeholder={t(
              "pages.map_page.search_placeholder",
              "Search places, areas, addresses",
            )}
            className="w-full border-0 bg-transparent py-1.5 text-sm outline-none placeholder:text-gray-400"
          />
          {searchBoxText && (
            <button
              type="button"
              onClick={clearSearch}
              className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 shrink-0"
              aria-label="Clear"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <MapFilterBar />
      </div>

      {/* Locate me */}
      <button
        type="button"
        onClick={locateMe}
        aria-label={t("pages.map_page.locate_me", "Locate me")}
        className="absolute bottom-6 right-6 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white shadow-lg hover:bg-gray-50"
      >
        <Locate size={20} className="text-blue-600" />
      </button>

      {/* Loading */}
      {isLoading && (
        <div className="absolute top-28 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm px-4 py-2.5 rounded-xl shadow-lg z-10 flex items-center gap-3">
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
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <span className="text-sm font-medium text-gray-700">
            {t("pages.map_page.loading", "Loading...")}
          </span>
        </div>
      )}

      {showZoomMessage && (
        <div className="absolute top-28 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm px-4 py-2.5 rounded-xl shadow-lg z-10 flex items-center gap-3">
          <SearchIcon size={18} className="text-blue-600" />
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

      {/* Count badge */}
      <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm px-4 py-2.5 rounded-xl shadow-lg z-10 border border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold text-gray-700">
            {mergedProperties.length}{" "}
            {t("pages.map_page.properties_count", "properties")}
          </span>
        </div>
      </div>
    </div>
  );
}
