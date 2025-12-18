import { useEffect, useRef, useCallback } from "react";
import type { IApartmentRent } from "@/interfaces/property/categories/apartment-rent.interface";

// Ikonlar
import {
  Bath,
  Bed,
  Building,
  Building2,
  Maximize,
  Rotate3D,
  ShieldCheck,
  Shirt,
  UserCheck,
  Warehouse,
  Waves,
  Home,
  Sofa,
  Wrench,
} from "lucide-react";

// Button komponentlari
import BackButton from "@/components/common/buttons/back-button";
import OnlineContractButton from "@/components/common/buttons/online-contract-button";
import CallButton from "@/components/common/buttons/call-button";
import MailButton from "@/components/common/buttons/mail-button";
import WhatsAppButton from "@/components/common/buttons/whats-app-button";
import HeartButton from "@/components/common/buttons/heart-button";
import EllipsisVerticalButton from "@/components/common/buttons/ellipsis-vertical-button";
import PropertyMediaGallery from "./property-media-gallery";
import FormalizeRentButton from "@/components/common/buttons/formalize-rent-button";

// Amenities ikonlari
const amenityIcons = {
  pool: <Waves className="w-4 h-4 flex-shrink-0" />,
  balcony: <Building className="w-4 h-4 flex-shrink-0" />,
  security: <ShieldCheck className="w-4 h-4 flex-shrink-0" />,
  air_conditioning: <Shirt className="w-4 h-4 flex-shrink-0" />,
  parking: <Warehouse className="w-4 h-4 flex-shrink-0" />,
  elevator: <UserCheck className="w-4 h-4 flex-shrink-0" />,
};

