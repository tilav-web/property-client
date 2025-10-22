import { courtSvg, serverUrl } from "@/utils/shared";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import type { IProperty } from "@/interfaces/property.interface";
import { useTranslation } from "react-i18next";
import { useCurrentLanguage } from "@/hooks/use-language";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Building, MapPin } from "lucide-react";
import { useState } from "react";
import DateRangePicker from "../date-range-picker";

export default function BidPriceButton({ property }: { property: IProperty }) {
  const { t } = useTranslation();
  const { getLocalizedText } = useCurrentLanguage();
  const mainImage = property?.photos
    ? `${serverUrl}/uploads${property?.photos[0].file_path}`
    : "";

  const [formData, setFormData] = useState({
    type:
      property.purpose === "for_rent"
        ? "rent"
        : property.purpose === "auction"
        ? "purchase"
        : "",
    offered_price: "",
    rental_period_from: "",
    rental_period_to: "",
    comment: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Inquiry form data:", {
      ...formData,
      property_id: property._id,
      property_purpose: property.purpose,
    });
  };

  const handleInputChange = (field: string, value: string) => {
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
      <DialogContent className="sm:max-w-4xl h-[90vh] overflow-y-auto">
        <div className="w-full flex items-stretch">
          <div className="max-w-72 w-full h-52">
            <img
              className="w-full h-full object-cover"
              src={mainImage}
              alt={getLocalizedText(property?.title)}
            />
          </div>
          <div className="p-4 space-y-4 flex-1">
            <div className="space-y-2">
              <h3 className="text-xl font-bold tracking-tight">
                {getLocalizedText(property?.title)}
              </h3>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{getLocalizedText(property?.address)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Building className="h-4 w-4" />
                  <span>
                    {property?.region?.name}, {property?.district?.name}
                  </span>
                </div>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
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
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm font-medium">Holati</span>
                  </div>
                  <Badge
                    variant={
                      property?.construction_status === "ready"
                        ? "default"
                        : "outline"
                    }
                    className="font-semibold"
                  >
                    {property?.construction_status === "ready"
                      ? "🏠 Tayyor"
                      : "🏗️ Qurilayotgan"}
                  </Badge>
                </div>
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

        {/* Inquiry Form */}
        <div className="mt-6 p-6 border rounded-lg bg-slate-50">
          <h3 className="text-lg font-semibold mb-4">So'rov yuborish</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Inquiry Type Selection */}
            {property?.purpose !== "for_rent" &&
              property?.purpose !== "auction" && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    So'rov turi
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {property.purpose === "for_sale" && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleInputChange("type", "purchase")}
                          className={`p-3 border rounded-lg text-center transition-colors ${
                            formData.type === "purchase"
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          💰 Sotib olish
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
                          🏦 Ipoteka
                        </button>
                      </>
                    )}

                    {property.purpose === "for_commercial" && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleInputChange("type", "rent")}
                          className={`p-3 border rounded-lg text-center transition-colors ${
                            formData.type === "rent"
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          🏢 Ijaraga
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInputChange("type", "purchase")}
                          className={`p-3 border rounded-lg text-center transition-colors ${
                            formData.type === "purchase"
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          💼 Sotib olish
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}

            {/* Offered Price */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Taklif qilingan narx ({property?.currency?.toUpperCase()})
              </label>
              <input
                type="number"
                value={formData.offered_price}
                onChange={(e) =>
                  handleInputChange("offered_price", e.target.value)
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Taklifingizni kiriting"
              />
              <p className="text-sm p-2">
                {formData?.offered_price
                  ? Number(formData.offered_price).toLocaleString()
                  : "0"}{" "}
                so'm
              </p>
            </div>

            {/* Rental Period - faqat rent uchun */}
            {formData.type === "rent" && (
              <div className="w-full">
                <DateRangePicker />
              </div>
            )}

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Qo'shimcha izoh
              </label>
              <textarea
                value={formData.comment}
                onChange={(e) => handleInputChange("comment", e.target.value)}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Qo'shimcha ma'lumotlar yoki shartlaringizni yozing..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              So'rovni yuborish
            </button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
