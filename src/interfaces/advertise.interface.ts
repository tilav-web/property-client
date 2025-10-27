import type { IFile } from "./file.interface";
import type { PropertyCurrency } from "./property.interface";

export type AdvertiseType = "banner" | "aside" | "image";
export type AdvertiseStatus = "pending" | "approved" | "rejected" | "expired";

export interface IAdvertise {
  _id: string;
  author: string;
  target: string;
  type: AdvertiseType;
  status: AdvertiseStatus;
  from: string;
  to: string;
  price: number;
  currency: PropertyCurrency;
  image: IFile | null;
  createdAt?: string;
  updatedAt?: string;
}
