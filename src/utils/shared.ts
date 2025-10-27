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
import defaultImageAvatar from "@/assets/images/default-avatar.png";
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
  defaultImageAvatar,
};

export const API_ENDPOINTS = {
  USER: {
    base: "/users",
    login: "/users/login",
    register: "/users/register",
    otpConfirm: "/users/confirm-otp",
    otpResend: "/users/resend-otp",
    refreshToken: "/users/refresh-token",
    me: "/users/me",
    logout: "/users/logout",
    like: "/users/like",
    likes: "/users/likes",
  },
  PROPERTIES: {
    base: "/properties",
    my: "/properties/my",
    message: "/properties/message",
  },
  SELLER: {
    base: "/sellers",
    me: "/sellers/me",
    create_ytt: "/sellers/ytt",
    create_mchj: "/sellers/mchj",
    create_self_employed: "/sellers/self-employed",
    create_physical: "/sellers/physical",
  },
  BANK_ACCOUNT: {
    base: "/bank-accounts",
  },
  COMMISSIONERS: {
    base: "/commissioners",
  },
  REGION: {
    base: "/regions",
  },
  DISTRICT: {
    base: "/districts",
  },
  MESSAGE: {
    base: "/messages",
    status: {
      base: "/messages/status",
      deleteOne: "/messages/status",
      deleteAll: "/messages/status/all",
      readOne: "/messages/status/read",
      readAll: "/messages/status/read-all",
      readCount: "/messages/status/unread-count",
    },
  },
  STATISTICS: {
    seller: "/statistics/seller",
  },
  ADVERTISE: {
    base: "advertise",
    priceCalculus: "advertise/price/calculus",
  },
};

// .ENV
export const serverUrl = import.meta.env.VITE_API_URL;
