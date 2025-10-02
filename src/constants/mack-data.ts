import type { IProperty } from "@/interfaces/property.interface";
import { bannerImage1, emaarImage } from "@/utils/shared";

export const categories = [
  { key: "flats", count: "26 000" },
  { key: "dacha", count: "15 600" },
  { key: "rooms", count: "31 000" },
  { key: "office", count: "1 650" },
  { key: "land", count: "500" },
  { key: "business", count: "8 125" },
  { key: "basement", count: "22 000" },
  { key: "building", count: "9 560" },
];

export const property: IProperty = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  title: "Albero",
  description: "Ko‘p qavatli / G‘ishtli / 3 xonali",
  category: "Kvartira",
  location: "Toshkent, Mirzo Ulug‘bek 1-5",
  country: "O‘zbekiston",
  address: "Mirzo Ulug‘bek tumani, 25/2",
  price: 300000000,
  currency: "UZS",
  price_type: "umumiy summa",
  beds: "1 - 3 o‘rin",
  rooms: 3,
  is_premium: true,
  is_verified: true,
  is_new: true,
  is_guest_choice: true,
  delivery_date: "2029-yil 3-chorak",
  sales_date: "2025-yil 22-iyun",
  rating: 4.7,
  reviews_count: 128,
  images: [bannerImage1],
  video_count: 1,
  photo_count: 20,
  logo: emaarImage,
  payment_plans: 2,
};
