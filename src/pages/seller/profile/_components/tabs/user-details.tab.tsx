import { useFormik } from "formik";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserStore } from "@/stores/user.store";
import NextButton from "@/components/common/buttons/next-button";
import { Check, X } from "lucide-react";
import BackTabsButton from "../buttons/back-tabs-button";
import { useSearchParams } from "react-router-dom";
import { sellerService } from "@/services/seller.service";
import type { SellerBusinessType } from "@/interfaces/seller.interface";
import { useSellerStore } from "@/stores/seller.store";
import { userDetailsSchema } from "@/schemas/user-details.schema";

export default function UserDetailsTab({
  handleSelectTab,
}: {
  handleSelectTab: (tab: string) => void;
}) {
  const { user, setUser } = useUserStore();
  const { setSeller, seller } = useSellerStore();
  const [params] = useSearchParams();
  const business_type = params.get("business_type") as SellerBusinessType;

  const formik = useFormik({
    initialValues: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      phone: user?.phone?.value || "+998 ",
      passport: seller?.passport || "",
      lan: user?.lan || "uz",
      business_type: business_type || "self_employed",
    },
    validationSchema: userDetailsSchema,
    onSubmit: async (values) => {
      try {
        const data = await sellerService.createSeller(values);
        setUser(data.user);
        setSeller(data.seller);
        handleSelectTab("busisess_details");
      } catch (error) {
        console.error("Seller yaratishda xatolik:", error);
      }
    },
    enableReinitialize: true,
  });

  // Telefon raqamini formatlash
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.startsWith("998")) {
      return `+998 ${numbers.substring(3, 5)} ${numbers.substring(
        5,
        8
      )} ${numbers.substring(8, 10)} ${numbers.substring(10, 12)}`.trim();
    }
    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhoneNumber(e.target.value);
    formik.setFieldValue("phone", formattedValue);
  };

  // Passport seriyasini katta harf qilish
  const handlePassportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    formik.setFieldValue("passport", value);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">
        Shaxsiy ma'lumotlar
      </h3>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first_name">Ism *</Label>
            <Input
              id="first_name"
              name="first_name"
              value={formik.values.first_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`bg-gray-50 ${
                formik.touched.first_name && formik.errors.first_name
                  ? "border-red-500"
                  : ""
              }`}
              placeholder="Ismingizni kiriting"
            />
            {formik.touched.first_name && formik.errors.first_name && (
              <div className="text-red-500 text-sm">
                {formik.errors.first_name}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="last_name">Familiya *</Label>
            <Input
              id="last_name"
              name="last_name"
              value={formik.values.last_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`bg-gray-50 ${
                formik.touched.last_name && formik.errors.last_name
                  ? "border-red-500"
                  : ""
              }`}
              placeholder="Familiyangizni kiriting"
            />
            {formik.touched.last_name && formik.errors.last_name && (
              <div className="text-red-500 text-sm">
                {formik.errors.last_name}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="flex items-center gap-2 relative">
            <Input
              id="email"
              type="email"
              disabled
              value={user?.email?.value || ""}
              className="bg-gray-50 flex-1 pr-6"
            />
            {user?.email?.isVerified ? (
              <button
                type="button"
                className="absolute right-2 top-0 bottom-0 my-auto text-green-500"
                title="Tasdiqlangan"
              >
                <Check size={16} />
              </button>
            ) : (
              <button
                type="button"
                className="absolute right-2 top-0 bottom-0 my-auto text-red-500"
                title="Tasdiqlanmagan"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="space-y-2 flex-1">
            <Label htmlFor="phone">Telefon *</Label>
            <div className="flex items-center gap-2 relative">
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formik.values.phone}
                onChange={handlePhoneChange}
                onBlur={formik.handleBlur}
                className={`bg-gray-50 flex-1 pr-6 ${
                  formik.touched.phone && formik.errors.phone
                    ? "border-red-500"
                    : ""
                }`}
                placeholder="+998 XX XXX XX XX"
              />
              {user?.phone?.isVerified ? (
                <button
                  type="button"
                  className="absolute right-2 top-0 bottom-0 my-auto text-green-500"
                  title="Tasdiqlangan"
                >
                  <Check size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  className="absolute right-2 top-0 bottom-0 my-auto text-red-500"
                  title="Tasdiqlanmagan"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            {formik.touched.phone && formik.errors.phone && (
              <div className="text-red-500 text-sm">{formik.errors.phone}</div>
            )}
          </div>

          <div className="space-y-2 flex-1">
            <Label htmlFor="passport">Passport *</Label>
            <Input
              id="passport"
              name="passport"
              value={formik.values.passport}
              onChange={handlePassportChange}
              onBlur={formik.handleBlur}
              className={`bg-gray-50 flex-1 ${
                formik.touched.passport && formik.errors.passport
                  ? "border-red-500"
                  : ""
              }`}
              placeholder="AA 1234567"
              maxLength={10}
            />
            {formik.touched.passport && formik.errors.passport && (
              <div className="text-red-500 text-sm">
                {formik.errors.passport}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <Label htmlFor="language">Til *</Label>
            <Select
              name="lan"
              value={formik.values.lan}
              onValueChange={(value) => formik.setFieldValue("lan", value)}
            >
              <SelectTrigger
                className={`bg-gray-50 ${
                  formik.touched.lan && formik.errors.lan
                    ? "border-red-500"
                    : ""
                }`}
              >
                <SelectValue placeholder="Tilni tanlang" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="uz">O'zbekcha</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ru">Русский</SelectItem>
              </SelectContent>
            </Select>
            {formik.touched.lan && formik.errors.lan && (
              <div className="text-red-500 text-sm">{formik.errors.lan}</div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <BackTabsButton onClick={() => handleSelectTab("business_type")} />
            <NextButton loading={false} onClick={formik.handleSubmit} />
          </div>
        </div>
      </form>
    </div>
  );
}
