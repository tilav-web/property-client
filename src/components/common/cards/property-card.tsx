import { useTranslation } from "react-i18next";
import { Camera, CirclePlay, MapPin, ShieldCheck } from "lucide-react";
import { Badge } from "../../ui/badge";
import CallButton from "../buttons/call-button";
import MailButton from "../buttons/mail-button";
import WhatsAppButton from "../buttons/whats-app-button";
import HeartButton from "../buttons/heart-button";
import EllipsisVerticalButton from "../buttons/ellipsis-vertical-button";
import OnlineContractButton from "../buttons/online-contract-button";
import BidPriceButton from "../buttons/bid-price-button";

import type { IProperty } from "@/interfaces/property.interface";
import { serverUrl } from "@/utils/shared";
import { useNavigate } from "react-router-dom";
import { isNewProperty } from "@/utils/is-new-property";
import { useCurrentLanguage } from "@/hooks/use-language";

export default function PropertyCard({ property }: { property: IProperty }) {
  const { t } = useTranslation();

  const photoImages =
    property?.photos
      ?.filter((p) => p.file_name.startsWith("photos-"))
      .map((p) => `${serverUrl}/uploads/${p.file_path}`) || [];

  const mainImage =
    photoImages.length > 0
      ? photoImages[Math.floor(Math.random() * photoImages.length)]
      : "/default-property?.jpg";

  // Rasmlar va videolar sonini hisoblash
  const photoCount = property?.photos?.length || 0;
  const videoCount = property?.videos?.length || 0;

  // Narx formati - purpose va price_type ga qarab
  const getPriceDisplay = () => {
    if (!property?.price) return t("pages.property_card.price_not_available");

    const formattedPrice = property.price.toLocaleString();
    const currencySymbol = t(
      `pages.property_card.currency_symbols.${property?.currency}`
    );

    switch (property.purpose) {
      case "for_sale":
        switch (property.price_type) {
          case "sale":
            return `${formattedPrice} ${currencySymbol}${t(
              "pages.property_card.price_formats.per_sqm"
            )}`;
          case "total_price":
            return `${formattedPrice} ${currencySymbol}${t(
              "pages.property_card.price_formats.total"
            )}`;
        }
        break;

      case "for_rent":
        if (property.price_type === "rent") {
          return `${formattedPrice} ${currencySymbol}${t(
            "pages.property_card.price_formats.per_month"
          )}`;
        }
        break;

      case "for_daily_rent":
        if (property.price_type === "rent") {
          return `${formattedPrice} ${currencySymbol}${t(
            "pages.property_card.price_formats.per_day"
          )}`;
        }
        break;

      case "for_commercial":
        if (property.price_type === "rent") {
          return `${formattedPrice} ${currencySymbol}${t(
            "pages.property_card.price_formats.per_month"
          )}`;
        }
        break;

      case "for_investment":
      case "auction":
        if (property.price_type === "total_price") {
          return `${formattedPrice} ${currencySymbol}${t(
            "pages.property_card.price_formats.total"
          )}`;
        }
        break;
    }

    return `${formattedPrice} ${currencySymbol}`;
  };

  const navigate = useNavigate();
  const { getLocalizedText } = useCurrentLanguage();

  return (
    <div className="bg-white rounded-xl overflow-hidden">
      <div className="flex flex-col lg:flex-row items-stretch gap-4 lg:p-2">
        <div className="w-full lg:max-w-[320px] h-[240px] relative">
          <img
            className="w-full h-full object-cover cursor-pointer"
            src={mainImage}
            alt={getLocalizedText(property?.title)}
            onClick={() => navigate(`/property/${property?._id}`)}
          />
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            {property?.is_verified && (
              <Badge className="bg-[#00A663] rounded border-white text-xs flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span className="uppercase">
                  {t("pages.property_card.verified")}
                </span>
              </Badge>
            )}
            {isNewProperty(property?.createdAt) && (
              <Badge className="bg-[#333]/70 rounded uppercase w-full border-white text-xs">
                {t("pages.property_card.new")}
              </Badge>
            )}
            {!property?.is_active && (
              <Badge className="bg-red-500 rounded uppercase w-full border-white text-xs">
                {t("pages.property_card.inactive")}
              </Badge>
            )}
          </div>
          <button
            onClick={() =>
              property?.location?.coordinates &&
              navigate(
                `/map?lng=${property?.location.coordinates[0]}&lat=${property?.location.coordinates[1]}`
              )
            }
            className="p-2 bg-white border absolute right-4 bottom-4 rounded-md"
          >
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
            <div className="flex flex-wrap gap-2 items-center">
              <p className="text-sm text-gray-600">
                {t(`enums.property_category.${property?.category}`)}
              </p>
              <span className="text-gray-400">•</span>
              <p className="text-sm text-gray-600">
                {t(`enums.property_purpose.${property?.purpose}`)}
              </p>
            </div>
            <p className="text-xl lg:text-2xl font-bold text-[#FF0000]">
              {getPriceDisplay()}
            </p>
          </div>
          <p className="text-sm lg:text-base text-gray-700 line-clamp-2">
            {getLocalizedText(property?.description)}
          </p>
          <div className="flex items-center gap-2 text-gray-500">
            <MapPin className="w-4 h-4" />
            <p className="text-sm">{getLocalizedText(property?.address)}</p>
          </div>
          {/* Qo'shimcha mulk ma'lumotlari */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            {property?.area > 0 && (
              <span>
                {t("pages.property_card.area")}: {property?.area} m²
              </span>
            )}
            {property?.bedrooms > 0 && (
              <span>
                {property?.bedrooms} {t("pages.property_card.bedrooms")}
              </span>
            )}
            {property?.bathrooms > 0 && (
              <span>
                {property?.bathrooms} {t("pages.property_card.bathrooms")}
              </span>
            )}
            {property?.floor_level && property?.floor_level > 0 && (
              <span>
                {property?.floor_level}
                {property?.total_floors
                  ? `/${property?.total_floors}`
                  : ""}{" "}
                {t("pages.property_card.floor")}
              </span>
            )}
            {property?.parking_spaces > 0 && (
              <span>
                {property?.parking_spaces} {t("pages.property_card.parking")}
              </span>
            )}
          </div>

          {/* Qurilish holati */}
          {property?.construction_status && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {t(
                  `enums.construction_status.${property?.construction_status}`
                )}
              </Badge>
            </div>
          )}
        </div>
        <div className="hidden lg:block">
          {property?.logo && (
            <div className="w-[95px] h-[125px] border rounded overflow-hidden">
              <img
                src={property?.logo}
                alt="logo"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          {property?.is_premium && (
            <p className="text-center text-[#B78A00] uppercase text-sm">
              {t("pages.property_card.premium")}
            </p>
          )}
          {/* Ko'rishlar soni */}
          {property?.view_count > 0 && (
            <p className="text-xs text-gray-500 text-center">
              {property?.view_count} {t("pages.property_card.views")}
            </p>
          )}
        </div>
      </div>
      <div className="bg-[#B7B7B7] p-3 lg:p-2 rounded-b-xl">
        <div className="flex flex-col lg:flex-row items-center gap-3 justify-between">
          <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
            <BidPriceButton />
            {property?.contract_file && (
              <OnlineContractButton file={property?.contract_file} />
            )}
          </div>
          <div className="flex flex-wrap gap-2 justify-center lg:justify-end">
            {property?.author?.phone?.value && (
              <CallButton phone={property?.author?.phone?.value} />
            )}
            {property?.author?.email?.value && (
              <MailButton mail={property?.author?.email?.value} />
            )}
            <WhatsAppButton />
            <HeartButton id={property?._id} />
            <EllipsisVerticalButton property={property} />
          </div>
        </div>
      </div>
    </div>
  );
}
