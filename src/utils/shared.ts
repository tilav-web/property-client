import heroImage from "@/assets/images/hero-image.webp";
import roleImage1 from "@/assets/images/role-image1.png";
import roleImage3 from "@/assets/images/role-image3.png";
import defaultImageAvatar from "@/assets/images/default-avatar.png";
import registerHouseImage from "@/assets/images/register-house-image.jpg";
import courtSvg from "@/assets/icons/court.svg";
import type { AdvertiseType } from "@/interfaces/advertise/advertise.interface";
import heroSectionCategoryImage from "@/assets/images/hero-section-category.jpg";
import logo from "@/assets/images/amaar-propert-logo.png";

export {
  courtSvg,
  roleImage1,
  roleImage3,
  registerHouseImage,
  heroImage,
  defaultImageAvatar,
  heroSectionCategoryImage,
  logo,
};

// .ENV
export const serverUrl = import.meta.env.VITE_API_URL;
export const googleMapKey = import.meta.env.VITE_GOOGLE_MAPS;
export const yandexMapKey = import.meta.env.VITE_YANDEX_MAP;

export const API_ENDPOINTS = {
  USER: {
    base: "/users/auth",
    login: "/users/auth/login",
    register: "/users/auth/register",
    otpConfirm: "/users/auth/confirm-otp",
    otpResend: "/users/auth/resend-otp",
    refreshToken: "/users/auth/refresh-token",
    me: "/users/auth/me",
    logout: "/users/auth/logout",
    like: "/users/auth/like",
    likes: "/users/auth/likes",
    auth: {
      google: `${serverUrl}/users/auth/google`,
      facebook: `${serverUrl}/users/auth/facebook`,
      apple: `${serverUrl}/users/auth/apple`,
    },
  },
  ADMIN: {
    base: "/admins",
    login: "/admins/login",
    profile: "/admins/profile",
    refreshToken: "/admins/refresh-token",
    users: {
      base: '/admins/users'
    },
    properties: '/admins/properties',
    sellers: '/admins/sellers',
    advertises: '/admins/advertises',
    logout: '/admins/logout',
    changePassword: '/admins/change-password',
    statistics: {
      dashboard: '/admins/statistics/dashboard',
    },
    admins: '/admins',
  },
  PROPERTIES: {
    base: "/properties",
    my: "/properties/my",
    message: "/properties/message",
    tags: {
      base: "tags",
      findTags: "/tags",
    },
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
    findMessageByProperty: (id: string) => `/messages/property/${id}`,
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
    sellerDashboard: "/statistics/seller-dashboard",
  },
  ADVERTISE: {
    base: "/advertise",
    priceCalculus: "/advertise/price/calculus",
    type: (type: AdvertiseType) => `/advertise/type/${type}`,
    incrementView: (id: string) => `/advertise/${id}/view`,
    incrementClick: (id: string) => `/advertise/${id}/click`,
  },
  LAYOUT: {
    mainPage: "/layouts/main-page",
    filterNav: "/layouts/filter-nav",
    categoryPage: "/layouts/category-page",
  },
  AI_PROPERTY: {
    searchProperty: "ai-property/search",
  },
  INQUIRY_RESPONSE: {
    base: "/inquiry-responses",
  },
  INQUIRY: {
    base: "/inquiry",
    myResponses: "/inquiry/my-responses",
  },
};
