import { useUserStore } from "@/stores/user.store";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import type { PropertyType } from "@/interfaces/property/property.interface";
import { useTranslation } from "react-i18next";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { MapPin, FileSignature } from "lucide-react";
import DateRangePicker from "../date-range-picker";
import { inquiryService } from "@/services/inquiry.service";
import type { TInquiryType } from "@/interfaces/inquiry/inquiry.interface";
import { toast } from "sonner";
import { useState, useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input";

// Custom Hook for Screen Size
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false
  );

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [breakpoint]);

  return isMobile;
}

export default function FormalizeRentButton({
  property,
}: {
  property: PropertyType;
}) {
  const { user } = useUserStore();
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "rent" as TInquiryType,
    offered_price: "",
    rental_period: { from: new Date(), to: new Date() },
    comment: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const dto: any = {
      property: property?._id,
      type: formData.type,
      comment: formData.comment,
    };

    if (formData.offered_price) {
      dto.offered_price = Number(formData.offered_price);
    }

    if (formData.type === "rent" && formData.rental_period) {
      dto.rental_period = formData.rental_period;
    }

    try {
      await inquiryService.create(dto);
      toast.success("Muvaffaqiyatli", {
        description: "So'rovingiz muvaffaqiyatli yuborildi!",
      });
    } catch (error) {
      console.error("Failed to submit inquiry:", error);
      toast.error("Xatolik", {
        description: "So'rov yuborishda xatolik yuz berdi.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleDateChange = useCallback(
    (dateRange: { from: Date; to: Date }) => {
      setFormData((prev) => ({
        ...prev,
        rental_period: dateRange,
      }));
    },
    []
  );

  const handleNativeDateChange = (field: "from" | "to", value: string) => {
    setFormData((prev) => ({
      ...prev,
      rental_period: {
        ...prev.rental_period,
        [field]: new Date(value),
      },
    }));
  };

  if (user?._id === property?.author?._id || !user) {
    return (
      <button className="bg-blue-500/30 flex items-center sm:gap-2 px-3 py-2 rounded border border-black text-sm min-w-0">
        <FileSignature className="w-4 h-4" />
        <span className="whitespace-nowrap line-through hidden sm:block">
          {t("common.buttons.formalize_rent")}
        </span>
      </button>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="bg-blue-500/30 flex items-center gap-2 px-3 py-2 rounded border border-black text-sm min-w-0">
          <FileSignature className="w-4 h-4" />
          <span className="whitespace-nowrap hidden sm:block">
            {t("common.buttons.formalize_rent")}
          </span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="w-full flex flex-col lg:flex-row items-start">
          <div className="lg:max-w-72 w-full h-52 lg:h-auto">
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

        <div className="mt-6 p-6 border rounded-lg bg-slate-50">
          <h3 className="text-lg font-semibold mb-4">
            Ijarani rasmiylashtirish
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Taklif qilingan oylik ijara narxi (
                {property?.currency?.toUpperCase()})
              </label>
              <input
                type="number"
                value={formData.offered_price}
                onChange={(e) =>
                  handleInputChange("offered_price", e.target.value)
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Oylik ijara taklifingizni kiriting"
              />
              <p className="text-sm p-2">
                {formData?.offered_price
                  ? Number(formData.offered_price).toLocaleString()
                  : "0"}{" "}
                {property?.currency?.toUpperCase()}
              </p>
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium mb-2">
                Ijara muddati
              </label>
              {isMobile ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500">From</label>
                    <Input
                      type="date"
                      onChange={(e) =>
                        handleNativeDateChange("from", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">To</label>
                    <Input
                      type="date"
                      onChange={(e) =>
                        handleNativeDateChange("to", e.target.value)
                      }
                    />
                  </div>
                </div>
              ) : (
                <DateRangePicker onDateChange={handleDateChange} />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Qo'shimcha izoh
              </label>
              <textarea
                value={formData.comment}
                onChange={(e) => handleInputChange("comment", e.target.value)}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ijara shartlari yoki qo'shimcha talablaringizni yozing..."
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400"
            >
              {isLoading ? "Yuborilmoqda..." : "Ijara so'rovini yuborish"}
            </button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
