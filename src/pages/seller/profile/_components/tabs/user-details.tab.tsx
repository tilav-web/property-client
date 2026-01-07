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
import type { SellerBusinessType } from "@/interfaces/users/seller.interface";
import { useSellerStore } from "@/stores/seller.store";
import { userDetailsSchema } from "@/schemas/user-details.schema";
import { useTranslation } from "react-i18next";

export default function UserDetailsTab({
  handleSelectTab,
}: {
  handleSelectTab: (tab: string) => void;
}) {
  const { user, setUser } = useUserStore();
  const { setSeller, seller } = useSellerStore();
  const [params] = useSearchParams();
  const business_type = params.get("business_type") as SellerBusinessType;
  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      phone: user?.phone?.value || "+998 ",
      passport: seller?.passport || "",
      lan: user?.lan || "uz",
      business_type: business_type || "self_employed",
    },
    validationSchema: userDetailsSchema(t),
    onSubmit: async (values) => {
      try {
        const data = await sellerService.createSeller(values);
        setUser(data.user);
        setSeller(data.seller);
        handleSelectTab("busisess_details");
      } catch (error) {
        console.error(t("user_details_tab.error_creating_seller"), error);
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
        {t("user_details_tab.personal_details")}
      </h3>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first_name">{t("user_details_tab.first_name")}</Label>
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
              placeholder={t("user_details_tab.enter_first_name")}
            />
            {formik.touched.first_name && formik.errors.first_name && (
              <div className="text-red-500 text-sm">
                {formik.errors.first_name}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="last_name">{t("user_details_tab.last_name")}</Label>
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
              placeholder={t("user_details_tab.enter_last_name")}
            />
            {formik.touched.last_name && formik.errors.last_name && (
              <div className="text-red-500 text-sm">
                {formik.errors.last_name}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">{t("user_details_tab.email")}</Label>
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
                title={t("user_details_tab.verified")}
              >
                <Check size={16} />
              </button>
            ) : (
              <button
                type="button"
                className="absolute right-2 top-0 bottom-0 my-auto text-red-500"
                title={t("user_details_tab.not_verified")}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="space-y-2 flex-1">
            <Label htmlFor="phone">{t("user_details_tab.phone")}</Label>
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
                placeholder={t("user_details_tab.phone_placeholder")}
              />
              {user?.phone?.isVerified ? (
                <button
                  type="button"
                  className="absolute right-2 top-0 bottom-0 my-auto text-green-500"
                  title={t("user_details_tab.verified")}
                >
                  <Check size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  className="absolute right-2 top-0 bottom-0 my-auto text-red-500"
                  title={t("user_details_tab.not_verified")}
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
            <Label htmlFor="passport">{t("user_details_tab.passport")}</Label>
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
              placeholder={t("user_details_tab.passport_placeholder")}
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
            <Label htmlFor="language">{t("user_details_tab.language")}</Label>
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
                <SelectValue placeholder={t("user_details_tab.select_language")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="uz">{t("user_details_tab.uzbek")}</SelectItem>
                <SelectItem value="en">{t("user_details_tab.english")}</SelectItem>
                <SelectItem value="ru">{t("user_details_tab.russian")}</SelectItem>
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
