import type { TFunction } from "i18next";
import * as Yup from "yup";

export const profileSchema = (t: TFunction) =>
  Yup.object({
    first_name: Yup.string()
      .required(t("user_details_tab.first_name_required"))
      .min(2, t("user_details_tab.first_name_min_2")),
    last_name: Yup.string()
      .required(t("user_details_tab.last_name_required"))
      .min(2, t("user_details_tab.last_name_min_2")),
    email: Yup.string()
      .email(t("user_details_tab.email_invalid"))
      .required(t("user_details_tab.email_required")),
    phone: Yup.string().required(t("user_details_tab.phone_required")),
    password: Yup.string()
      .min(6, t("user_details_tab.password_min_6"))
      .optional(),
  });
