import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import NextButton from "@/components/common/buttons/next-button";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSellerStore } from "@/stores/seller.store";
import { sellerService } from "@/services/seller.service";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import { useUserStore } from "@/stores/user.store";

const validationSchema = (t: TFunction) =>
  Yup.object({
    first_name: Yup.string().required(
      t("physical_seller_register.first_name_required")
    ),
    last_name: Yup.string().required(
      t("physical_seller_register.last_name_required")
    ),
    middle_name: Yup.string().required(
      t("physical_seller_register.middle_name_required")
    ),
    birth_date: Yup.string().required(
      t("physical_seller_register.birth_date_required")
    ),
    jshshir: Yup.string()
      .matches(/^\d{14}$/, t("physical_seller_register.jshshir_14_digits"))
      .required(t("physical_seller_register.jshshir_required")),
    passport: Yup.string()
      .matches(/^[A-Z]{2}\d{7}$/, t("user_details_tab.passport_format_error"))
      .required(t("user_details_tab.passport_required")),
  });

export default function SelfEmployedForm() {
  const { setSeller } = useSellerStore();
  const { user } = useUserStore();
  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: {
      first_name: user?.first_name ?? "",
      last_name: user?.last_name ?? "",
      middle_name: "",
      birth_date: "",
      jshshir: "",
      passport: "",
      passport_file: null as File | null,
      self_employment_certificate: null as File | null,
    },
    validationSchema: validationSchema(t),
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
          if (key !== "seller" && value) {
            formData.append(key, value);
          }
        });
        const updatedSeller = await sellerService.createSelfEmployedSeller(
          formData
        );

        if (updatedSeller) {
          setSeller(updatedSeller);
        }
      } catch (error) {
        toast.error(t("physical_seller_register.failed_to_save_details"));
        console.error(error);
      }
    },
  });

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">
        {t("physical_seller_register.self_employed_details")}
      </h3>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first_name">
              {t("physical_seller_register.first_name")}
            </Label>
            <Input id="first_name" {...formik.getFieldProps("first_name")} />
            {formik.touched.first_name && formik.errors.first_name ? (
              <div className="text-red-500 text-sm">
                {formik.errors.first_name}
              </div>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="last_name">
              {t("physical_seller_register.last_name")}
            </Label>
            <Input id="last_name" {...formik.getFieldProps("last_name")} />
            {formik.touched.last_name && formik.errors.last_name ? (
              <div className="text-red-500 text-sm">
                {formik.errors.last_name}
              </div>
            ) : null}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="middle_name">
            {t("physical_seller_register.middle_name")}
          </Label>
          <Input id="middle_name" {...formik.getFieldProps("middle_name")} />
          {formik.touched.middle_name && formik.errors.middle_name ? (
            <div className="text-red-500 text-sm">
              {formik.errors.middle_name}
            </div>
          ) : null}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="birth_date">
              {t("physical_seller_register.birth_date")}
            </Label>
            <Input
              id="birth_date"
              type="date"
              {...formik.getFieldProps("birth_date")}
            />
            {formik.touched.birth_date && formik.errors.birth_date ? (
              <div className="text-red-500 text-sm">
                {formik.errors.birth_date}
              </div>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="jshshir">
              {t("physical_seller_register.jshshir")}
            </Label>
            <Input id="jshshir" {...formik.getFieldProps("jshshir")} />
            {formik.touched.jshshir && formik.errors.jshshir ? (
              <div className="text-red-500 text-sm">
                {formik.errors.jshshir}
              </div>
            ) : null}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="passport">{t("user_details_tab.passport")}</Label>
          <Input id="passport" {...formik.getFieldProps("passport")} />
          {formik.touched.passport && formik.errors.passport ? (
            <div className="text-red-500 text-sm">{formik.errors.passport}</div>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="passport_file">
            {t("physical_seller_register.passport_file")}
          </Label>
          <Input
            id="passport_file"
            type="file"
            onChange={(event) => {
              formik.setFieldValue(
                "passport_file",
                event.currentTarget.files?.[0]
              );
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="self_employment_certificate">
            {t("physical_seller_register.self_employment_certificate")}
          </Label>
          <Input
            id="self_employment_certificate"
            type="file"
            onChange={(event) => {
              formik.setFieldValue(
                "self_employment_certificate",
                event.currentTarget.files?.[0]
              );
            }}
          />
        </div>

        <div className="flex items-center justify-end">
          <NextButton
            onClick={formik.handleSubmit}
            loading={formik.isSubmitting}
          />
        </div>
      </form>
    </div>
  );
}
