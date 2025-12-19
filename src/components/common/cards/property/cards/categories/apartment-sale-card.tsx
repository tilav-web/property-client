import BidPriceButton from "@/components/common/buttons/bid-price-button";
import CallButton from "@/components/common/buttons/call-button";
import EllipsisVerticalButton from "@/components/common/buttons/ellipsis-vertical-button";
import HeartButton from "@/components/common/buttons/heart-button";
import MailButton from "@/components/common/buttons/mail-button";
import WhatsAppButton from "@/components/common/buttons/whats-app-button";
import type { IApartmentSale } from "@/interfaces/property/categories/apartment-sale.interface";
import { isNewProperty } from "@/utils/is-new-property";
import { Badge, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function ApartmentSaleCard({
  apartment,
}: {
  apartment: IApartmentSale;
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-black">
      <div className="flex flex-col lg:flex-row items-stretch gap-4 lg:p-2">
        <div className="w-full lg:max-w-[320px] h-[240px] relative">
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

          <div className="absolute top-2 left-2 flex flex-col gap-2">
            {isNewProperty(apartment.createdAt) && (
              <Badge className="bg-[#333]/70 rounded uppercase w-full border-white text-xs">
                {t("pages.property_card.new")}
              </Badge>
            )}
          </div>

          {apartment.location?.coordinates && (
            <button
              onClick={() =>
                navigate(
                  `/map?lng=${apartment.location.coordinates[0]}&lat=${apartment.location.coordinates[1]}`
                )
              }
              className="p-2 bg-white border absolute right-4 bottom-4 rounded-md"
            >
              <MapPin className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-between gap-3 px-2 pb-2">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-2 items-center">
              <p className="text-sm text-gray-600">
                {t(`categories.${apartment.category}`)}
              </p>
            </div>

            <p className="text-xl lg:text-2xl font-bold text-[#FF0000]">
              {apartment.price.toLocaleString()} so'm
            </p>
          </div>
          <p className="text-sm hidden lg:block md:text-base text-gray-700 font-bold line-clamp-2">
            {apartment.title}
          </p>
          <p className="text-sm hidden lg:block lg:text-base text-gray-700 line-clamp-2">
            {apartment.description}
          </p>

          <div className="flex items-center gap-2 text-gray-500">
            <MapPin className="w-4 h-4 hidden lg:block" />
            <p className="text-sm">{apartment.address}</p>
          </div>
        </div>

        <div className="hidden lg:block">
          {apartment.is_premium && (
            <p className="text-center text-[#B78A00] uppercase text-sm">
              {t("pages.property_card.premium")}
            </p>
          )}
        </div>
      </div>

      <div className="bg-[#B7B7B7] p-3 lg:p-2 rounded-b-xl">
        <div className="flex flex-col lg:flex-row items-center gap-3 justify-between">
          <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
            <BidPriceButton property={apartment} />
            {/* {"contract_file" in property && apartment.contract_file && (
              <OnlineContractButton file={apartment.contract_file} />
            )} */}
          </div>

          <div className="flex flex-wrap gap-2 justify-center lg:justify-end">
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
      </div>
    </div>
  );
}
