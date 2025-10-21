import { useState } from "react";
import { courtSvg } from "@/utils/shared";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import type { IProperty } from "@/interfaces/property.interface";
import { useTranslation } from "react-i18next";

interface InquiryFormData {
  type: string;
  offered_price?: number;
  rental_period?: {
    from: string;
    to: string;
  };
  comment: string;
}

interface AvailableInquiryType {
  value: string;
  label: string;
  icon: string;
  description: string;
}

export default function BidPriceButton({ property }: { property: IProperty }) {
  const [formData, setFormData] = useState<InquiryFormData>({
    type: "purchase",
    offered_price: property?.price || 0,
    comment: "",
  });
  const { t } = useTranslation();

  // Property purpose ga qarab available inquiry turlari
  const getAvailableInquiryTypes = (): AvailableInquiryType[] => {
    switch (property?.purpose) {
      case "for_sale":
        return [
          {
            value: "purchase",
            label: "Sotib olish",
            icon: "💰",
            description: "Mulkni to'liq sotib olish",
          },
          {
            value: "mortgage",
            label: "Ipoteka",
            icon: "🏦",
            description: "Ipoteka orqali sotib olish",
          },
        ];

      case "for_rent":
      case "for_commercial":
        return [
          {
            value: "purchase",
            label: "Sotib olish",
            icon: "💰",
            description: "Tijorat mulkini sotib olish",
          },
          {
            value: "rent",
            label: "Ijara",
            icon: "🏠",
            description: "Tijorat mulkini ijaraga olish",
          },
        ];

      case "for_investment":
        return [
          {
            value: "purchase",
            label: "Investitsiya",
            icon: "📈",
            description: "Investitsiya maqsadida sotib olish",
          },
        ];

      case "auction":
        return [
          {
            value: "purchase",
            label: "Auksion",
            icon: "🔨",
            description: "Auksionda qatnashish",
          },
        ];

      default:
        return [
          {
            value: "purchase",
            label: "Sotib olish",
            icon: "💰",
            description: "Mulkni sotib olish",
          },
        ];
    }
  };

  const availableTypes = getAvailableInquiryTypes();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const inquiryData = {
      ...formData,
      property: property?._id,
      property_title: property?.title?.uz || property?.title?.en || "Mulk",
      property_price: property?.price,
      property_currency: property?.currency,
      property_purpose: property?.purpose,
    };

    console.log("Inquiry Ma'lumotlari:", inquiryData);
    alert("So'rov muvaffaqiyatli yuborildi! Konsolga qarang.");
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="bg-[#FF990063] flex items-center gap-2 px-3 py-2 rounded border border-black text-sm min-w-0">
          <img src={courtSvg} alt="Court svg" className="w-4 h-4" />
          <span className="whitespace-nowrap">
            {t("common.buttons.bid_price")}
          </span>
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-6xl w-full max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl">
        <div className="p-6 w-full">
          {/* Sarlavha */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              So'rov yuborish
            </h2>
            <p className="text-gray-600 mt-2">Mulk egasiga so'rov yuboring</p>
          </div>

          {/* Mulk ma'lumotlari */}
          <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2 text-lg">
              {property?.title?.uz || property?.title?.en || "Mulk"}
            </h3>
            <div className="space-y-1 text-sm text-blue-800">
              <div className="flex justify-between">
                <span className="font-medium">Narx:</span>
                <span>
                  {property?.price?.toLocaleString()} {property?.currency}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Maydon:</span>
                <span>{property?.area}m²</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Maqsad:</span>
                <span className="capitalize">
                  {property?.purpose?.replace(/_/g, " ")}
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* So'rov turi */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                So'rov turi *
              </label>
              <div className="flex items-center gap-4">
                {availableTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleInputChange("type", type.value)}
                    className={`w-full p-4 border-2 rounded-xl text-left transition-all duration-200 ${
                      formData.type === type.value
                        ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md"
                        : "border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{type.icon}</div>
                      <div className="flex-1">
                        <div className="font-semibold">{type.label}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          {type.description}
                        </div>
                      </div>
                      {formData.type === type.value && (
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Narx va valyuta */}
            {(formData.type === "purchase" ||
              formData.type === "rent" ||
              formData.type === "mortgage") && (
              <div className="space-y-4">
                <div className="gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Taklif narxi *
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.offered_price || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "offered_price",
                          parseFloat(e.target.value)
                        )
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Ijara muddati */}
            {formData.type === "rent" && (
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-800">
                  Ijara muddati *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-2">
                      Boshlanish sanasi
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.rental_period?.from || ""}
                      onChange={(e) =>
                        handleInputChange("rental_period", {
                          ...formData.rental_period,
                          from: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-2">
                      Tugash sanasi
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.rental_period?.to || ""}
                      onChange={(e) =>
                        handleInputChange("rental_period", {
                          ...formData.rental_period,
                          to: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      min={
                        formData.rental_period?.from ||
                        new Date().toISOString().split("T")[0]
                      }
                    />
                  </div>
                </div>

                {/* Muddatni hisoblash */}
                {formData.rental_period?.from && formData.rental_period?.to && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-sm text-blue-800 font-medium">
                      Ijara muddati:{" "}
                      {Math.ceil(
                        (new Date(formData.rental_period.to).getTime() -
                          new Date(formData.rental_period.from).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      kun
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Qo'shimcha izoh */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Qo'shimcha izoh
              </label>
              <textarea
                value={formData.comment}
                onChange={(e) => handleInputChange("comment", e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="Mulk egasiga qo'shimcha ma'lumot yozing..."
                maxLength={1000}
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {formData.comment.length}/1000
              </div>
            </div>

            {/* Submit button */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors shadow-md hover:shadow-lg"
              >
                So'rov yuborish
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
