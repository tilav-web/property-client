import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { useCurrentLanguage } from "@/hooks/use-language";
import type { IProperty } from "@/interfaces/property.interface";
import { userService } from "@/services/user.service";
import { useUserStore } from "@/stores/user.store";
import { isNewProperty } from "@/utils/is-new-property";
import { serverUrl } from "@/utils/shared";
import { Heart, MapPin, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PropertyMiniCard({
  property,
}: {
  property: IProperty;
}) {
  const { t } = useTranslation();
  // Rasm URL'ini olish
  const mainImage =
    property.photos && property.photos.length > 0
      ? `${serverUrl}/uploads${property.photos[0].file_path}`
      : property.logo || "/default-property.jpg";

  const { user, setUser } = useUserStore();
  const { getLocalizedText } = useCurrentLanguage();

  // Narx formati
  const getPriceDisplay = () => {
    const formattedPrice = property.price.toLocaleString();
    const currencySymbol = t(`pages.property_card.currency_symbols.${property.currency}`);
    const priceFormat = t(`pages.property_mini_card.price_formats.${property.price_type}`);
    return `${formattedPrice} ${currencySymbol} ${priceFormat}`;
  };

  // Reytingni hisoblash (agar mavjud bo'lmasa)
  const rating = property.rating || 0;

  const handleLike = async (id: string) => {
    try {
      const data = await userService.handleLike(id);
      setUser(data);
    } catch (error) {
      console.error(error);
    }
  };
  const navigate = useNavigate();

  return (
    <div className="rounded-md shadow-xl h-full overflow-hidden hover:shadow-2xl transition-shadow duration-300">
      <div className="w-full h-48 relative">
        <img
          className="w-full h-full object-cover cursor-pointer"
          src={mainImage}
          alt={getLocalizedText(property.title)}
          onClick={() => navigate(`/property/${property?._id}`)}
        />
        <div className="absolute top-2 flex items-center justify-between w-full px-2">
          <span></span>
          <button
            onClick={() => handleLike(property?._id)}
            className="p-1 rounded bg-white/40 border"
          >
            <Heart
              size={18}
              className={`${
                user?.likes?.includes(property?._id)
                  ? "fill-red-500 text-red-500"
                  : ""
              }`}
            />
          </button>
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
            <Badge className="bg-yellow-500 text-black text-xs">{t("pages.property_card.premium")}</Badge>
          )}
        </div>
      </div>
      <div className="p-3">
        <div className="flex items-start justify-between mb-2">
          <p className="font-semibold text-sm line-clamp-2 flex-1 mr-2">
            {getLocalizedText(property.title)}
          </p>
          <div className="flex items-center gap-1 flex-shrink-0">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={
                    i < Math.round(rating)
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>
            <span className="text-sm">{rating.toFixed(1)}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-gray-600 mb-3">
          <MapPin size={14} />
          <p className="text-xs line-clamp-1">
            {getLocalizedText(property.address)}
          </p>
        </div>

        {/* Qo'shimcha mulk ma'lumotlari */}
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
          {property.area > 0 && <span>{property.area} m²</span>}
          {property.bedrooms > 0 && <span>{property.bedrooms} {t("pages.property_card.bedrooms")}</span>}
          {property.bathrooms > 0 && <span>{property.bathrooms} {t("pages.property_card.bathrooms")}</span>}
        </div>

        <p className="font-bold text-lg">{getPriceDisplay()}</p>

        {/* Qurilish holati */}
        {property.construction_status !== "ready" && (
          <div className="mt-2">
            <Badge variant="outline" className="text-xs">
              {t(`enums.construction_status.${property.construction_status}`)}
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
}
