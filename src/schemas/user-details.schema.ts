import * as Yup from "yup";

// Validation schema
export const userDetailsSchema = Yup.object({
  first_name: Yup.string()
    .min(2, "Ism kamida 2 ta belgidan iborat boʻlishi kerak")
    .max(50, "Ism 50 ta belgidan oshmasligi kerak")
    .required("Ism toʻldirilishi shart"),
  last_name: Yup.string()
    .min(2, "Familiya kamida 2 ta belgidan iborat boʻlishi kerak")
    .max(50, "Familiya 50 ta belgidan oshmasligi kerak")
    .required("Familiya toʻldirilishi shart"),
  phone: Yup.string().required("Telefon raqami toʻldirilishi shart"),
  passport: Yup.string()
    .matches(/^[A-Z]{2} \d{7}$/, "Passport formati: AA 1234567")
    .required("Passport seriya va raqami toʻldirilishi shart"),
  lan: Yup.string()
    .oneOf(["uz", "en", "ru"], "Til notoʻgʻri tanlangan")
    .required("Til tanlanishi shart"),
  business_type: Yup.string()
    .oneOf(["self_employed", "ytt", "mchj"], "Biznes turi notoʻgʻri tanlangan")
    .required("Biznes turi tanlanishi shart"),
});
