import type { ILocation } from "../common/location/location.interface";
import type { CategoryType } from "../types/category.type";
import type { CurrencyType } from "../types/currency.type";
import type { IUser } from "../users/user.interface";
import type { IApartmentRent } from "./categories/apartment-rent.interface";
import type { IApartmentSale } from "./categories/apartment-sale.interface";

export interface IProperty {
  _id: string;
  author: IUser;

  title: string;
  description: string;
  address: string;

  category: CategoryType;

  location: ILocation;
  price: number;
  currency: CurrencyType;

  is_premium: boolean;
  is_verified: boolean;
  rating: number;

  liked: number;
  saved: number;
  photos?: string[];
  videos?: string[];

  createdAt: Date;
  updatedAt: Date;
}

export type PropertyType = IProperty | IApartmentRent | IApartmentSale;
