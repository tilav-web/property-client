import type { IFile } from "./file.interface";
import type { IUser } from "./user.interface";

// ----- Types -----
export type Amenities =
  | "pool"
  | "balcony"
  | "security"
  | "air_conditioning"
  | "parking"
  | "elevator";

export type PropertyCategory =
  | "apartment"
  | "house"
  | "villa"
  | "office"
  | "land"
  | "shop"
  | "garage";

export type ConstructionStatus = "ready" | "under_construction" | "planned";

export type PropertyPriceType = "sale" | "rent" | "total_price";

// ----- Interfaces -----
export interface ILocation {
  type: "Point";
  coordinates: [number, number];
}

export interface IProperty {
  _id: string;
  author: IUser;
  title: string;
  description: string;
  category: PropertyCategory;
  location: ILocation;
  address: string;
  price: number;
  price_type: PropertyPriceType;
  area: number;
  bedrooms: number;
  bathrooms: number;
  floor_level: number;
  amenities: Amenities[];
  construction_status: ConstructionStatus;
  year_built?: number;
  parking_spaces: number;
  is_premium: boolean;
  is_verified: boolean;
  is_new: boolean;
  is_guest_choice: boolean;
  rating: number;
  reviews_count: number;
  logo?: string | null;
  delivery_date?: Date;
  sales_date?: Date;
  payment_plans: number;
  photos?: IFile[];
  videos?: IFile[];
  createdAt?: Date;
  updatedAt?: Date;
}
