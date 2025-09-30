import mainImage from "@/assets/images/main-image.jpg";
import heroImage from "@/assets/images/hero-image.jpg";
import cardImage from "@/assets/images/card-image.jpg";
import cardImageLink from "@/assets/images/link.png";
import asideImage from "@/assets/images/aside-image.jpg";
import emaarImage from "@/assets/images/emaar-image.png";
import bannerImage1 from "@/assets/images/banner-image1.jpg";
import roleImage1 from "@/assets/images/role-image1.png";
import roleImage2 from "@/assets/images/role-image-2.png";
import roleImage3 from "@/assets/images/role-image3.png";
import imageCard from "@/assets/images/image-card.jpg";
import registerHouseImage from "@/assets/images/register-house-image.jpg";
import miniCardImage from "@/assets/images/mini-card-image.jpg";
import courtSvg from "@/assets/icons/court.svg";

export {
  mainImage,
  courtSvg,
  cardImage,
  cardImageLink,
  asideImage,
  bannerImage1,
  emaarImage,
  roleImage1,
  roleImage2,
  roleImage3,
  miniCardImage,
  imageCard,
  registerHouseImage,
  heroImage,
};

export const API_ENDPOINTS = {
  USER: {
    base: "/users",
    login: "/users/login",
    register: "/users/register",
    otpConfirm: "/users/confirm-otp",
    otpResend: "/users/resend-otp",
  },
};
