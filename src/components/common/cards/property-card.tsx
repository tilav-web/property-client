import { Camera, CirclePlay, MapPin, ShieldCheck } from "lucide-react";
import { Badge } from "../../ui/badge";
import CallButton from "../buttons/call-button";
import MailButton from "../buttons/mail-button";
import WhatsAppButton from "../buttons/whats-app-button";
import HeartButton from "../buttons/heart-button";
import EllipsisVerticalButton from "../buttons/ellipsis-vertical-button";
import OnlineContractButton from "../buttons/online-contract-button";
import BidPriceButton from "../buttons/bid-price-button";

import type { IProperty, PropertyCategory } from "@/interfaces/property.interface";

export default function PropertyCard({
  property,
}: {
  property: IProperty;
}) {
  // Rasm URL'ini olish
  const mainImage = property.photos && property.photos.length > 0 
    ? property.photos[0].file_path 
    : property.logo || "/default-property.jpg";

  // Rasmlar va videolar sonini hisoblash
  const photoCount = property.photos?.length || 0;
  const videoCount = property.videos?.length || 0;

  // Narx formati
  const getPriceDisplay = () => {
    const formattedPrice = property.price.toLocaleString();
    switch (property.price_type) {
      case "sale":
        return `${formattedPrice} so'm`;
      case "rent":
        return `${formattedPrice} so'm/oy`;
      case "total_price":
        return `${formattedPrice} so'm (umumiy)`;
      default:
        return `${formattedPrice} so'm`;
    }
  };

  // Kategoriya nomini formatlash
  const getCategoryDisplay = () => {
    const categoryMap: Record<PropertyCategory, string> = {
      apartment: "Kvartira",
      house: "Uy",
      villa: "Villa",
      office: "Ofis",
      land: "Yer",
      shop: "Do'kon",
      garage: "Garaj"
    };
    return categoryMap[property.category] || property.category;
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden">
      <div className="flex flex-col lg:flex-row items-stretch gap-4 lg:p-2">
        <div className="w-full lg:max-w-[320px] h-[240px] relative">
          <img
            className="w-full h-full object-cover"
            src={mainImage}
            alt={property.title}
          />
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            {property.is_verified && (
              <Badge className="bg-[#00A663] rounded border-white text-xs flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span className="uppercase">Tasdiqlangan</span>
              </Badge>
            )}
            {property.is_new && (
              <Badge className="bg-[#333]/70 rounded uppercase w-full border-white text-xs">
                Yangi
              </Badge>
            )}
          </div>
          <button className="p-2 bg-white border absolute right-4 bottom-4 rounded-md">
            <MapPin className="w-4 h-4" />
          </button>
          <Badge className="bg-black/80 rounded-none absolute bottom-0 left-0 text-xs flex items-center gap-1">
            <Camera className="w-3 h-3" />
            <span>{photoCount}</span>
            <CirclePlay className="w-3 h-3" />
            <span>{videoCount}</span>
          </Badge>
        </div>
        <div className="flex-1 flex flex-col justify-between gap-3">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-600">{getCategoryDisplay()}</p>
            <p className="text-xl lg:text-2xl font-bold text-[#FF0000]">
              {getPriceDisplay()}
            </p>
          </div>
          <p className="text-sm lg:text-base text-gray-700 line-clamp-2">
            {property.description}
          </p>
          <div className="flex items-center gap-2 text-gray-500">
            <MapPin className="w-4 h-4" />
            <p className="text-sm">{property.address}</p>
          </div>
          {/* Qo'shimcha mulk ma'lumotlari */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            {property.area > 0 && (
              <span>Maydon: {property.area} m²</span>
            )}
            {property.bedrooms > 0 && (
              <span>{property.bedrooms} xona</span>
            )}
            {property.bathrooms > 0 && (
              <span>{property.bathrooms} hammom</span>
            )}
          </div>
        </div>
        <div className="hidden lg:block">
          {property.logo && (
            <div className="w-[95px] h-[125px] border rounded overflow-hidden">
              <img
                src={property.logo}
                alt="logo"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          {property.is_premium && (
            <p className="text-center text-[#B78A00] uppercase text-sm">
              Premium
            </p>
          )}
        </div>
      </div>
      <div className="bg-[#B7B7B7] p-3 lg:p-2 rounded-b-xl">
        <div className="flex flex-col lg:flex-row items-center gap-3 justify-between">
          <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
            <BidPriceButton />
            <OnlineContractButton />
          </div>
          <div className="flex flex-wrap gap-2 justify-center lg:justify-end">
            <CallButton />
            <MailButton />
            <WhatsAppButton />
            <HeartButton />
            <EllipsisVerticalButton />
          </div>
        </div>
      </div>
    </div>
  );
}