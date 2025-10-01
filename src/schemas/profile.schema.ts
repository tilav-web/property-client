import * as Yup from "yup";

export const profileSchema = Yup.object({
  first_name: Yup.string()
    .required("Ism majburiy")
    .min(2, "Ism kamida 2 belgidan iborat bo'lishi kerak"),
  last_name: Yup.string()
    .required("Familiya majburiy")
    .min(2, "Familiya kamida 2 belgidan iborat bo'lishi kerak"),
  email: Yup.string()
    .email("Noto'g'ri email format")
    .required("Email majburiy"),
  phone: Yup.string().required("Telefon raqami majburiy"),
  password: Yup.string()
    .min(6, "Parol kamida 6 belgidan iborat bo'lishi kerak")
    .optional(),
});
