/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef } from "react";
import type { IProject } from "@/interfaces/project/project.interface";
import { googleMapKey, googleMapId } from "@/utils/shared";
import { formatPrice } from "@/utils/format-price";

declare global {
  interface Window {
    google: any;
    __googleMapsCallback?: () => void;
  }
}

const GOOGLE_MAP_SCRIPT_ID = "google-maps-script";
const DEFAULT_CENTER: [number, number] = [41.2995, 69.2401]; // Toshkent
const DEFAULT_ZOOM = 11;

interface Props {
  projects: IProject[];
  selectedId?: string | null;
  onBoundsChange?: (bbox: [number, number, number, number]) => void;
  onMarkerClick?: (id: string) => void;
  initialCenter?: [number, number] | null;
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    c === "&"
      ? "&amp;"
      : c === "<"
        ? "&lt;"
        : c === ">"
          ? "&gt;"
          : c === '"'
            ? "&quot;"
            : "&#39;",
  );

const loadScript = (): Promise<void> =>
  new Promise((resolve, reject) => {
    if (window.google?.maps?.importLibrary) {
      resolve();
      return;
    }

    const existing = document.getElementById(
      GOOGLE_MAP_SCRIPT_ID,
    ) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", reject);
      return;
    }

    window.__googleMapsCallback = () => resolve();
    const script = document.createElement("script");
    script.id = GOOGLE_MAP_SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapKey}&loading=async&callback=__googleMapsCallback`;
    script.async = true;
    script.defer = true;
    script.onerror = reject;
    document.head.appendChild(script);
  });

const waitForGoogleMaps = async (): Promise<void> => {
  await loadScript();
  await Promise.all([
    window.google.maps.importLibrary("maps"),
    window.google.maps.importLibrary("marker"),
  ]);
};

export default function ProjectsMap({
  projects,
  selectedId,
  onBoundsChange,
  onMarkerClick,
  initialCenter,
}: Props) {
  const mapEl = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const infoRef = useRef<google.maps.InfoWindow | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialCenterRef = useRef(initialCenter);

  const onBoundsChangeRef = useRef(onBoundsChange);
  useEffect(() => {
    onBoundsChangeRef.current = onBoundsChange;
  }, [onBoundsChange]);

  const onMarkerClickRef = useRef(onMarkerClick);
  useEffect(() => {
    onMarkerClickRef.current = onMarkerClick;
  }, [onMarkerClick]);

  // Init map
  useEffect(() => {
    let cancelled = false;
    waitForGoogleMaps()
      .then(() => {
        if (cancelled || !mapEl.current || mapRef.current) return;
        const center = initialCenterRef.current ?? DEFAULT_CENTER;
        const map = new window.google.maps.Map(mapEl.current, {
          center: { lat: center[0], lng: center[1] },
          zoom: DEFAULT_ZOOM,
          mapId: googleMapId,
          streetViewControl: false,
          fullscreenControl: false,
          mapTypeControl: false,
        });
        mapRef.current = map;
        infoRef.current = new window.google.maps.InfoWindow();

        map.addListener("idle", () => {
          if (debounceRef.current) clearTimeout(debounceRef.current);
          debounceRef.current = setTimeout(() => {
            const b = map.getBounds();
            if (!b) return;
            const ne = b.getNorthEast();
            const sw = b.getSouthWest();
            onBoundsChangeRef.current?.([
              sw.lng(),
              sw.lat(),
              ne.lng(),
              ne.lat(),
            ]);
          }, 400);
        });
      })
      .catch((err) => console.error("Google Maps load failed:", err));

    return () => {
      cancelled = true;
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // Sync markers with projects
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !window.google?.maps?.marker?.AdvancedMarkerElement) return;

    const incoming = new Set<string>();
    for (const p of projects) {
      const coords = p.location?.coordinates;
      if (!coords || coords.length !== 2) continue;
      incoming.add(p._id);

      let marker = markersRef.current.get(p._id);
      if (!marker) {
        const pin = document.createElement("div");
        pin.className =
          "rounded-md bg-blue-600 text-white px-2 py-1 text-xs font-bold shadow-md cursor-pointer hover:bg-blue-700 transition";
        pin.textContent = p.launch_price
          ? formatPrice(p.launch_price, p.currency)
          : (p.name?.slice(0, 14) ?? "");

        marker = new window.google.maps.marker.AdvancedMarkerElement({
          map,
          position: { lat: coords[1], lng: coords[0] },
          content: pin,
          title: p.name,
        });

        marker.addListener("click", () => {
          onMarkerClickRef.current?.(p._id);
          if (infoRef.current && map) {
            const html = `
              <div style="max-width:220px">
                <div style="font-weight:600;font-size:14px">${escapeHtml(p.name)}</div>
                ${p.address ? `<div style="font-size:12px;color:#666;margin-top:2px">${escapeHtml(p.address)}</div>` : ""}
                ${p.launch_price ? `<div style="font-weight:700;color:#1e40af;margin-top:4px">${escapeHtml(formatPrice(p.launch_price, p.currency))}</div>` : ""}
              </div>`;
            infoRef.current.setContent(html);
            infoRef.current.setPosition({ lat: coords[1], lng: coords[0] });
            infoRef.current.open(map);
          }
        });
        markersRef.current.set(p._id, marker);
      }
    }

    // Remove gone markers
    for (const [id, marker] of markersRef.current.entries()) {
      if (!incoming.has(id)) {
        marker.map = null;
        markersRef.current.delete(id);
      }
    }
  }, [projects]);

  // Highlight selected marker
  useEffect(() => {
    if (!selectedId) return;
    const marker = markersRef.current.get(selectedId);
    if (!marker) return;
    const el = marker.content as HTMLElement | null;
    if (!el) return;
    // Reset others
    for (const [id, m] of markersRef.current.entries()) {
      const mEl = m.content as HTMLElement | null;
      if (!mEl) continue;
      mEl.classList.toggle("ring-4", id === selectedId);
      mEl.classList.toggle("ring-blue-300", id === selectedId);
      mEl.classList.toggle("scale-110", id === selectedId);
    }
    if (mapRef.current) {
      const coords = projects.find((p) => p._id === selectedId)?.location
        ?.coordinates;
      if (coords)
        mapRef.current.panTo({ lat: coords[1], lng: coords[0] });
    }
  }, [selectedId, projects]);

  const handleResetView = useCallback(() => {
    if (!mapRef.current) return;
    mapRef.current.setCenter({
      lat: DEFAULT_CENTER[0],
      lng: DEFAULT_CENTER[1],
    });
    mapRef.current.setZoom(DEFAULT_ZOOM);
  }, []);

  return (
    <div className="relative h-full w-full">
      <div ref={mapEl} className="h-full w-full" />
      <button
        type="button"
        onClick={handleResetView}
        className="absolute bottom-4 right-4 rounded-md bg-white px-3 py-1.5 text-xs font-medium shadow hover:bg-gray-50"
      >
        Reset view
      </button>
    </div>
  );
}
