import { useUserStore } from "@/stores/user.store";
import { courtSvg } from "@/utils/shared";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Building, MapPin, TrendingDown, TrendingUp } from "lucide-react";
import { inquiryService } from "@/services/inquiry.service";
import type { TInquiryType } from "@/interfaces/inquiry/inquiry.interface";
import { toast } from "sonner";
import { useState, useCallback, useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import type { IApartmentSale } from "@/interfaces/property/categories/apartment-sale.interface";

interface InquiryDTO {
  property: string;
  type: TInquiryType;
  comment: string;
  offered_price?: number;
}

export default function BidPriceButton({
  property,
}: {
  property: IApartmentSale;
}) {
  const { user } = useUserStore();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Narx diapazoni: -30% dan +30% gacha
  const priceRange = useMemo(() => {
    const basePrice = property?.price || 0;
    return {
      min: Math.floor(basePrice * 0.7), // -30%
      max: Math.floor(basePrice * 1.3), // +30%
      base: basePrice,
    };
  }, [property?.price]);

  const [formData, setFormData] = useState({
    type: "purchase" as TInquiryType,
    offered_price: priceRange.base.toString(),
    comment: "",
  });

  // Narx foizi hisoblanishi
  const pricePercentage = useMemo(() => {
    const offered = Number(formData.offered_price);
    const base = priceRange.base;
    if (base === 0) return 0;
    return Math.round(((offered - base) / base) * 100);
  }, [formData.offered_price, priceRange.base]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.comment.trim()) {
      toast.error(t("common.buttons.bid_price_form.error_title"), {
        description: t("common.buttons.bid_price_form.error_empty_notes"),
      });
      return;
    }

    setIsLoading(true);

    const dto: InquiryDTO = {
      property: property?._id || "",
      type: formData.type,
      comment: formData.comment,
    };

    if (formData.offered_price) {
      dto.offered_price = Number(formData.offered_price);
    }

    try {
      await inquiryService.create(dto);
      toast.success(t("common.buttons.bid_price_form.success_title"), {
        description: t("common.buttons.bid_price_form.success_message"),
      });
      setFormData({
        type: "purchase" as TInquiryType,
        offered_price: priceRange.base.toString(),
        comment: "",
      });
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to submit inquiry:", error);
      toast.error(t("common.buttons.bid_price_form.error_title"), {
        description: t("common.buttons.bid_price_form.error_message"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = useCallback(
    (field: string, value: string | TInquiryType) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const handlePriceChange = useCallback((value: number[]) => {
    setFormData((prev) => ({
      ...prev,
      offered_price: value[0].toString(),
    }));
  }, []);

  // Agar foydalanuvchi e'lon egasi yoki foydalanuvchi ro'yxatdan o'tmagan bo'lsa
  if (user?._id === property?.author?._id || !user) {
    return (
      <button className="bg-[#FF990063] flex items-center gap-2 px-3 py-2 rounded border border-black text-sm min-w-0">
        <img src={courtSvg} alt="Court svg" className="w-4 h-4" />
        <span className="whitespace-nowrap line-through">
          {t("common.buttons.bid_price")}
        </span>
      </button>
    );
  }

  // Faqat APARTMENT_SALE uchun ko'rsatiladi
  if (property?.category !== "APARTMENT_SALE") {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="bg-[#FF990063] flex items-center gap-2 px-3 py-2 rounded border border-black text-sm min-w-0">
          <img src={courtSvg} alt="Court svg" className="w-4 h-4" />
          <span className="whitespace-nowrap">
            {t("common.buttons.bid_price")}
          </span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl h-[90vh] overflow-y-auto">
        <div className="w-full flex items-start flex-col lg:flex-row">
          <div className="lg:max-w-72 w-full h-full">
            <img
              className="w-full h-full object-cover"
              src={property.photos ? property.photos[0] : ""}
              alt={property?.title}
            />
          </div>
          <div className="p-4 space-y-4 flex-1">
            <div className="space-y-2">
              <h3 className="text-xl font-bold tracking-tight">
                {property?.title}
              </h3>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{property?.address}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Building className="h-4 w-4" />
                  <span>{property?.address}</span>
                </div>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium">Narxi</span>
                  </div>
                  <Badge variant="secondary" className="font-semibold">
                    {property?.price?.toLocaleString()}{" "}
                    {property?.currency?.toUpperCase()}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">Maydoni</span>
                  </div>
                  <Badge variant="secondary" className="font-semibold">
                    {property?.area} m²
                  </Badge>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm font-medium">Xonalar</span>
                  </div>
                  <Badge variant="secondary" className="font-semibold">
                    {property?.bedrooms} ta
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* So'rov formasi */}
        <div className="mt-6 p-6 border rounded-lg bg-slate-50">
          <h3 className="text-lg font-semibold mb-4">
            {t("common.buttons.bid_price_form.title")}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* So'rov turini tanlash */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {t("common.buttons.bid_price_form.inquiry_type")}
              </label>
              <div className="grid md:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleInputChange("type", "purchase")}
                  className={`p-3 border rounded-lg text-center transition-colors ${
                    formData.type === "purchase"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {t("common.buttons.bid_price_form.purchase")}
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange("type", "mortgage")}
                  className={`p-3 border rounded-lg text-center transition-colors ${
                    formData.type === "mortgage"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {t("common.buttons.bid_price_form.mortgage")}
                </button>
              </div>
            </div>

            {/* Narx slider */}
            <div className="space-y-4">
              <label className="block text-sm font-medium">
                {t("common.buttons.bid_price_form.offered_price")}
              </label>

              {/* Joriy narx ko'rsatkichi */}
              <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">
                    {t("common.buttons.bid_price_form.your_offer")}
                  </span>
                  <div className="flex items-center gap-2">
                    {pricePercentage < 0 ? (
                      <TrendingDown className="h-4 w-4 text-green-600" />
                    ) : pricePercentage > 0 ? (
                      <TrendingUp className="h-4 w-4 text-red-600" />
                    ) : null}
                    <span
                      className={`text-sm font-semibold ${
                        pricePercentage < 0
                          ? "text-green-600"
                          : pricePercentage > 0
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      {pricePercentage > 0 && "+"}
                      {pricePercentage}%
                    </span>
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {Number(formData.offered_price).toLocaleString()}{" "}
                  <span className="text-xl text-gray-600">
                    {property?.currency?.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Slider */}
              <div className="space-y-3">
                <Slider
                  value={[Number(formData.offered_price)]}
                  onValueChange={handlePriceChange}
                  min={priceRange.min}
                  max={priceRange.max}
                  step={Math.floor(priceRange.base * 0.01)} // 1% qadamlar
                  className="w-full"
                />

                {/* Min/Max ko'rsatkichlar */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex flex-col items-start">
                    <span className="text-gray-400">
                      {t("common.buttons.bid_price_form.min_label")}
                    </span>
                    <span className="font-medium text-gray-700">
                      {priceRange.min.toLocaleString()}
                    </span>
                  </div>
                  <div className="hidden sm:flex flex-col items-center">
                    <span className="text-gray-400">
                      {t("common.buttons.bid_price_form.base_price")}
                    </span>
                    <span className="font-medium text-blue-600">
                      {priceRange.base.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-gray-400">
                      {t("common.buttons.bid_price_form.max_label")}
                    </span>
                    <span className="font-medium text-gray-700">
                      {priceRange.max.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Qo'shimcha izoh */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {t("common.buttons.bid_price_form.additional_notes")}
              </label>
              <textarea
                value={formData.comment}
                onChange={(e) => handleInputChange("comment", e.target.value)}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={t(
                  "common.buttons.bid_price_form.notes_placeholder"
                )}
              />
            </div>

            {/* Yuborish tugmasi */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading
                ? t("common.buttons.bid_price_form.sending_button")
                : t("common.buttons.bid_price_form.send_button")}
            </button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
