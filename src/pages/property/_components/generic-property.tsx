import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Bed,
  Building,
  Building2,
  Eye,
  Maximize,
  MessageSquare,
  Rotate3D,
  ShieldCheck,
  Shirt,
  UserCheck,
  Warehouse,
  Waves,
  Home,
  Wrench,
  Layers,
  Zap,
  Droplets,
  Flame,
  Car,
  LandPlot,
} from "lucide-react";
import BackButton from "@/components/common/buttons/back-button";
import Price from "@/components/common/price";
import OnlineContractButton from "@/components/common/buttons/online-contract-button";
import CallButton from "@/components/common/buttons/call-button";
import MailButton from "@/components/common/buttons/mail-button";
import WhatsAppButton from "@/components/common/buttons/whats-app-button";
import MessageSellerButton from "@/components/common/buttons/message-seller-button";
import HeartButton from "@/components/common/buttons/heart-button";
import ShareButton from "@/components/common/buttons/share-button";
import SaveButton from "@/components/common/buttons/save-button";
import CommentButton from "@/components/common/buttons/comment-button";
import PropertyMediaGallery from "./property-media-gallery";
import BidPriceButton from "@/components/common/buttons/bid-price-button";
import InstagramButton from "@/components/common/buttons/instagram-button";
import TelegramButton from "@/components/common/buttons/telegram-button";
import { googleMapKey } from "@/utils/shared";

const amenityIcons: Record<string, React.ReactNode> = {
  pool: <Waves className="w-4 h-4 flex-shrink-0" />,
  balcony: <Building className="w-4 h-4 flex-shrink-0" />,
  security: <ShieldCheck className="w-4 h-4 flex-shrink-0" />,
  air_conditioning: <Shirt className="w-4 h-4 flex-shrink-0" />,
  parking: <Warehouse className="w-4 h-4 flex-shrink-0" />,
  elevator: <UserCheck className="w-4 h-4 flex-shrink-0" />,
};

let googleMapsPromise: Promise<void> | null = null;
function loadGoogleMapsScript(): Promise<void> {
  if (googleMapsPromise) return googleMapsPromise;
  if (window.google?.maps) {
    googleMapsPromise = Promise.resolve();
    return googleMapsPromise;
  }
  googleMapsPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(script);
  });
  return googleMapsPromise;
}

function PropertyMap({ coordinates }: { coordinates: [number, number] }) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (!coordinates) return;
    let destroyed = false;
    const [lng, lat] = coordinates;

    loadGoogleMapsScript().then(() => {
      if (destroyed || !mapContainerRef.current) return;
      const position = { lat, lng };
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setCenter(position);
        mapInstanceRef.current.setZoom(15);
        markerRef.current?.setPosition(position);
        return;
      }
      const map = new google.maps.Map(mapContainerRef.current, {
        center: position,
        zoom: 15,
        zoomControl: true,
        fullscreenControl: true,
        mapTypeControl: false,
        streetViewControl: false,
      });
      const marker = new google.maps.Marker({ position, map });
      mapInstanceRef.current = map;
      markerRef.current = marker;
    });

    return () => {
      destroyed = true;
      markerRef.current?.setMap(null);
      markerRef.current = null;
      mapInstanceRef.current = null;
    };
  }, [coordinates]);

  if (!coordinates) {
    return (
      <div className="w-full h-[30vh] lg:h-[60vh] rounded-2xl bg-muted flex items-center justify-center">
        <span className="text-muted-foreground">{t("common.no_coordinates_available")}</span>
      </div>
    );
  }

  return (
    <div className="w-full h-[30vh] lg:h-[60vh] rounded-xl overflow-hidden">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}

