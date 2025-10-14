import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { useCurrentLanguage } from "@/hooks/use-language";
import type { IProperty } from "@/interfaces/property.interface";
import { serverUrl } from "@/utils/shared";
import { MapPin, Mail, MousePointer2, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PropertyBannerCard({
  property,
}: {
  property: IProperty;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getLocalizedText } = useCurrentLanguage();

  const mainImage = (() => {
    if (!property?.photos || property.photos.length === 0) return null;

    const mainPhoto = property.photos.find((photo) =>
      photo.file_name.startsWith("banner-")
    );

    return mainPhoto?.file_path || property.photos[0]?.file_path || null;
  })();

  // Yetkazib berish sanasini formatlash
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("uz-UZ");
  };

  return (
    <div className="w-full h-[302px] relative my-2 rounded-md overflow-hidden">
      <img
        className="w-full h-full object-cover"
        src={`${serverUrl}/uploads/${mainImage}`}
        alt={getLocalizedText(property.title)}
        onClick={() => navigate(`/property/${property?._id}`)}
      />
      <div className="flex flex-col absolute top-2 left-2 gap-1">
        <Badge className="uppercase bg-black/10">
          {t(`enums.construction_status.${property.construction_status}`)}
        </Badge>
        {property.delivery_date && (
          <Badge className="uppercase bg-black/10">
            {t("pages.property_banner_card.delivery")}: {formatDate(property.delivery_date)}
          </Badge>
        )}
        {property.sales_date && (
          <Badge className="uppercase bg-red-400">
            {t("pages.property_banner_card.sales_started")}: {formatDate(property.sales_date)}
          </Badge>
        )}
      </div>
      <div className="absolute bottom-2 left-2 text-white">
        <p className="text-2xl">{getLocalizedText(property.title)}</p>
        <div className="flex items-center gap-1 mb-4">
          <MapPin size={18} />
          <p>{getLocalizedText(property.address)}</p>
        </div>
        {/* property.beds o'rniga bedrooms ishlatiladi */}
        {property.bedrooms > 0 && <p>{property.bedrooms} {t("pages.property_card.bedrooms")}</p>}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <p>{t("pages.property_banner_card.price")}:</p>
            <p>
              {property.price.toLocaleString()}{" "}
              {t(`pages.property_card.currency_symbols.${property.currency}`)}
              {property.price_type === "rent" && t("pages.property_card.price_formats.per_month")}
            </p>
          </div>
          {property.payment_plans > 0 && (
            <Badge className="bg-white text-blue-900 hidden md:block">
              {property.payment_plans} {t("pages.property_banner_card.payment_plans")}
            </Badge>
          )}
        </div>
      </div>
      {property.logo && (
        <div className="absolute top-2 right-2 h-[54px] w-[70px]">
          <img
            className="w-full h-full object-cover"
            src={property.logo}
            alt="logo"
          />
        </div>
      )}
      <div className="absolute bottom-2 right-2 items-center gap-4 hidden sm:flex">
        <button className="flex items-center bg-white rounded px-3 py-1 gap-2 w-full mg:w-auto">
          <Phone size={18} />
          <span>{t("common.buttons.call")}</span>
        </button>
        <button className="flex items-center bg-white rounded px-3 py-1 gap-2 w-full mg:w-auto">
          <Mail size={18} />
          <span>{t("common.buttons.email")}</span>
        </button>
        <button className="flex items-center bg-white rounded px-3 py-1 gap-2 w-full mg:w-auto">
          <MousePointer2 size={18} />
          <span>{t("common.buttons.whatsapp")}</span>
        </button>
      </div>
    </div>
  );
}
