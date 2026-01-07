import type { TFunction } from "i18next";
import * as Yup from "yup";

export const userDetailsSchema = (t: TFunction) =>
  Yup.object({
    first_name: Yup.string()
      .min(2, t("user_details_tab.first_name_min_2"))
      .max(50, t("user_details_tab.first_name_max_50"))
      .required(t("user_details_tab.first_name_required")),
    last_name: Yup.string()
      .min(2, t("user_details_tab.last_name_min_2"))
      .max(50, t("user_details_tab.last_name_max_50"))
      .required(t("user_details_tab.last_name_required")),
    phone: Yup.string().required(t("user_details_tab.phone_required")),
    passport: Yup.string()
      .matches(/^[A-Z]{2} \d{7}$/, t("user_details_tab.passport_format"))
      .required(t("user_details_tab.passport_required")),
    lan: Yup.string()
      .oneOf(["uz", "en", "ru"], t("user_details_tab.language_invalid"))
      .required(t("user_details_tab.language_required")),
    business_type: Yup.string()
      .oneOf(
        ["self_employed", "ytt", "mchj"],
        t("user_details_tab.business_type_invalid")
      )
      .required(t("user_details_tab.business_type_required")),
  });
