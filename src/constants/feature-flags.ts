// Telefon raqam orqali ro'yxatdan o'tish/kirish/parolni tiklash mamlakatga
// qarab yoqiladi. Eskiz faqat O'zbekiston'da ishlaydi, MY uchun yopiq.
//
// .env: VITE_PHONE_AUTH_ENABLED = true | false
//   - true: register/login/forgot-password sahifalarida "Phone" tab paydo bo'ladi
//   - false (default): faqat email + OAuth
//
// UZ build:  VITE_PHONE_AUTH_ENABLED = true
// MY build:  VITE_PHONE_AUTH_ENABLED = false (yoki o'rnatilmagan)
const raw = import.meta.env.VITE_PHONE_AUTH_ENABLED;
export const PHONE_AUTH_ENABLED = raw === "true" || raw === "1";