function BooleanBadge({ value, t }: { value: boolean; t: (k: string) => string }) {
  return (
    <span className={`text-sm font-medium ${value ? "text-green-600" : "text-red-500"}`}>
      {value ? t("pages.property_page.yes") : t("pages.property_page.no")}
    </span>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CategoryDetails({ p, t }: { p: any; t: (k: string, opts?: any) => string }) {
  const cat: string = p.category;

  // --- COMMERCIAL ---
  if (cat === "COMMERCIAL_SALE" || cat === "COMMERCIAL_RENT") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          <DetailRow icon={<Building2 />} label={t("pages.property_page.category")} value={t(`categories.${cat}`)} />
          {p.floor_level != null && (
            <DetailRow icon={<Rotate3D />} label={t("pages.property_page.floor")} value={`${p.floor_level} / ${p.total_floors ?? "—"}`} />
          )}
          {p.heating && (
            <DetailRow icon={<Home />} label={t("pages.property_page.heating")} value={t(`enums.heating_type.${p.heating}`)} />
          )}
          {cat === "COMMERCIAL_RENT" && p.contract_duration_months && (
            <DetailRow icon={<Layers />} label={t("pages.property_page.contract_duration")} value={`${p.contract_duration_months} ${t("common.months", { defaultValue: "oy" })}`} />
          )}
        </div>
        <div className="space-y-4">
          {p.area && <DetailRow icon={<Maximize />} label={t("pages.property_page.area")} value={`${p.area} ${t("pages.property_page.sq_m")}`} />}
          {p.repair_type && (
            <DetailRow icon={<Wrench />} label={t("pages.property_page.repair_type")} value={t(`enums.repair_type.${p.repair_type}`)} />
          )}
          {cat === "COMMERCIAL_SALE" && p.mortgage_available != null && (
            <DetailRow icon={<Building />} label={t("pages.property_page.mortgage")} value={<BooleanBadge value={p.mortgage_available} t={t} />} />
          )}
        </div>
      </div>
    );
  }

  // --- HOVLI ---
  if (cat === "HOVLI_SALE" || cat === "HOVLI_RENT") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          <DetailRow icon={<Building2 />} label={t("pages.property_page.category")} value={t(`categories.${cat}`)} />
          {p.rooms != null && <DetailRow icon={<Bed />} label={t("pages.property_page.rooms", { defaultValue: "Xonalar" })} value={p.rooms} />}
          {p.floors != null && <DetailRow icon={<Layers />} label={t("pages.property_page.floors", { defaultValue: "Qavatlar" })} value={p.floors} />}
          {p.heating && (
            <DetailRow icon={<Home />} label={t("pages.property_page.heating")} value={t(`enums.heating_type.${p.heating}`)} />
          )}
          {cat === "HOVLI_RENT" && p.contract_duration_months && (
            <DetailRow icon={<Layers />} label={t("pages.property_page.contract_duration")} value={`${p.contract_duration_months} ${t("common.months", { defaultValue: "oy" })}`} />
          )}
        </div>
        <div className="space-y-4">
          {p.area && <DetailRow icon={<Maximize />} label={t("pages.property_page.area")} value={`${p.area} m²`} />}
          {p.land_area && <DetailRow icon={<LandPlot />} label={t("pages.property_page.land_area", { defaultValue: "Yer maydoni" })} value={`${p.land_area} m²`} />}
          {p.repair_type && (
            <DetailRow icon={<Wrench />} label={t("pages.property_page.repair_type")} value={t(`enums.repair_type.${p.repair_type}`)} />
          )}
          {cat === "HOVLI_SALE" && p.mortgage_available != null && (
            <DetailRow icon={<Building />} label={t("pages.property_page.mortgage")} value={<BooleanBadge value={p.mortgage_available} t={t} />} />
          )}
        </div>
      </div>
    );
  }

  // --- LAND ---
  if (cat === "LAND_SALE" || cat === "LAND_RENT") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          <DetailRow icon={<Building2 />} label={t("pages.property_page.category")} value={t(`categories.${cat}`)} />
          {p.area && <DetailRow icon={<Maximize />} label={t("pages.property_page.area")} value={`${p.area} m²`} />}
          {p.land_type && (
            <DetailRow icon={<LandPlot />} label={t("pages.property_page.land_type", { defaultValue: "Yer turi" })} value={t(`enums.land_type.${p.land_type}`, { defaultValue: p.land_type })} />
          )}
        </div>
        <div className="space-y-4">
          <DetailRow icon={<Zap />} label={t("pages.property_page.electricity", { defaultValue: "Elektr" })} value={<BooleanBadge value={!!p.is_electricity} t={t} />} />
          <DetailRow icon={<Droplets />} label={t("pages.property_page.water", { defaultValue: "Suv" })} value={<BooleanBadge value={!!p.is_water} t={t} />} />
          <DetailRow icon={<Flame />} label={t("pages.property_page.gas", { defaultValue: "Gaz" })} value={<BooleanBadge value={!!p.is_gas} t={t} />} />
          <DetailRow icon={<Car />} label={t("pages.property_page.road_access", { defaultValue: "Yo'l" })} value={<BooleanBadge value={!!p.road_access} t={t} />} />
          {cat === "LAND_SALE" && p.mortgage_available != null && (
            <DetailRow icon={<Building />} label={t("pages.property_page.mortgage")} value={<BooleanBadge value={p.mortgage_available} t={t} />} />
          )}
        </div>
      </div>
    );
  }

  // --- GARAGE ---
  if (cat === "GARAGE_SALE" || cat === "GARAGE_RENT") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          <DetailRow icon={<Building2 />} label={t("pages.property_page.category")} value={t(`categories.${cat}`)} />
          {p.area && <DetailRow icon={<Maximize />} label={t("pages.property_page.area")} value={`${p.area} m²`} />}
        </div>
        <div className="space-y-4">
          <DetailRow icon={<Wrench />} label={t("pages.property_page.pit", { defaultValue: "Ko'rikxona" })} value={<BooleanBadge value={!!p.has_pit} t={t} />} />
          <DetailRow icon={<Zap />} label={t("pages.property_page.electricity", { defaultValue: "Elektr" })} value={<BooleanBadge value={!!p.has_electricity} t={t} />} />
          <DetailRow icon={<Home />} label={t("pages.property_page.heated", { defaultValue: "Isitish" })} value={<BooleanBadge value={!!p.is_heated} t={t} />} />
          {cat === "GARAGE_SALE" && p.mortgage_available != null && (
            <DetailRow icon={<Building />} label={t("pages.property_page.mortgage")} value={<BooleanBadge value={p.mortgage_available} t={t} />} />
          )}
        </div>
      </div>
    );
  }

  // fallback
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="space-y-4">
        <DetailRow icon={<Building2 />} label={t("pages.property_page.category")} value={t(`categories.${cat}`, { defaultValue: cat })} />
        {p.area && <DetailRow icon={<Maximize />} label={t("pages.property_page.area")} value={`${p.area} m²`} />}
      </div>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-5 h-5 text-gray-500 flex-shrink-0">{icon}</span>
      <div className="flex items-center gap-4">
        <span className="text-muted-foreground text-sm">{label}</span>
        <p className="font-medium text-gray-800">{value}</p>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function GenericProperty({ property }: { property: any }) {
  const { t } = useTranslation();
  const p = property;

  if (!p) {
    return (
      <div className="py-8">
        <BackButton className="mb-6" />
        <div className="text-center py-20">
          <div className="text-gray-500">{t("common.no_data_available")}</div>
        </div>
      </div>
    );
  }

  const isSale = p.category?.endsWith("_SALE");

  return (
    <div className="py-8">
      <BackButton className="mb-6" />

      <PropertyMediaGallery
        photos={p.photos}
        videos={p.videos}
        isPremium={p.is_premium}
      />

      <div className="flex flex-col lg:flex-row items-start gap-4 mb-8">
        <div className="w-full lg:w-1/2">
          {p.location?.coordinates && (
            <PropertyMap coordinates={p.location.coordinates as [number, number]} />
          )}
        </div>
        <div className="w-full lg:w-1/2">
          <div className="mb-12">
            <div className="flex items-center justify-between font-bold mb-4">
              {p.contract_file && <OnlineContractButton file={p.contract_file} />}
              <div className="flex items-center gap-2 flex-wrap justify-end">
                {p.author?._id && (
                  <MessageSellerButton sellerId={p.author._id} propertyId={p._id} />
                )}
                <ShareButton property={p} />
                <SaveButton property={p} />
                <CommentButton property={p} />
                {p.author?.phone?.value && <CallButton phone={p.author.phone.value} />}
                {p.author?.email?.value && <MailButton mail={p.author.email.value} />}
                {p.author?.seller?.whatsapp && <WhatsAppButton phone={p.author.seller.whatsapp} />}
                {p.author?.seller?.instagram && <InstagramButton username={p.author.seller.instagram} />}
                {p.author?.seller?.telegram && <TelegramButton username={p.author.seller.telegram} />}
                <HeartButton property={p} />
              </div>
            </div>
            <div className="font-bold flex items-center justify-end gap-8">
              <Price
                amount={p.price || 0}
                currency={p.currency}
                className="text-2xl md:text-3xl text-red-500 justify-end"
                originalClassName="text-base text-gray-500"
              />
              <BidPriceButton property={p} />
            </div>
          </div>
          <div>
            <h2 className="mb-4 font-display text-2xl text-foreground">{p.title}</h2>
            <p className="mb-4 text-muted-foreground">{p.description}</p>
            <ul className="space-y-1 text-muted-foreground">
              <li className="before:content-['-'] before:mr-2 before:text-foreground">
                <span className="font-medium">{t("pages.property_page.address")}:</span> {p.address}
              </li>
              <li className="before:content-['-'] before:mr-2 before:text-foreground">
                <span className="font-medium">{t("pages.property_page.category")}:</span> {t(`categories.${p.category}`, { defaultValue: p.category })}
              </li>
              {p.furnished != null && (
                <li className="before:content-['-'] before:mr-2 before:text-foreground">
                  <span className="font-medium">{t("pages.property_page.furnished")}:</span>{" "}
                  {t(p.furnished ? "pages.property_page.yes" : "pages.property_page.no")}
                </li>
              )}
            </ul>
            {(!!p.viewCount || !!p.inquiryCount) && (
              <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                {!!p.viewCount && (
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {p.viewCount}
                  </span>
                )}
                {!!p.inquiryCount && (
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    {p.inquiryCount}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          {t("pages.property_page.property_details")}
        </h2>
        <CategoryDetails p={p} t={t} />

        {p.amenities && p.amenities.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {t("pages.property_page.amenities")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {p.amenities.map((amenity: string, i: number) => (
                <div
                  key={`${amenity}-${i}`}
                  className="flex items-center gap-3 p-2 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  {amenityIcons[amenity] ?? <Building className="w-4 h-4 flex-shrink-0" />}
                  <span className="text-sm">{t(`enums.amenities.${amenity}`, { defaultValue: amenity })}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {isSale && p.mortgage_available && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-green-800 font-medium">
              ✓ {t("pages.property_page.mortgage_available", { defaultValue: "Ipoteka mumkin" })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
