import type { CurrencyType } from "../types/currency.type";

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
  currency: CurrencyType;
  payment_status: string;
  from?: string;
  to?: string;
  image: string | null;
  createdAt?: string;
  updatedAt?: string;
}
