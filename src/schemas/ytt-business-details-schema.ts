import type { TFunction } from "i18next";
import * as Yup from "yup";

export const yttBusinessDetailsSchema = (t: TFunction) =>
  Yup.object({
    company_name: Yup.string()
      .min(2, t("ytt_section.company_name_min_2"))
      .max(100, t("ytt_section.company_name_max_100"))
      .required(t("ytt_section.company_name_required")),
    inn: Yup.string()
      .matches(/^\d{9}$/, t("ytt_section.stir_9_digits"))
      .required(t("ytt_section.stir_required")),
    pinfl: Yup.string()
      .matches(/^\d{14}$/, t("ytt_section.jshshir_14_digits"))
      .required(t("ytt_section.jshshir_required")),
    business_reg_number: Yup.string()
      .min(1, t("ytt_section.registration_number_required"))
      .required(t("ytt_section.registration_number_required")),
    business_reg_address: Yup.string()
      .min(10, t("ytt_section.address_min_10"))
      .required(t("ytt_section.registration_address_required")),
    is_vat_payer: Yup.boolean().required(),
  });
