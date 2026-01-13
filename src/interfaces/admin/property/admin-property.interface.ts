import type { IProperty } from "@/interfaces/property/property.interface";
import type { ILanguage } from "@/interfaces/common/language/language.interface";
import type { IUser } from "@/interfaces/users/user.interface";
import type { CategoryType } from "@/interfaces/types/category.type";
import type { ILocation } from "@/interfaces/common/location/location.interface";
import type { CurrencyType } from "@/interfaces/types/currency.type";
import type { PropertyStatusType } from "@/interfaces/types/property.status.type";

export interface IAdminProperty extends Omit<IProperty, 'title' | 'description' | 'address'> {
  _id: string;
  author: IUser;

  title: ILanguage;
  description: ILanguage;
  address: ILanguage;

  category: CategoryType;

  location: ILocation;
  price: number;
  currency: CurrencyType;

  is_premium: boolean;
  is_archived: boolean;
  status: PropertyStatusType;
  rating: number;

  liked: number;
  saved: number;
  photos?: string[];
  videos?: string[];
  contract_file?: string;

  createdAt: Date;
  updatedAt: Date;
}
