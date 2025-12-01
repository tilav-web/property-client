import type { PropertyCurrency } from "../property/property.interface";

export type AdvertiseType = "banner" | "aside" | "image";
export type AdvertiseStatus = "pending" | "approved" | "rejected" | "expired";

export interface IAdvertise {
  _id: string;
  author: string;
  target: string;
  type: AdvertiseType;
  status: AdvertiseStatus;
  days: number;
  price: number;
  currency: PropertyCurrency;
  payment_status: string;
  from?: string;
  to?: string;
  image: string | null;
  createdAt?: string;
  updatedAt?: string;
}
