import { useFormik } from "formik";
import * as Yup from "yup";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserStore } from "@/stores/user.store";
import BackTabsButton from "../buttons/back-tabs-button";
import NextButton from "@/components/common/buttons/next-button";
import { useSellerStore } from "@/stores/seller.store";
import { bankAccountService } from "@/services/bank-account.service";
import { useTranslation } from "react-i18next";

// Validation schema
const validationSchema = (t: any) => Yup.object({
  account_number: Yup.string()
    .matches(/^\d{20}$/, t("bank_account_number_tab.account_number_20_digits"))
    .required(t("bank_account_number_tab.account_number_required")),
  bank_name: Yup.string()
    .min(2, t("bank_account_number_tab.bank_name_min_2"))
    .max(100, t("bank_account_number_tab.bank_name_max_100"))
    .required(t("bank_account_number_tab.bank_name_required")),
  mfo: Yup.string()
    .matches(/^\d{5,6}$/, t("bank_account_number_tab.mfo_5_6_digits"))
    .required(t("bank_account_number_tab.mfo_required")),
  owner_full_name: Yup.string()
    .min(5, t("bank_account_number_tab.owner_full_name_min_5"))
    .max(100, t("bank_account_number_tab.owner_full_name_max_100"))
    .required(t("bank_account_number_tab.owner_full_name_required")),
  swift_code: Yup.string()
    .matches(
      /^[A-Z0-9]{8,11}$/,
      t("bank_account_number_tab.swift_code_8_11_digits")
    )
    .required(t("bank_account_number_tab.swift_code_required")),
});

interface FormValues {
  account_number: string;
  bank_name: string;
  mfo: string;
  owner_full_name: string;
  swift_code: string;
}

export default function BankAccountNumberTab({
  handleSelectTab,
}: {
  handleSelectTab: (tab: string) => void;
}) {
  const { user } = useUserStore();
  const { seller, setSeller } = useSellerStore();
  const { t } = useTranslation();

  const formik = useFormik<FormValues>({
    initialValues: {
      account_number: seller?.bank_account?.account_number || "",
      bank_name: seller?.bank_account?.bank_name || "",
      mfo: seller?.bank_account?.mfo || "",
      owner_full_name: `${user?.first_name || ""} ${
        user?.last_name || ""
      }`.trim(),
      swift_code: seller?.bank_account?.swift_code || "",
    },
    validationSchema: validationSchema(t),
    onSubmit: async (values) => {
      try {
        const data = await bankAccountService.create(values);
        setSeller(data);
        handleSelectTab("commissioner");
      } catch (error) {
        console.error(t("bank_account_number_tab.error_saving_bank_details"), error);
      }
    },
  });

  // Hisob raqamini formatlash (4 ta guruhga ajratish)
  const formatAccountNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    const groups = numbers.match(/.{1,4}/g);
    return groups ? groups.join(" ") : "";
  };

  const handleAccountNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const formattedValue = formatAccountNumber(e.target.value);
    formik.setFieldValue("account_number", formattedValue.replace(/\s/g, ""));
  };

  // SWIFT kodini katta harf qilish
  const handleSwiftCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    formik.setFieldValue("swift_code", value);
  };

  // MFO ni faqat raqam qabul qilish
  const handleMfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    formik.setFieldValue("mfo", value);
  };

  const handleSelectBankAccountNumber = () => {
    formik.handleSubmit();
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">{t("bank_account_number_tab.bank_account_number")}</h3>

      <form>
        <div className="space-y-4">
          {/* Bank nomi */}
          <div className="space-y-2">
            <Label htmlFor="bank_name">{t("bank_account_number_tab.bank_name")}</Label>
            <Input
              id="bank_name"
              name="bank_name"
              className={`bg-gray-50 ${
                formik.touched.bank_name && formik.errors.bank_name
                  ? "border-red-500"
                  : ""
              }`}
              placeholder={t("bank_account_number_tab.enter_bank_name")}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.bank_name}
            />
            {formik.touched.bank_name && formik.errors.bank_name && (
              <div className="text-red-500 text-sm">
                {formik.errors.bank_name}
              </div>
            )}
          </div>

          {/* Hisob raqami */}
          <div className="space-y-2">
            <Label htmlFor="account_number">{t("bank_account_number_tab.account_number_placeholder")}</Label>
            <Input
              id="account_number"
              name="account_number"
              className={`bg-gray-50 ${
                formik.touched.account_number && formik.errors.account_number
                  ? "border-red-500"
                  : ""
              }`}
              placeholder={t("bank_account_number_tab.account_number_placeholder")}
              value={formatAccountNumber(formik.values.account_number)}
              onChange={handleAccountNumberChange}
              onBlur={formik.handleBlur}
              maxLength={24} // 20 raqam + 4 bo'sh joy
            />
            {formik.touched.account_number && formik.errors.account_number && (
              <div className="text-red-500 text-sm">
                {formik.errors.account_number}
              </div>
            )}
          </div>

          {/* MFO va SWIFT kodi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mfo">{t("bank_account_number_tab.mfo")}</Label>
              <Input
                id="mfo"
                name="mfo"
                className={`bg-gray-50 ${
                  formik.touched.mfo && formik.errors.mfo
                    ? "border-red-500"
                    : ""
                }`}
                placeholder={t("bank_account_number_tab.mfo_number")}
                onChange={handleMfoChange}
                onBlur={formik.handleBlur}
                value={formik.values.mfo}
                maxLength={6}
              />
              {formik.touched.mfo && formik.errors.mfo && (
                <div className="text-red-500 text-sm">{formik.errors.mfo}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="swift_code">{t("bank_account_number_tab.swift_code")}</Label>
              <Input
                id="swift_code"
                name="swift_code"
                className={`bg-gray-50 uppercase ${
                  formik.touched.swift_code && formik.errors.swift_code
                    ? "border-red-500"
                    : ""
                }`}
                placeholder={t("bank_account_number_tab.swift_code_placeholder")}
                onChange={handleSwiftCodeChange}
                onBlur={formik.handleBlur}
                value={formik.values.swift_code}
                maxLength={11}
              />
              {formik.touched.swift_code && formik.errors.swift_code && (
                <div className="text-red-500 text-sm">
                  {formik.errors.swift_code}
                </div>
              )}
            </div>
          </div>

          {/* Hisob egasining to'liq ismi */}
          <div className="space-y-2">
            <Label htmlFor="owner_full_name">
              {t("bank_account_number_tab.owner_full_name")}
            </Label>
            <Input
              id="owner_full_name"
              name="owner_full_name"
              className={`bg-gray-50 ${
                formik.touched.owner_full_name && formik.errors.owner_full_name
                  ? "border-red-500"
                  : ""
              }`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.owner_full_name}
              placeholder={t("bank_account_number_tab.owner_full_name_placeholder")}
            />
            {formik.touched.owner_full_name &&
              formik.errors.owner_full_name && (
                <div className="text-red-500 text-sm">
                  {formik.errors.owner_full_name}
                </div>
              )}
          </div>
        </div>

        <div className="flex items-center gap-2 pt-4">
          <BackTabsButton onClick={() => handleSelectTab("busisess_details")} />
          <NextButton loading={false} onClick={handleSelectBankAccountNumber} />
        </div>
      </form>
    </div>
  );
}
