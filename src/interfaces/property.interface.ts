import type { IDistrict } from "./district.interface";
import type { IFile } from "./file.interface";
import type { IRegion } from "./region.interface";
import type { IUser } from "./user.interface";

// ----- Types -----
export type Amenities =
  | "pool"
  | "balcony"
  | "security"
  | "air_conditioning"
  | "parking"
  | "elevator";

export const propertyAmenities = [
  "pool",
  "balcony",
  "security",
  "air_conditioning",
  "parking",
  "elevator",
];

export type PropertyCategory =
  | "apartment"
  | "house"
  | "villa"
  | "office"
  | "land"
  | "shop"
  | "garage";

export const propertyCategory = [
  "apartment",
  "house",
  "villa",
  "office",
  "land",
  "shop",
  "garage",
];

export type ConstructionStatus = "ready" | "under_construction" | "planned";
export const propertyConstructionStatus = [
  "ready",
  "under_construction",
  "planned",
];

export type PropertyPriceType = "sale" | "rent" | "total_price";
export const propertyPriceType = ["sale", "rent", "total_price"];

export type PropertyType = "sale" | "rent" | "commercial";
export const propertyType: PropertyType[] = ["sale", "rent", "commercial"];

export interface ILocation {
  type: "Point";
  coordinates: [number, number];
}

export interface ILanguage {
  uz: string;
  ru: string;
  en: string;
}

export interface IProperty {
  _id: string;
  author: IUser;

  // 3 til uchun yangi interfeyslar
  title: ILanguage;
  description: ILanguage;
  address: ILanguage;

  category: PropertyCategory;
  property_type: PropertyType;
  location: ILocation;
  price: number;
  rating: number;
  price_type: PropertyPriceType;
  area: number;
  bedrooms: number;
  bathrooms: number;
  floor_level?: number;
  total_floors?: number;
  amenities: Amenities[];
  construction_status: ConstructionStatus;
  year_built?: number;
  parking_spaces: number;
  is_premium: boolean;
  is_verified: boolean;
  is_active: boolean;
  view_count: number;
  expires_at?: Date;
  delivery_date?: Date;
  sales_date?: Date;
  payment_plans: number;
  region: IRegion;
  district: IDistrict;
  photos?: IFile[];
  videos?: IFile[];
  logo: string;
  createdAt: Date;
  updatedAt: Date;
}
