import { useNavigate, useSearchParams } from "react-router-dom";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import BackButton from "@/components/common/buttons/back-button";
import { propertyService } from "@/services/property.service";
import type { IProperty } from "@/interfaces/property.interface";

export default function Map() {
  const [params] = useSearchParams();
  const latParam = params.get("lat");
  const lngParam = params.get("lng");
  const [hoverProperty, setHoverProperty] = useState<
    (IProperty & { pageX: number; pageY: number }) | null
  >(null);

  // Default koordinatalar yoki URL dan olinganlar
  const lat =
    latParam && !isNaN(parseFloat(latParam)) ? parseFloat(latParam) : 38.86;
  const lng =
    lngParam && !isNaN(parseFloat(lngParam)) ? parseFloat(lngParam) : 65.79;

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS || "",
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const [center, setCenter] = useState({ lat, lng });
  const [properties, setProperties] = useState<IProperty[]>([]);
  const navigate = useNavigate();

  // TanStack Query orqali mulklarni olish
  const { data, error, refetch, isFetching } = useQuery({
    queryKey: ["properties/map", center.lat, center.lng],
    queryFn: async () => {
      const res = await propertyService.findAll({
        coordinates: [center.lng, center.lat],
        radius: 10000, // 10 km radius
      });
      return res;
    },
    enabled: isLoaded,
    staleTime: 5 * 60 * 1000, // 5 daqiqa kesh
  });

  // Yangi mulklarni eskilariga qo‘shish
  useEffect(() => {
    if (data?.properties) {
      setProperties((prev) => {
        // Unikal mulklarni saqlash uchun Set
        const existingIds = new Set(prev.map((p) => p._id));
        const newProperties = data.properties.filter(
          (p: IProperty) => !existingIds.has(p._id)
        );
        return [...prev, ...newProperties];
      });
    }
  }, [data]);

  // Xarita markazi o‘zgarganda refetch
  useEffect(() => {
    if (isLoaded) {
      refetch();
    }
  }, [center, refetch, isLoaded]);

  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  const handleMapIdle = () => {
    if (!mapRef.current) return;
    const newCenter = mapRef.current.getCenter();
    if (!newCenter) return;

    const newLat = newCenter.lat();
    const newLng = newCenter.lng();

    // Faqat sezilarli o‘zgarishlarda yangilash
    setCenter((prev) => {
      const latDiff = Math.abs(prev.lat - newLat);
      const lngDiff = Math.abs(prev.lng - newLng);
      if (latDiff > 0.001 || lngDiff > 0.001) {
        return { lat: newLat, lng: newLng };
      }
      return prev;
    });
  };

  if (loadError)
    return <div>Xarita yuklanishida xato: {loadError.message}</div>;
  if (!isLoaded) return <div>Xarita yuklanmoqda...</div>;
  if (error)
    return <div>Ma'lumotlarni olishda xato: {(error as Error).message}</div>;

  return (
    <div className="w-full h-screen relative">
      <div className="absolute top-3 left-3 z-50">
        <BackButton className="bg-white" />
      </div>

      {isFetching && (
        <div className="absolute top-4 right-4 bg-white p-2 rounded shadow text-sm">
          Ma'lumotlar yuklanmoqda...
        </div>
      )}

      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={center}
        zoom={15}
        onLoad={handleMapLoad}
        onIdle={handleMapIdle}
      >
        {properties.map((property: IProperty) => (
          <Marker
            position={{
              lat: property?.location?.coordinates[1], // lat
              lng: property?.location?.coordinates[0], // lng
            }}
            onClick={() => navigate(`/property/${property?._id}`)}
            key={property?._id}
            onMouseOver={(e: google.maps.MapMouseEvent) => {
              const mouseEvent = e.domEvent as MouseEvent;
              setHoverProperty({
                ...property,
                pageX: mouseEvent.pageX,
                pageY: mouseEvent.pageY,
              });
            }}
            onMouseOut={() => {
              setHoverProperty(null);
            }}
          />
        ))}
      </GoogleMap>
      {hoverProperty && (
        <div
          className="absolute bg-white shadow-lg rounded-lg p-3 z-50 w-64 transition-opacity duration-200"
          style={{
            top: hoverProperty.pageY - 80,
            left: hoverProperty.pageX + 15,
          }}
        >
          <h3 className="font-semibold text-gray-800 mb-1">
            {hoverProperty.title}
          </h3>
          <p className="text-sm text-gray-600 mb-1">
            {hoverProperty.address || "Manzil ko‘rsatilmagan"}
          </p>
          <p className="text-sm text-gray-700 font-medium">
            💰 {hoverProperty.price.toLocaleString()} so‘m
          </p>
          <p className="text-xs text-gray-500">
            {hoverProperty.area} m² · {hoverProperty.bedrooms} xona
          </p>
        </div>
      )}
    </div>
  );
}