// Xarita komponenti
function PropertyMap({ coordinates }: { coordinates: [number, number] }) {
  const mapInstanceRef = useRef<ymaps.Map | null>(null);
  const ymapsReadyPromise = useRef<Promise<void> | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

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
    if (!coordinates) return;

    let destroyed = false;
    const [lng, lat] = coordinates;

    loadYmaps().then(() => {
      if (destroyed || !mapContainerRef.current) return;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setCenter([lat, lng], 15);
        return;
      }

      const ymaps = window.ymaps;
      const map = new ymaps.Map(mapContainerRef.current, {
        center: [lat, lng],
        zoom: 15,
        controls: ["zoomControl", "fullscreenControl", "geolocationControl"],
      });

      const placemark = new ymaps.Placemark([lat, lng]);
      map.geoObjects.add(placemark);

      mapInstanceRef.current = map;
    });

    return () => {
      destroyed = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }
    };
  }, [coordinates, loadYmaps]);

  if (!coordinates) {
    return (
      <div className="w-full h-[600px] rounded-xl bg-gray-200 flex items-center justify-center">
        <span className="text-gray-500">No coordinates available</span>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] rounded-xl overflow-hidden">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}

// Asosiy komponent
export default function ApartmentRent({
  apartment,
}: {
  apartment: IApartmentRent;
}) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("ru-RU").format(Math.round(num));
  };

  const formatPrice = (price: number) => {
    return `${formatNumber(price)} ${apartment.currency || "UZS"}`;
  };

  if (!apartment) {
    return (
      <div className="py-8">
        <BackButton className="mb-6" />
        <div className="text-center py-20">
          <div className="text-gray-500">No apartment data available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <BackButton className="mb-6" />

      {/* Rasmlar qismi */}
      <PropertyMediaGallery
        photos={apartment.photos}
        videos={apartment.videos}
        isPremium={apartment.is_premium}
      />

      {/* Xarita va asosiy ma'lumotlar */}
      <div className="flex flex-col lg:flex-row items-start gap-4 mb-8">
        <div className="w-full lg:w-1/2">
          {apartment.location?.coordinates && (
            <PropertyMap
              coordinates={apartment.location.coordinates as [number, number]}
            />
          )}
        </div>
        <div className="w-full lg:w-1/2">
          <div className="mb-12">
            <div className="flex items-center justify-between font-bold mb-4">
              {apartment.contract_file && (
                <OnlineContractButton file={apartment.contract_file} />
              )}
              <div className="flex items-center gap-3">
                {apartment.author?.phone?.value && (
                  <CallButton phone={apartment.author.phone.value} />
                )}
                {apartment.author?.email?.value && (
                  <MailButton mail={apartment.author.email.value} />
                )}
                <WhatsAppButton />
                <HeartButton property={apartment} />
                <EllipsisVerticalButton property={apartment} />
              </div>
            </div>
            <div className="font-bold flex items-center justify-end gap-8">
              <p className="text-4xl text-red-500">
                {formatPrice(apartment.price || 0)}
              </p>
              <FormalizeRentButton property={apartment} />
            </div>
          </div>
          <div>
            <h2 className="mb-4 text-xl font-semibold">{apartment.title}</h2>
            <p className="mb-4 text-gray-600">{apartment.description}</p>

            <h3 className="mb-2 font-medium text-gray-800">Property Details</h3>
            <ul className="space-y-1 text-gray-600">
              <li className="before:content-['-'] before:mr-2 before:text-gray-800">
                <span className="font-medium">Address:</span>{" "}
                {apartment.address}
              </li>
              <li className="before:content-['-'] before:mr-2 before:text-gray-800">
                <span className="font-medium">Category:</span> Apartment Rent
              </li>
              <li className="before:content-['-'] before:mr-2 before:text-gray-800">
                <span className="font-medium">Furnished:</span>{" "}
                {apartment.furnished ? "Yes" : "No"}
              </li>
              <li className="before:content-['-'] before:mr-2 before:text-gray-800">
                <span className="font-medium">Repair Type:</span>{" "}
                {apartment.repair_type || "Not specified"}
              </li>
              <li className="before:content-['-'] before:mr-2 before:text-gray-800">
                <span className="font-medium">Heating:</span>{" "}
                {apartment.heating || "Not specified"}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Property details */}
      <div className="max-w-5xl mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Property Details
        </h2>
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-gray-500" />
              <div className="flex items-center gap-4">
                <span className="text-gray-600 text-sm">Category</span>
                <p className="font-medium text-gray-800 capitalize">
                  Apartment Rent
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Bed className="w-5 h-5 text-gray-500" />
              <div className="flex items-center gap-4">
                <span className="text-gray-600 text-sm">Bedrooms</span>
                <p className="font-medium text-gray-800">
                  {apartment.bedrooms || 0}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Rotate3D className="w-5 h-5 text-gray-500" />
              <div className="flex items-center gap-4">
                <span className="text-gray-600 text-sm">Floor</span>
                <p className="font-medium text-gray-800">
                  {apartment.floor_level || 0} /{" "}
                  {apartment.total_floors || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Home className="w-5 h-5 text-gray-500" />
              <div className="flex items-center gap-4">
                <span className="text-gray-600 text-sm">Heating</span>
                <p className="font-medium text-gray-800">
                  {apartment.heating || "Not specified"}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Maximize className="w-5 h-5 text-gray-500" />
              <div className="flex items-center gap-4">
                <span className="text-gray-600 text-sm">Area</span>
                <p className="font-medium text-gray-800">
                  {apartment.area || 0} sq m
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Bath className="w-5 h-5 text-gray-500" />
              <div className="flex items-center gap-4">
                <span className="text-gray-600 text-sm">Bathrooms</span>
                <p className="font-medium text-gray-800">
                  {apartment.bathrooms || 0}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Warehouse className="w-5 h-5 text-gray-500" />
              <div className="flex items-center gap-4">
                <span className="text-gray-600 text-sm">Parking</span>
                <p className="font-medium text-gray-800">
                  {apartment.parking ? "Available" : "Not available"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Wrench className="w-5 h-5 text-gray-500" />
              <div className="flex items-center gap-4">
                <span className="text-gray-600 text-sm">Repair Type</span>
                <p className="font-medium text-gray-800">
                  {apartment.repair_type || "Not specified"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Amenities */}
        {apartment.amenities && apartment.amenities.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Amenities
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {apartment.amenities.map((amenity: string, index: number) => (
                <div
                  key={`${amenity}-${index}`}
                  className="flex items-center gap-3 p-2 rounded-md transition-colors text-gray-700 hover:bg-gray-50"
                >
                  {amenityIcons[amenity as keyof typeof amenityIcons] || (
                    <Building className="w-4 h-4 flex-shrink-0" />
                  )}
                  <span className="text-sm">
                    {amenity.charAt(0).toUpperCase() +
                      amenity.slice(1).replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Features */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Additional Features
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Sofa className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                Air Conditioning: {apartment.air_conditioning ? "Yes" : "No"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                Balcony: {apartment.balcony ? "Yes" : "No"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                Elevator: {apartment.elevator ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
