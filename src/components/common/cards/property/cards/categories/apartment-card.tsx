import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { isNewProperty } from "@/utils/is-new-property";
import { MapPin, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import HeartButton from "@/components/common/buttons/heart-button";
import type { PropertyType } from "@/interfaces/property/property.interface";

export default function ApartmentCard({
  property,
}: {
  property: PropertyType;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="rounded-md shadow-xl h-full overflow-hidden hover:shadow-2xl transition-shadow duration-300">
      <div className="w-full h-48 relative">
        {property.photos && (
          <img
            className="w-full h-full object-cover cursor-pointer"
            src={
              property.photos[
                Math.floor(Math.random() * property.photos?.length)
              ]
            }
            alt={property.title}
            onClick={() => navigate(`/property/${property._id}`)}
          />
        )}
        <div className="absolute top-2 flex items-center justify-between w-full px-2">
          <span></span>
          <HeartButton property={property} />
        </div>
        <button
          onClick={() =>
            navigate(
              `/map?lng=${property.location.coordinates[0]}&lat=${property.location.coordinates[1]}`
            )
          }
          className="border-white border p-2 rounded bg-white/60 absolute right-2 bottom-2"
        >
          <MapPin size={18} />
        </button>

        {/* Qo'shimcha status badge'lar */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isNewProperty(property?.createdAt) && (
            <Badge className="bg-[#333]/70 rounded uppercase w-full border-white text-xs">
              {t("pages.property_card.new")}
            </Badge>
          )}
          {property.is_premium && (
            <Badge className="bg-yellow-500 text-black text-xs">
              {t("pages.property_card.premium")}
            </Badge>
          )}
        </div>
      </div>
      <div className="p-3">
        <div className="flex items-start justify-between mb-2">
          <p className="font-semibold text-sm line-clamp-2 flex-1 mr-2">
            {property.title}
          </p>
          <div className="flex items-center gap-1 flex-shrink-0">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={
                    i < Math.round(property.rating)
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>
            <span className="text-sm">{property.rating.toFixed(1)}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-gray-600 mb-3">
          <MapPin size={14} />
          <p className="text-xs line-clamp-1">{property.address}</p>
        </div>

        {/* Qo'shimcha mulk ma'lumotlari */}
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
          {property.area && property.area > 0 && (
            <span>{property.area} m²</span>
          )}
          {property.bedrooms && property.bedrooms > 0 && (
            <span>
              {property.bedrooms} {t("pages.property_card.bedrooms")}
            </span>
          )}
          {property.bathrooms && property.bathrooms > 0 && (
            <span>
              {property.bathrooms} {t("pages.property_card.bathrooms")}
            </span>
          )}
        </div>

        <p className="font-bold text-lg">
          RM {property.price?.toLocaleString()}
        </p>
      </div>
    </div>
  );
}