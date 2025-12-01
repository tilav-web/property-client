import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { isNewProperty } from "@/utils/is-new-property";
import { MapPin, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import HeartButton from "@/components/common/buttons/heart-button";
import type { IApartmentRent } from "@/interfaces/property/categories/apartment-rent.interface";

export default function ApartmentRentCard({
  apartment,
}: {
  apartment: IApartmentRent;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="rounded-md shadow-xl h-full overflow-hidden hover:shadow-2xl transition-shadow duration-300">
      <div className="w-full h-48 relative">
        {apartment.photos && (
          <img
            className="w-full h-full object-cover cursor-pointer"
            src={
              apartment.photos[
                Math.floor(Math.random() * apartment.photos?.length)
              ]
            }
            alt={apartment.title}
            onClick={() => navigate(`/property/${apartment._id}`)}
          />
        )}
        <div className="absolute top-2 flex items-center justify-between w-full px-2">
          <span></span>
          <HeartButton property={apartment} />
        </div>
        <button
          onClick={() =>
            navigate(
              `/map?lng=${apartment.location.coordinates[0]}&lat=${apartment.location.coordinates[1]}`
            )
          }
          className="border-white border p-2 rounded bg-white/60 absolute right-2 bottom-2"
        >
          <MapPin size={18} />
        </button>

        {/* Qo'shimcha status badge'lar */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isNewProperty(apartment?.createdAt) && (
            <Badge className="bg-[#333]/70 rounded uppercase w-full border-white text-xs">
              {t("pages.property_card.new")}
            </Badge>
          )}
          {apartment.is_premium && (
            <Badge className="bg-yellow-500 text-black text-xs">
              {t("pages.property_card.premium")}
            </Badge>
          )}
        </div>
      </div>
      <div className="p-3">
        <div className="flex items-start justify-between mb-2">
          <p className="font-semibold text-sm line-clamp-2 flex-1 mr-2">
            {apartment.title}
          </p>
          <div className="flex items-center gap-1 flex-shrink-0">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={
                    i < Math.round(apartment.rating)
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>
            <span className="text-sm">{apartment.rating.toFixed(1)}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-gray-600 mb-3">
          <MapPin size={14} />
          <p className="text-xs line-clamp-1">{apartment.address}</p>
        </div>

        {/* Qo'shimcha mulk ma'lumotlari */}
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
          {apartment.area && apartment.area > 0 && (
            <span>{apartment.area} m²</span>
          )}
          {apartment.bedrooms && apartment.bedrooms > 0 && (
            <span>
              {apartment.bedrooms} {t("pages.property_card.bedrooms")}
            </span>
          )}
          {apartment.bathrooms && apartment.bathrooms > 0 && (
            <span>
              {apartment.bathrooms} {t("pages.property_card.bathrooms")}
            </span>
          )}
        </div>

        <p className="font-bold text-lg">
          {apartment.price.toLocaleString()} so'm
        </p>
      </div>
    </div>
  );
}
