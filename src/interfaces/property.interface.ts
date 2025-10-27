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
  | "retail"
  | "shop"
  | "hotel"
  | "industrial"
  | "warehouse"
  | "factory"
  | "land"
  | "farm"
  | "garage"
  | "parking";

export const propertyCategory: PropertyCategory[] = [
  "apartment",
  "house",
  "villa",
  "office",
  "retail",
  "shop",
  "hotel",
  "industrial",
  "warehouse",
  "factory",
  "land",
  "farm",
  "garage",
  "parking",
];

export type ConstructionStatus = "ready" | "under_construction" | "planned";
export const propertyConstructionStatus = [
  "ready",
  "under_construction",
  "planned",
];

export type PropertyPriceType = "sale" | "rent" | "total_price";
export const propertyPriceType = ["sale", "rent", "total_price"];

// YANGI: Property Type faqat fizik tur uchun
export type PropertyType =
  | "apartment" // Kvartira
  | "residential" // Turar-joy
  | "commercial" // Tijorat
  | "industrial" // Sanoat
  | "land" // Yer
  | "office" // Ofis
  | "retail" // Chakana savdo
  | "hotel" // Mehmonxona
  | "villa" // Villa
  | "house" // Uy
  | "garage"; // Garaj

export const propertyType: PropertyType[] = [
  "apartment",
  "residential",
  "commercial",
  "industrial",
  "land",
  "office",
  "retail",
  "hotel",
  "villa",
  "house",
  "garage",
];

// YANGI: Property Purpose (maqsad)
export type PropertyPurpose =
  | "for_sale" // Sotuvga
  | "for_rent" // Ijaraga
  | "for_commercial" // Tijorat maqsadida
  | "for_investment"
  | "auction";

export const propertyPurpose: PropertyPurpose[] = [
  "for_sale",
  "for_rent",
  "for_commercial",
  "for_investment",
  "auction",
];

export type PropertyCurrency = "uzs";
export const propertyCurrency: PropertyCurrency[] = ["uzs"];

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

  // YANGI: Asosiy maqsad (sotuv/ijara)
  purpose: PropertyPurpose;

  // YANGI: Valyuta
  currency: PropertyCurrency;

  location: ILocation;
  price: number;
  rating: number;

  // ESKI: Narx turi (qanday hisoblanadi)
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
  liked: number;
  saved: number;
  district: IDistrict;
  photos?: IFile[];
  videos?: IFile[];
  contract_file: IFile;
  logo: string;
  createdAt: Date;
  updatedAt: Date;
}
