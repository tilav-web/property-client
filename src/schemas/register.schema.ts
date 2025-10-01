import * as Yup from "yup";

export const registerSchema = Yup.object({
  email: Yup.string().email().required(),
  password: Yup.string().min(8).required(),
  agreeToTerms: Yup.boolean().oneOf([true]),
});
