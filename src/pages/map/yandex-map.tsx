import { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { propertyService } from "@/services/property.service";
import type { PropertyType } from "@/interfaces/property/property.interface";
import { toast } from "sonner";

const DEFAULT_CENTER: [number, number] = [41.2995, 69.2401];
const DEFAULT_ZOOM = 14;
const DEFAULT_RADIUS = 5000;
const MAX_PROPERTIES = 200;

export default function YandexMap() {
  const [searchParams] = useSearchParams();

  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_CENTER);
  const [mapZoom, setMapZoom] = useState<number>(DEFAULT_ZOOM);
  const [propertiesOnMap, setPropertiesOnMap] = useState<PropertyType[]>([]);
  const [isLoadingProperties, setIsLoadingProperties] = useState(false);

  const mapInstanceRef = useRef<ymaps.Map | null>(null);
  const placemarksRef = useRef<Map<string, ymaps.Placemark>>(new Map());
  const ymapsReadyPromise = useRef<Promise<void> | null>(null);

  const loadYmaps = useCallback(() => {
    if (ymapsReadyPromise.current) return ymapsReadyPromise.current;

    ymapsReadyPromise.current = new Promise<void>((resolve) => {
      const check = setInterval(() => {
        if (window.ymaps) {
          clearInterval(check);
          window.ymaps.ready(() => resolve());
        }
      }, 100);
    });
    return ymapsReadyPromise.current;
  }, []);

  useEffect(() => {
    const lng = searchParams.get("lng");
    const lat = searchParams.get("lat");

    if (lng && lat && !isNaN(+lng) && !isNaN(+lat)) {
      setMapCenter([+lat, +lng]);
      setMapZoom(18);
      return;
    }

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setMapCenter([pos.coords.latitude, pos.coords.longitude]);
          setMapZoom(15);
          toast.success("Joylashuvingiz aniqlandi!");
        },
        () => {
          toast.info("Joylashuvga ruxsat berilmadi, Toshkent ko'rsatilmoqda");
        }
      );
    }
  }, [searchParams]);

  useEffect(() => {
    let destroyed = false;

    loadYmaps().then(() => {
      if (destroyed || mapInstanceRef.current) return;

      const ymaps = window.ymaps;

      const map = new ymaps.Map("yandex-map", {
        center: mapCenter,
        zoom: mapZoom,
        controls: ["zoomControl", "fullscreenControl", "geolocationControl"],
      });

      mapInstanceRef.current = map;

      let timeout: NodeJS.Timeout;
      const handler = () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          const center = map.getCenter() as [number, number];
          const zoom = map.getZoom();
          const bounds = map.getBounds();

          setMapCenter((prev) =>
            prev[0] === center[0] && prev[1] === center[1] ? prev : center
          );
          setMapZoom((prev) => (prev === zoom ? prev : zoom));

          let radius = DEFAULT_RADIUS;
          if (bounds) {
            const [[s, w], [n, e]] = bounds;
            const R = 6371000;
            const dLat = ((n - s) * Math.PI) / 180;
            const dLon = ((e - w) * Math.PI) / 180;
            const a =
              Math.sin(dLat / 2) ** 2 +
              Math.cos((s * Math.PI) / 180) *
                Math.cos((n * Math.PI) / 180) *
                Math.sin(dLon / 2) ** 2;
            const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            radius = Math.max(distance / 2, 3000);
          }

          fetchProperties(center, radius);
        }, 600);
      };

      map.events.add("boundschange", handler);
      map.events.add("actionend", handler);

      fetchProperties(mapCenter, DEFAULT_RADIUS);
    });

    return () => {
      destroyed = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }
    };
  }, [loadYmaps]);

  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setCenter(mapCenter, mapZoom, { duration: 400 });
    }
  }, [mapCenter, mapZoom]);

  const fetchProperties = useCallback(
    async (center: [number, number], radius: number) => {
      if (isLoadingProperties) return;
      setIsLoadingProperties(true);

      try {
        const [lat, lng] = center;
        const data = await propertyService.findAll({
          lng,
          lat,
          radius,
          limit: 50,
        });

        setPropertiesOnMap((prev) => {
          const allProperties = [...prev, ...(data.properties || [])];
          const uniqueMap = new Map(allProperties.map((p) => [p._id, p]));
          const uniqueArray = Array.from(uniqueMap.values());

          if (uniqueArray.length > MAX_PROPERTIES) {
            return uniqueArray.slice(-MAX_PROPERTIES);
          }

          return uniqueArray;
        });
      } catch (err) {
        toast.error("Obyektlar yuklanmadi");
        console.error(err);
      } finally {
        setIsLoadingProperties(false);
      }
    },
    [isLoadingProperties]
  );

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;
    const currentIds = new Set(propertiesOnMap.map((p) => p._id));

    placemarksRef.current.forEach((pm, id) => {
      if (!currentIds.has(id)) {
        map.geoObjects.remove(pm);
        placemarksRef.current.delete(id);
      }
    });

    propertiesOnMap.forEach((prop) => {
      if (placemarksRef.current.has(prop._id)) return;

      const [lng, lat] = prop.location.coordinates;

      const pm = new window.ymaps.Placemark(
        [lat, lng],
        {
          hintContent: prop.title || "Ko'chmas mulk",
          balloonContent: `
            <div class="font-medium">${prop.title}</div>
            <div>Narxi: $${prop.price?.toLocaleString()} ${prop.currency}</div>
            <div>Manzil: ${prop.address}</div>
          `,
        },
        { preset: "islands#blueDotIcon" }
      );

      map.geoObjects.add(pm);
      placemarksRef.current.set(prop._id, pm);
    });
  }, [propertiesOnMap]);

  return (
    <div className="relative w-full h-screen">
      <div id="yandex-map" className="w-full h-full" />

      {isLoadingProperties && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 px-4 py-2 rounded-lg shadow-lg z-10 flex items-center gap-2">
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
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Yuklanmoqda...</span>
        </div>
      )}
    </div>
  );
}
