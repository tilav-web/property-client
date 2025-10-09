// Validation schema
import * as Yup from "yup";

export const yttBusinessDetailsSchema = Yup.object({
  company_name: Yup.string()
    .min(2, "Korxona nomi kamida 2 ta belgidan iborat boʻlishi kerak")
    .max(100, "Korxona nomi 100 ta belgidan oshmasligi kerak")
    .required("Korxona nomi toʻldirilishi shart"),
  inn: Yup.string()
    .matches(/^\d{9}$/, "STIR 9 ta raqamdan iborat boʻlishi kerak")
    .required("STIR toʻldirilishi shart"),
  pinfl: Yup.string()
    .matches(/^\d{14}$/, "JShShIR 14 ta raqamdan iborat boʻlishi kerak")
    .required("JShShIR toʻldirilishi shart"),
  business_reg_number: Yup.string()
    .min(1, "Roʻyxatdan oʻtish raqami toʻldirilishi shart")
    .required("Roʻyxatdan oʻtish raqami toʻldirilishi shart"),
  business_reg_address: Yup.string()
    .min(10, "Manzil kamida 10 ta belgidan iborat boʻlishi kerak")
    .required("Roʻyxatdan oʻtgan manzil toʻldirilishi shart"),
  is_vat_payer: Yup.boolean().required(),
});
