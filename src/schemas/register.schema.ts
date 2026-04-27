import * as Yup from "yup";

const PHONE_REGEX = /^\+?\d{9,15}$/;

export const registerSchema = Yup.object({
  identifier: Yup.string()
    .required("Email yoki telefon kiritilmagan")
    .test(
      "email-or-phone",
      "Email yoki telefon raqami noto'g'ri",
      (value) => {
        if (!value) return false;
        const cleaned = value.replaceAll(/[\s-]/g, "");
        if (PHONE_REGEX.test(cleaned)) return true;
        return Yup.string().email().isValidSync(value);
      },
    ),
  password: Yup.string().min(8).required(),
  agreeToTerms: Yup.boolean().oneOf([true]),
});
